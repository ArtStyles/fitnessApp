import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import {
  createPlanSchema,
  updatePlanSchema,
  planQuerySchema,
  markDayCompleteSchema,
} from './training-plans.schema'

const tierOrder: Record<string, number> = { basic: 0, premium: 1, vip: 2 }

function getAccessibleTiers(userTier: string): string[] {
  const level = tierOrder[userTier] ?? 0
  const tiers: string[] = ['basic']
  if (level >= 1) tiers.push('premium')
  if (level >= 2) tiers.push('vip')
  return tiers
}

export async function listPlans(userId: string, filters: z.infer<typeof planQuerySchema>) {
  const { goal, level, tier, search, page, limit } = filters
  const skip = (page - 1) * limit

  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  let query = supabase
    .from('TrainingPlan')
    .select(
      `*,
       trainer:Trainer(id, name, avatarUrl, specialty),
       enrollmentCount:Enrollment(count),
       weekCount:PlanWeek(count),
       userEnrollment:Enrollment!inner(id, currentWeek, currentDay, completedAt)`,
      { count: 'exact' }
    )
    .in('tier', accessibleTiers)
    .eq('userEnrollment.userId', userId)
    .order('createdAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (goal) query = query.eq('goal', goal)
  if (level) query = query.eq('level', level)
  if (tier) query = query.eq('tier', tier)
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  // Note: Supabase !inner join filters the parent. Use a separate approach for optional enrollment:
  // Fetch plans and user enrollments separately for reliability
  let plansQuery = supabase
    .from('TrainingPlan')
    .select(
      `*,
       trainer:Trainer(id, name, avatarUrl, specialty),
       enrollmentCount:Enrollment(count),
       weekCount:PlanWeek(count)`,
      { count: 'exact' }
    )
    .in('tier', accessibleTiers)
    .order('createdAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (goal) plansQuery = plansQuery.eq('goal', goal)
  if (level) plansQuery = plansQuery.eq('level', level)
  if (tier) plansQuery = plansQuery.eq('tier', tier)
  if (search) plansQuery = plansQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data: rawPlans, count: total, error } = await plansQuery

  if (error) throw new AppError('Failed to fetch training plans', 500, 'DB_ERROR')

  // Get user's enrollments separately
  const { data: userEnrollments } = await supabase
    .from('Enrollment')
    .select('id, planId, currentWeek, currentDay, completedAt')
    .eq('userId', userId)

  const plans = (rawPlans ?? []).map((p: any) => ({
    ...p,
    _count: {
      enrollments: p.enrollmentCount?.[0]?.count ?? 0,
      weeks: p.weekCount?.[0]?.count ?? 0,
    },
    enrollments: (userEnrollments ?? []).filter((e: any) => e.planId === p.id),
    enrollmentCount: undefined,
    weekCount: undefined,
  }))

  return {
    plans,
    pagination: { total: total ?? 0, page, limit, totalPages: Math.ceil((total ?? 0) / limit) },
  }
}

export async function getPlanById(id: string, userId: string) {
  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  const { data: plan, error } = await supabase
    .from('TrainingPlan')
    .select(`
      *,
      trainer:Trainer(*),
      createdBy:User!TrainingPlan_createdById_fkey(id, name),
      weeks:PlanWeek(*, days:PlanDay(*, workout:Workout(id, title, durationMinutes, difficulty, category, imageUrl)))
    `)
    .eq('id', id)
    .single()

  if (error || !plan) throw new AppError('Training plan not found', 404, 'NOT_FOUND')
  if (!accessibleTiers.includes(plan.tier)) {
    throw new AppError(
      `This plan requires ${plan.tier} subscription or higher`,
      403,
      'SUBSCRIPTION_REQUIRED'
    )
  }

  // Get user enrollment with day progress
  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select('*, dayProgress:EnrollmentDayProgress(*)')
    .eq('userId', userId)
    .eq('planId', id)
    .maybeSingle()

  // Sort weeks and days
  const sortedWeeks = ((plan.weeks as any[]) ?? [])
    .sort((a: any, b: any) => a.weekNumber - b.weekNumber)
    .map((week: any) => ({
      ...week,
      days: ((week.days as any[]) ?? []).sort((a: any, b: any) => a.dayNumber - b.dayNumber),
    }))

  return {
    ...plan,
    weeks: sortedWeeks,
    enrollments: enrollment ? [enrollment] : [],
  }
}

export async function createPlan(data: z.infer<typeof createPlanSchema>, createdById: string) {
  const { weeks, ...planData } = data
  const planId = crypto.randomUUID()
  const now = new Date().toISOString()

  const { error: planError } = await supabase.from('TrainingPlan').insert({
    id: planId,
    ...planData,
    createdById,
    updatedAt: now,
  })

  if (planError) throw new AppError('Failed to create training plan', 500, 'DB_ERROR')

  // Create weeks and days
  for (const week of weeks) {
    const weekId = crypto.randomUUID()
    await supabase.from('PlanWeek').insert({
      id: weekId,
      planId,
      weekNumber: week.weekNumber,
    })

    if (week.days.length > 0) {
      await supabase.from('PlanDay').insert(
        week.days.map(day => ({
          id: crypto.randomUUID(),
          weekId,
          dayNumber: day.dayNumber,
          label: day.label,
          isRest: day.isRest,
          workoutId: day.workoutId ?? null,
        }))
      )
    }
  }

  const { data: plan } = await supabase
    .from('TrainingPlan')
    .select('*, weeks:PlanWeek(*, days:PlanDay(*)), trainer:Trainer(*)')
    .eq('id', planId)
    .single()

  return {
    ...plan,
    weeks: ((plan?.weeks as any[]) ?? [])
      .sort((a: any, b: any) => a.weekNumber - b.weekNumber)
      .map((w: any) => ({
        ...w,
        days: ((w.days as any[]) ?? []).sort((a: any, b: any) => a.dayNumber - b.dayNumber),
      })),
  }
}

export async function updatePlan(id: string, data: z.infer<typeof updatePlanSchema>) {
  const { data: existing } = await supabase
    .from('TrainingPlan')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Training plan not found', 404, 'NOT_FOUND')

  const { weeks, ...planData } = data

  if (weeks !== undefined) {
    // Get existing week IDs
    const { data: existingWeeks } = await supabase
      .from('PlanWeek')
      .select('id')
      .eq('planId', id)

    const weekIds = (existingWeeks ?? []).map((w: any) => w.id)

    // Delete days in those weeks (cascade would handle it, but let's be explicit)
    if (weekIds.length > 0) {
      await supabase.from('PlanDay').delete().in('weekId', weekIds)
    }

    // Delete weeks
    await supabase.from('PlanWeek').delete().eq('planId', id)

    // Recreate weeks and days
    for (const week of weeks) {
      const weekId = crypto.randomUUID()
      await supabase.from('PlanWeek').insert({
        id: weekId,
        planId: id,
        weekNumber: week.weekNumber,
      })

      if (week.days.length > 0) {
        await supabase.from('PlanDay').insert(
          week.days.map(day => ({
            id: crypto.randomUUID(),
            weekId,
            dayNumber: day.dayNumber,
            label: day.label,
            isRest: day.isRest,
            workoutId: day.workoutId ?? null,
          }))
        )
      }
    }
  }

  if (Object.keys(planData).length > 0) {
    await supabase
      .from('TrainingPlan')
      .update({ ...planData, updatedAt: new Date().toISOString() })
      .eq('id', id)
  }

  const { data: plan } = await supabase
    .from('TrainingPlan')
    .select('*, weeks:PlanWeek(*, days:PlanDay(*)), trainer:Trainer(*)')
    .eq('id', id)
    .single()

  return {
    ...plan,
    weeks: ((plan?.weeks as any[]) ?? [])
      .sort((a: any, b: any) => a.weekNumber - b.weekNumber)
      .map((w: any) => ({
        ...w,
        days: ((w.days as any[]) ?? []).sort((a: any, b: any) => a.dayNumber - b.dayNumber),
      })),
  }
}

export async function deletePlan(id: string) {
  const { data: existing } = await supabase
    .from('TrainingPlan')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Training plan not found', 404, 'NOT_FOUND')
  await supabase.from('TrainingPlan').delete().eq('id', id)
}

export async function enrollUser(userId: string, planId: string) {
  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .maybeSingle()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  const { data: plan } = await supabase
    .from('TrainingPlan')
    .select('*, weeks:PlanWeek(*, days:PlanDay(*))')
    .eq('id', planId)
    .maybeSingle()

  if (!plan) throw new AppError('Training plan not found', 404, 'NOT_FOUND')
  if (!accessibleTiers.includes(plan.tier)) {
    throw new AppError(`This plan requires ${plan.tier} subscription`, 403, 'SUBSCRIPTION_REQUIRED')
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('Enrollment')
    .select('id')
    .eq('userId', userId)
    .eq('planId', planId)
    .maybeSingle()

  if (existing) throw new AppError('Already enrolled in this plan', 409, 'ALREADY_ENROLLED')

  // Create enrollment
  const enrollmentId = crypto.randomUUID()
  await supabase.from('Enrollment').insert({
    id: enrollmentId,
    userId,
    planId,
  })

  // Build day progress entries
  const sortedWeeks = ((plan.weeks as any[]) ?? []).sort(
    (a: any, b: any) => a.weekNumber - b.weekNumber
  )

  const dayProgressData: {
    id: string
    enrollmentId: string
    weekNumber: number
    dayNumber: number
  }[] = []

  for (const week of sortedWeeks) {
    const sortedDays = ((week.days as any[]) ?? []).sort(
      (a: any, b: any) => a.dayNumber - b.dayNumber
    )
    for (const day of sortedDays) {
      dayProgressData.push({
        id: crypto.randomUUID(),
        enrollmentId,
        weekNumber: week.weekNumber,
        dayNumber: day.dayNumber,
      })
    }
  }

  if (dayProgressData.length > 0) {
    await supabase.from('EnrollmentDayProgress').insert(dayProgressData)
  }

  // Increment enrolledCount
  const { data: planRow } = await supabase
    .from('TrainingPlan')
    .select('enrolledCount')
    .eq('id', planId)
    .single()

  await supabase
    .from('TrainingPlan')
    .update({
      enrolledCount: (planRow?.enrolledCount ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', planId)

  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select('*, dayProgress:EnrollmentDayProgress(*), plan:TrainingPlan(id, title)')
    .eq('id', enrollmentId)
    .single()

  return enrollment
}

export async function unenrollUser(userId: string, planId: string) {
  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select('id')
    .eq('userId', userId)
    .eq('planId', planId)
    .maybeSingle()

  if (!enrollment) throw new AppError('Not enrolled in this plan', 404, 'NOT_FOUND')

  await supabase.from('Enrollment').delete().eq('id', enrollment.id)

  // Decrement enrolledCount
  const { data: planRow } = await supabase
    .from('TrainingPlan')
    .select('enrolledCount')
    .eq('id', planId)
    .single()

  await supabase
    .from('TrainingPlan')
    .update({
      enrolledCount: Math.max(0, (planRow?.enrolledCount ?? 1) - 1),
      updatedAt: new Date().toISOString(),
    })
    .eq('id', planId)
}

export async function getEnrollment(userId: string, planId: string) {
  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select('*, dayProgress:EnrollmentDayProgress(*), plan:TrainingPlan(id, title, durationWeeks, daysPerWeek)')
    .eq('userId', userId)
    .eq('planId', planId)
    .maybeSingle()

  if (!enrollment) throw new AppError('Enrollment not found', 404, 'NOT_FOUND')
  return enrollment
}

export async function getMyEnrollments(userId: string) {
  const { data: enrollments, error } = await supabase
    .from('Enrollment')
    .select('*, dayProgress:EnrollmentDayProgress(*), plan:TrainingPlan(id, title, durationWeeks, daysPerWeek, imageUrl)')
    .eq('userId', userId)
    .order('enrolledAt', { ascending: false })

  if (error) throw new AppError('Failed to fetch enrollments', 500, 'DB_ERROR')
  return enrollments ?? []
}

export async function getActiveEnrollment(userId: string) {
  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select(`
      *,
      dayProgress:EnrollmentDayProgress(*),
      plan:TrainingPlan(
        *,
        weeks:PlanWeek(
          *,
          days:PlanDay(
            *,
            workout:Workout(id, title, durationMinutes, difficulty)
          )
        )
      )
    `)
    .eq('userId', userId)
    .is('completedAt', null)
    .order('enrolledAt', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!enrollment) return null

  // Sort weeks and days
  const plan = enrollment.plan as any
  if (plan?.weeks) {
    plan.weeks = plan.weeks
      .sort((a: any, b: any) => a.weekNumber - b.weekNumber)
      .map((w: any) => ({
        ...w,
        days: ((w.days as any[]) ?? []).sort((a: any, b: any) => a.dayNumber - b.dayNumber),
      }))
  }

  return enrollment
}

export async function markDayComplete(
  userId: string,
  planId: string,
  data: z.infer<typeof markDayCompleteSchema>
) {
  const { weekNumber, dayNumber } = data

  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select(`
      *,
      plan:TrainingPlan(*, weeks:PlanWeek(*, days:PlanDay(*))),
      dayProgress:EnrollmentDayProgress(*)
    `)
    .eq('userId', userId)
    .eq('planId', planId)
    .maybeSingle()

  if (!enrollment) throw new AppError('Enrollment not found', 404, 'NOT_FOUND')
  if (enrollment.completedAt) throw new AppError('Plan already completed', 400, 'ALREADY_COMPLETED')

  const now = new Date().toISOString()

  // Mark day as complete
  await supabase
    .from('EnrollmentDayProgress')
    .update({ completedAt: now })
    .eq('enrollmentId', enrollment.id)
    .eq('weekNumber', weekNumber)
    .eq('dayNumber', dayNumber)
    .is('completedAt', null)

  // Determine next week/day
  const plan = enrollment.plan as any
  const allWeeks = ((plan?.weeks as any[]) ?? []).sort(
    (a: any, b: any) => a.weekNumber - b.weekNumber
  )

  const currentWeekData = allWeeks.find((w: any) => w.weekNumber === weekNumber)
  const sortedDays = ((currentWeekData?.days as any[]) ?? []).sort(
    (a: any, b: any) => a.dayNumber - b.dayNumber
  )
  const nextDayInWeek = sortedDays.find((d: any) => d.dayNumber > dayNumber)

  let nextWeek = weekNumber
  let nextDay = dayNumber + 1

  if (!nextDayInWeek) {
    // Move to next week
    const nextWeekData = allWeeks.find((w: any) => w.weekNumber > weekNumber)
    if (nextWeekData) {
      const nextWeekDays = ((nextWeekData.days as any[]) ?? []).sort(
        (a: any, b: any) => a.dayNumber - b.dayNumber
      )
      nextWeek = nextWeekData.weekNumber
      nextDay = nextWeekDays[0]?.dayNumber ?? 1
    } else {
      // Plan complete
      await supabase
        .from('Enrollment')
        .update({ completedAt: now, currentWeek: weekNumber, currentDay: dayNumber })
        .eq('id', enrollment.id)

      const { data: finalEnrollment } = await supabase
        .from('Enrollment')
        .select('*, dayProgress:EnrollmentDayProgress(*)')
        .eq('id', enrollment.id)
        .single()

      return finalEnrollment
    }
  }

  await supabase
    .from('Enrollment')
    .update({ currentWeek: nextWeek, currentDay: nextDay })
    .eq('id', enrollment.id)

  const { data: updatedEnrollment } = await supabase
    .from('Enrollment')
    .select('*, dayProgress:EnrollmentDayProgress(*)')
    .eq('id', enrollment.id)
    .single()

  return updatedEnrollment
}

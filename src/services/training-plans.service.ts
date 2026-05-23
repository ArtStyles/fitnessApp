import { get, getList, post, put, patch, del } from '@/src/lib/api'
import type { TrainingPlan, Enrollment } from '@/src/types'

function normPlan(d: any): TrainingPlan {
  return {
    id:            d.id,
    title:         d.title,
    description:   d.description,
    tier:          d.tier,
    durationWeeks: d.durationWeeks,
    daysPerWeek:   d.daysPerWeek,
    goal:          d.goal,
    level:         d.level,
    image:         d.imageUrl ?? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    weeks:         (d.weeks ?? []).map((w: any) => ({
      week: w.weekNumber,
      days: (w.days ?? []).map((day: any) => ({
        day:       day.dayNumber,
        workoutId: day.workoutId ?? null,
        label:     day.label,
        isRest:    day.isRest,
      })),
    })),
    enrolledCount: d.enrolledCount ?? 0,
    trainerId:     d.trainerId ?? '',
  }
}

function normEnrollment(d: any): Enrollment {
  return {
    id:          d.id,
    userId:      d.userId,
    planId:      d.planId,
    enrolledAt:  d.enrolledAt,
    currentWeek: d.currentWeek,
    currentDay:  d.currentDay,
    dayProgress: (d.dayProgress ?? []).map((p: any) => ({
      week:        p.weekNumber,
      day:         p.dayNumber,
      completedAt: p.completedAt ?? null,
    })),
    completedAt: d.completedAt ?? null,
  }
}

// ── Plans ─────────────────────────────────────────────────────────────────────

export async function fetchPlans(filters: Record<string, any> = {}) {
  const { items, meta } = await getList<any>('/training-plans', filters)
  return { plans: items.map(normPlan), pagination: meta }
}

export async function fetchPlan(id: string): Promise<TrainingPlan> {
  return normPlan(await get<any>(`/training-plans/${id}`))
}

// ── Enrollments ───────────────────────────────────────────────────────────────

export async function enrollInPlan(planId: string): Promise<Enrollment> {
  return normEnrollment(await post<any>(`/training-plans/${planId}/enroll`))
}

export async function unenrollFromPlan(planId: string): Promise<void> {
  await del(`/training-plans/${planId}/enroll`)
}

export async function fetchMyEnrollments(): Promise<Enrollment[]> {
  const raw = await get<any>('/training-plans/my-enrollments')
  return (raw ?? []).map(normEnrollment)
}

export async function markPlanDayComplete(
  planId: string,
  week: number,
  day: number,
): Promise<void> {
  await patch(`/training-plans/${planId}/enrollment/complete-day`, { weekNumber: week, dayNumber: day })
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminCreatePlan(data: any): Promise<TrainingPlan> {
  return normPlan(await post<any>('/training-plans', data))
}

export async function adminUpdatePlan(id: string, data: any): Promise<TrainingPlan> {
  return normPlan(await put<any>(`/training-plans/${id}`, data))
}

export async function adminDeletePlan(id: string): Promise<void> {
  await del(`/training-plans/${id}`)
}

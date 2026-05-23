import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  workoutQuerySchema,
  completeWorkoutSchema,
} from './workouts.schema'
import { createNotification } from '../notifications/notifications.service'
import { checkAndUnlockBadges } from '../gamification/gamification.service'

const POINTS_PER_WORKOUT = 50
const POINTS_PER_LEVEL = 500

const tierOrder: Record<string, number> = { basic: 0, premium: 1, vip: 2 }

function getAccessibleTiers(userTier: string): string[] {
  const level = tierOrder[userTier] ?? 0
  const tiers: string[] = ['basic']
  if (level >= 1) tiers.push('premium')
  if (level >= 2) tiers.push('vip')
  return tiers
}

export async function listWorkouts(userId: string, filters: z.infer<typeof workoutQuerySchema>) {
  const { category, difficulty, tier, search, muscleGroup, equipment, page, limit } = filters
  const skip = (page - 1) * limit

  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  let query = supabase
    .from('Workout')
    .select(
      `*, trainer:Trainer(id, name, avatarUrl, specialty), exercises:WorkoutExercise(count), sessions:WorkoutSession(count)`,
      { count: 'exact' }
    )
    .in('tier', accessibleTiers)
    .order('createdAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (category) query = query.ilike('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (tier) query = query.eq('tier', tier)
  if (muscleGroup) query = query.contains('muscleGroups', [muscleGroup])
  if (equipment) query = query.contains('equipment', [equipment])
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data: rawWorkouts, count: total, error } = await query

  if (error) throw new AppError('Failed to fetch workouts', 500, 'DB_ERROR')

  const workouts = (rawWorkouts ?? []).map((w: any) => ({
    ...w,
    _count: {
      exercises: w.exercises?.[0]?.count ?? 0,
      sessions: w.sessions?.[0]?.count ?? 0,
    },
    exercises: undefined,
    sessions: undefined,
  }))

  return {
    workouts,
    pagination: { total: total ?? 0, page, limit, totalPages: Math.ceil((total ?? 0) / limit) },
  }
}

export async function getWorkoutById(id: string, userId: string) {
  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  const { data: workout, error } = await supabase
    .from('Workout')
    .select(`
      *,
      exercises:WorkoutExercise(*, exercise:ExerciseLibrary(*)),
      trainer:Trainer(*),
      createdBy:User!Workout_createdById_fkey(id, name)
    `)
    .eq('id', id)
    .single()

  if (error || !workout) throw new AppError('Workout not found', 404, 'NOT_FOUND')
  if (!accessibleTiers.includes(workout.tier)) {
    throw new AppError(
      `This workout requires ${workout.tier} subscription or higher`,
      403,
      'SUBSCRIPTION_REQUIRED'
    )
  }

  // Sort exercises by orderIndex
  return {
    ...workout,
    exercises: ((workout.exercises as any[]) ?? []).sort(
      (a: any, b: any) => a.orderIndex - b.orderIndex
    ),
  }
}

export async function createWorkout(data: z.infer<typeof createWorkoutSchema>, createdById: string) {
  const { exercises, ...workoutData } = data
  const workoutId = crypto.randomUUID()
  const now = new Date().toISOString()

  const { error: workoutError } = await supabase.from('Workout').insert({
    id: workoutId,
    ...workoutData,
    createdById,
    updatedAt: now,
  })

  if (workoutError) throw new AppError('Failed to create workout', 500, 'DB_ERROR')

  if (exercises.length > 0) {
    await supabase.from('WorkoutExercise').insert(
      exercises.map(e => ({
        id: crypto.randomUUID(),
        workoutId,
        exerciseId: e.exerciseId,
        sets: e.sets,
        reps: e.reps,
        restSeconds: e.restSeconds,
        notes: e.notes ?? null,
        orderIndex: e.orderIndex,
      }))
    )
  }

  const { data: workout } = await supabase
    .from('Workout')
    .select('*, exercises:WorkoutExercise(*, exercise:ExerciseLibrary(*)), trainer:Trainer(*)')
    .eq('id', workoutId)
    .single()

  return {
    ...workout,
    exercises: ((workout?.exercises as any[]) ?? []).sort(
      (a: any, b: any) => a.orderIndex - b.orderIndex
    ),
  }
}

export async function updateWorkout(id: string, data: z.infer<typeof updateWorkoutSchema>) {
  const { data: existing } = await supabase
    .from('Workout')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Workout not found', 404, 'NOT_FOUND')

  const { exercises, ...workoutData } = data

  if (exercises !== undefined) {
    // Delete existing exercises and recreate
    await supabase.from('WorkoutExercise').delete().eq('workoutId', id)

    if (exercises.length > 0) {
      await supabase.from('WorkoutExercise').insert(
        exercises.map(e => ({
          id: crypto.randomUUID(),
          workoutId: id,
          exerciseId: e.exerciseId,
          sets: e.sets,
          reps: e.reps,
          restSeconds: e.restSeconds,
          notes: e.notes ?? null,
          orderIndex: e.orderIndex,
        }))
      )
    }
  }

  await supabase
    .from('Workout')
    .update({ ...workoutData, updatedAt: new Date().toISOString() })
    .eq('id', id)

  const { data: workout } = await supabase
    .from('Workout')
    .select('*, exercises:WorkoutExercise(*, exercise:ExerciseLibrary(*)), trainer:Trainer(*)')
    .eq('id', id)
    .single()

  return {
    ...workout,
    exercises: ((workout?.exercises as any[]) ?? []).sort(
      (a: any, b: any) => a.orderIndex - b.orderIndex
    ),
  }
}

export async function deleteWorkout(id: string) {
  const { data: existing } = await supabase
    .from('Workout')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Workout not found', 404, 'NOT_FOUND')
  await supabase.from('Workout').delete().eq('id', id)
}

export async function startSession(userId: string, workoutId: string) {
  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  const { data: workout } = await supabase
    .from('Workout')
    .select('id, tier')
    .eq('id', workoutId)
    .maybeSingle()

  if (!workout) throw new AppError('Workout not found', 404, 'NOT_FOUND')
  if (!accessibleTiers.includes(workout.tier)) {
    throw new AppError(`This workout requires ${workout.tier} subscription`, 403, 'SUBSCRIPTION_REQUIRED')
  }

  const sessionId = crypto.randomUUID()
  await supabase.from('WorkoutSession').insert({
    id: sessionId,
    userId,
    workoutId,
  })

  const { data: session } = await supabase
    .from('WorkoutSession')
    .select(`
      *,
      workout:Workout(*, exercises:WorkoutExercise(*, exercise:ExerciseLibrary(*)))
    `)
    .eq('id', sessionId)
    .single()

  return {
    ...session,
    workout: session?.workout
      ? {
          ...session.workout,
          exercises: ((session.workout as any).exercises ?? []).sort(
            (a: any, b: any) => a.orderIndex - b.orderIndex
          ),
        }
      : null,
  }
}

export async function completeSession(
  userId: string,
  sessionId: string,
  data: z.infer<typeof completeWorkoutSchema>
) {
  const { data: session } = await supabase
    .from('WorkoutSession')
    .select('*, workout:Workout(id)')
    .eq('id', sessionId)
    .maybeSingle()

  if (!session) throw new AppError('Session not found', 404, 'NOT_FOUND')
  if (session.userId !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN')
  if (session.completedAt) throw new AppError('Session already completed', 400, 'ALREADY_COMPLETED')

  const now = new Date()
  const { durationMinutes, notes, exerciseLogs } = data

  // Update session
  await supabase
    .from('WorkoutSession')
    .update({ completedAt: now.toISOString(), durationMinutes, notes })
    .eq('id', sessionId)

  // Create exercise logs
  if (exerciseLogs.length > 0) {
    await supabase.from('ExerciseLog').insert(
      exerciseLogs.map(log => ({
        id: crypto.randomUUID(),
        sessionId,
        exerciseId: log.exerciseId,
        setNumber: log.setNumber,
        reps: log.reps ?? null,
        weightKg: log.weightKg ?? null,
        durationSec: log.durationSec ?? null,
      }))
    )
  }

  // Increment workout completedBy count
  const { data: workoutRow } = await supabase
    .from('Workout')
    .select('completedBy')
    .eq('id', session.workoutId)
    .single()

  await supabase
    .from('Workout')
    .update({ completedBy: (workoutRow?.completedBy ?? 0) + 1, updatedAt: now.toISOString() })
    .eq('id', session.workoutId)

  // Update user stats
  const { data: stats } = await supabase
    .from('UserStats')
    .select('*')
    .eq('userId', userId)
    .maybeSingle()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastWorkout = stats?.lastWorkoutDate ? new Date(stats.lastWorkoutDate) : null
  lastWorkout?.setHours(0, 0, 0, 0)

  let newStreak = 1
  if (lastWorkout && lastWorkout.getTime() === yesterday.getTime()) {
    newStreak = (stats?.currentStreak ?? 0) + 1
  } else if (lastWorkout && lastWorkout.getTime() === today.getTime()) {
    newStreak = stats?.currentStreak ?? 1
  }

  const newPoints = (stats?.points ?? 0) + POINTS_PER_WORKOUT
  const newLevel = Math.floor(newPoints / POINTS_PER_LEVEL) + 1

  await supabase
    .from('UserStats')
    .update({
      workoutsCompleted: (stats?.workoutsCompleted ?? 0) + 1,
      totalMinutes: (stats?.totalMinutes ?? 0) + durationMinutes,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, stats?.longestStreak ?? 0),
      points: newPoints,
      level: newLevel,
      lastWorkoutDate: now.toISOString(),
      updatedAt: now.toISOString(),
    })
    .eq('userId', userId)

  // Check and unlock badges
  const newBadges = await checkAndUnlockBadges(userId)

  for (const badge of newBadges) {
    await createNotification(
      userId,
      'achievement',
      `Badge Unlocked: ${badge.name}`,
      badge.description,
      '/gamification'
    )
  }

  // Streak milestone notifications
  if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
    await createNotification(
      userId,
      'streak',
      `${newStreak}-Day Streak!`,
      `Incredible! You've worked out ${newStreak} days in a row. Keep it up!`,
      '/progress'
    )
  }

  // Level up notification
  if (stats && newLevel > stats.level) {
    await createNotification(
      userId,
      'achievement',
      `Level Up! You're now Level ${newLevel}`,
      `You reached Level ${newLevel} with ${newPoints} total points!`,
      '/gamification'
    )
  }

  const { data: completedSession } = await supabase
    .from('WorkoutSession')
    .select('*, workout:Workout(id, title), exerciseLogs:ExerciseLog(*)')
    .eq('id', sessionId)
    .single()

  return completedSession
}

export async function getUserHistory(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit

  const { data: sessions, count: total, error } = await supabase
    .from('WorkoutSession')
    .select(
      `*, workout:Workout(id, title, durationMinutes, category, difficulty, imageUrl), exerciseLogs:ExerciseLog(*)`,
      { count: 'exact' }
    )
    .eq('userId', userId)
    .not('completedAt', 'is', null)
    .order('completedAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (error) throw new AppError('Failed to fetch history', 500, 'DB_ERROR')

  return {
    sessions: sessions ?? [],
    pagination: { total: total ?? 0, page, limit, totalPages: Math.ceil((total ?? 0) / limit) },
  }
}

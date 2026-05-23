import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import { updateProfileSchema, updateSubscriptionSchema } from './users.schema'

const USER_SELECT = 'id, name, email, avatarUrl, role, subscriptionTier, onboardingCompleted, createdAt, updatedAt'

export async function getUserById(id: string) {
  const { data: user, error } = await supabase
    .from('User')
    .select(`${USER_SELECT}, stats:UserStats(*), onboarding:OnboardingProfile(*)`)
    .eq('id', id)
    .single()

  if (error || !user) throw new AppError('User not found', 404, 'NOT_FOUND')

  return {
    ...user,
    stats: Array.isArray(user.stats) ? (user.stats[0] ?? null) : user.stats,
    onboarding: Array.isArray(user.onboarding) ? (user.onboarding[0] ?? null) : user.onboarding,
  }
}

export async function updateProfile(userId: string, data: z.infer<typeof updateProfileSchema>) {
  const { data: user, error } = await supabase
    .from('User')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', userId)
    .select(USER_SELECT)
    .single()

  if (error || !user) throw new AppError('User not found', 404, 'NOT_FOUND')
  return user
}

export async function updateSubscription(userId: string, data: z.infer<typeof updateSubscriptionSchema>) {
  const { data: user, error } = await supabase
    .from('User')
    .update({ subscriptionTier: data.tier, updatedAt: new Date().toISOString() })
    .eq('id', userId)
    .select(USER_SELECT)
    .single()

  if (error || !user) throw new AppError('User not found', 404, 'NOT_FOUND')
  return user
}

export async function listUsers(page: number, limit: number, search?: string) {
  const skip = (page - 1) * limit

  let query = supabase
    .from('User')
    .select(USER_SELECT, { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: users, count, error } = await query

  if (error) throw new AppError('Failed to fetch users', 500, 'DB_ERROR')

  return {
    users: users ?? [],
    pagination: {
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  }
}

export async function deleteUser(userId: string) {
  const { data: user } = await supabase.from('User').select('id').eq('id', userId).maybeSingle()
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND')
  await supabase.from('User').delete().eq('id', userId)
}

export async function getUserStats(userId: string) {
  const { data: user, error } = await supabase
    .from('User')
    .select(`
      id, name,
      stats:UserStats(*),
      userBadges:UserBadge(*, badge:Badge(*)),
      workoutSessions:WorkoutSession(*, workout:Workout(id, title, durationMinutes, category))
    `)
    .eq('id', userId)
    .single()

  if (error || !user) throw new AppError('User not found', 404, 'NOT_FOUND')

  // Get recent completed sessions only
  const { data: recentSessions } = await supabase
    .from('WorkoutSession')
    .select('*, workout:Workout(id, title, durationMinutes, category)')
    .eq('userId', userId)
    .not('completedAt', 'is', null)
    .order('completedAt', { ascending: false })
    .limit(10)

  // Get completed challenges
  const { data: completedChallenges } = await supabase
    .from('ChallengeParticipant')
    .select('*, challenge:Challenge(*)')
    .eq('userId', userId)
    .not('completedAt', 'is', null)
    .order('completedAt', { ascending: false })
    .limit(5)

  return {
    id: user.id,
    name: user.name,
    stats: Array.isArray(user.stats) ? (user.stats[0] ?? null) : user.stats,
    userBadges: Array.isArray(user.userBadges) ? user.userBadges : [],
    workoutSessions: recentSessions ?? [],
    challengeParticipants: completedChallenges ?? [],
  }
}

import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import { createBadgeSchema, createChallengeSchema, updateChallengeSchema } from './gamification.schema'

const POINTS_PER_LEVEL = 500

const BADGE_CHECKS: { name: string; check: (s: any) => boolean }[] = [
  { name: 'first_workout', check: (s) => s.workoutsCompleted >= 1 },
  { name: 'workouts_10', check: (s) => s.workoutsCompleted >= 10 },
  { name: 'workouts_50', check: (s) => s.workoutsCompleted >= 50 },
  { name: 'workouts_100', check: (s) => s.workoutsCompleted >= 100 },
  { name: 'streak_7', check: (s) => s.currentStreak >= 7 },
  { name: 'streak_30', check: (s) => s.currentStreak >= 30 },
]

export function getUserLevel(points: number): number {
  return Math.floor(points / POINTS_PER_LEVEL) + 1
}

export async function checkAndUnlockBadges(userId: string): Promise<{ name: string; description: string }[]> {
  const [{ data: stats }, { data: userBadges }, { data: allBadges }] = await Promise.all([
    supabase.from('UserStats').select('*').eq('userId', userId).maybeSingle(),
    supabase.from('UserBadge').select('badgeId').eq('userId', userId),
    supabase.from('Badge').select('*'),
  ])

  if (!stats) return []

  const ownedBadgeIds = new Set((userBadges ?? []).map((ub: any) => ub.badgeId))
  const badgeMap = new Map((allBadges ?? []).map((b: any) => [b.name, b]))
  const newlyUnlocked: { name: string; description: string }[] = []

  for (const { name, check } of BADGE_CHECKS) {
    const badge = badgeMap.get(name)
    if (!badge) continue
    if (ownedBadgeIds.has(badge.id)) continue

    if (check(stats)) {
      await supabase.from('UserBadge').insert({
        id: crypto.randomUUID(),
        userId,
        badgeId: badge.id,
      })
      newlyUnlocked.push({ name: badge.name, description: badge.description })
    }
  }

  return newlyUnlocked
}

export async function getUserGamification(userId: string) {
  const now = new Date().toISOString()

  const [
    { data: stats },
    { data: userBadges },
    { data: allBadges },
    { data: activeChallenges },
    { data: userParticipations },
  ] = await Promise.all([
    supabase.from('UserStats').select('*').eq('userId', userId).maybeSingle(),
    supabase.from('UserBadge').select('*, badge:Badge(*)').eq('userId', userId).order('unlockedAt', { ascending: false }),
    supabase.from('Badge').select('*').order('category', { ascending: true }),
    supabase
      .from('Challenge')
      .select('*, participantCount:ChallengeParticipant(count)')
      .eq('isActive', true)
      .gte('endDate', now)
      .lte('startDate', now),
    supabase
      .from('ChallengeParticipant')
      .select('id, challengeId, currentValue, completedAt, joinedAt')
      .eq('userId', userId),
  ])

  const ownedBadgeIds = new Set((userBadges ?? []).map((ub: any) => ub.badgeId))

  const badgesWithStatus = (allBadges ?? []).map((badge: any) => ({
    ...badge,
    isUnlocked: ownedBadgeIds.has(badge.id),
    unlockedAt: (userBadges ?? []).find((ub: any) => ub.badgeId === badge.id)?.unlockedAt ?? null,
  }))

  const challengesWithStatus = (activeChallenges ?? []).map((challenge: any) => {
    const userParticipation = (userParticipations ?? []).find(
      (p: any) => p.challengeId === challenge.id
    )
    return {
      ...challenge,
      isParticipating: !!userParticipation,
      userProgress: userParticipation ?? null,
      _count: { participants: challenge.participantCount?.[0]?.count ?? 0 },
      participantCount: undefined,
    }
  })

  return {
    stats,
    level: getUserLevel(stats?.points ?? 0),
    pointsToNextLevel: POINTS_PER_LEVEL - ((stats?.points ?? 0) % POINTS_PER_LEVEL),
    badges: badgesWithStatus,
    recentBadges: (userBadges ?? []).slice(0, 5),
    challenges: challengesWithStatus,
  }
}

export async function listBadges(userId: string) {
  const [{ data: allBadges }, { data: userBadges }] = await Promise.all([
    supabase.from('Badge').select('*').order('category', { ascending: true }).order('threshold', { ascending: true }),
    supabase.from('UserBadge').select('badgeId, unlockedAt').eq('userId', userId),
  ])

  const ownedMap = new Map((userBadges ?? []).map((ub: any) => [ub.badgeId, ub.unlockedAt]))

  return (allBadges ?? []).map((badge: any) => ({
    ...badge,
    isUnlocked: ownedMap.has(badge.id),
    unlockedAt: ownedMap.get(badge.id) ?? null,
  }))
}

export async function listActiveChallenges(userId: string) {
  const now = new Date().toISOString()

  const [{ data: challenges }, { data: userParticipations }] = await Promise.all([
    supabase
      .from('Challenge')
      .select('*, participantCount:ChallengeParticipant(count)')
      .eq('isActive', true)
      .gte('endDate', now)
      .order('endDate', { ascending: true }),
    supabase
      .from('ChallengeParticipant')
      .select('id, challengeId, currentValue, completedAt, joinedAt')
      .eq('userId', userId),
  ])

  return (challenges ?? []).map((challenge: any) => {
    const userParticipation = (userParticipations ?? []).find(
      (p: any) => p.challengeId === challenge.id
    )
    return {
      ...challenge,
      isParticipating: !!userParticipation,
      userProgress: userParticipation ?? null,
      _count: { participants: challenge.participantCount?.[0]?.count ?? 0 },
      participantCount: undefined,
    }
  })
}

export async function joinChallenge(userId: string, challengeId: string) {
  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .maybeSingle()

  const { data: challenge } = await supabase
    .from('Challenge')
    .select('*')
    .eq('id', challengeId)
    .maybeSingle()

  if (!challenge) throw new AppError('Challenge not found', 404, 'NOT_FOUND')
  if (!challenge.isActive) throw new AppError('Challenge is not active', 400, 'CHALLENGE_INACTIVE')
  if (new Date(challenge.endDate) < new Date()) throw new AppError('Challenge has ended', 400, 'CHALLENGE_ENDED')

  const tierOrder: Record<string, number> = { basic: 0, premium: 1, vip: 2 }
  const userTierLevel = tierOrder[userRow?.subscriptionTier ?? 'basic'] ?? 0
  const challengeTierLevel = tierOrder[challenge.tier] ?? 0

  if (userTierLevel < challengeTierLevel) {
    throw new AppError(`This challenge requires ${challenge.tier} subscription`, 403, 'SUBSCRIPTION_REQUIRED')
  }

  const { data: existing } = await supabase
    .from('ChallengeParticipant')
    .select('id')
    .eq('challengeId', challengeId)
    .eq('userId', userId)
    .maybeSingle()

  if (existing) throw new AppError('Already participating in this challenge', 409, 'ALREADY_JOINED')

  const { data: participant, error } = await supabase
    .from('ChallengeParticipant')
    .insert({
      id: crypto.randomUUID(),
      challengeId,
      userId,
    })
    .select('*, challenge:Challenge(*)')
    .single()

  if (error) throw new AppError('Failed to join challenge', 500, 'DB_ERROR')
  return participant
}

export async function getLeaderboard() {
  const { data: topUsers, error } = await supabase
    .from('UserStats')
    .select('*, user:User(id, name, avatarUrl, subscriptionTier)')
    .order('points', { ascending: false })
    .limit(10)

  if (error) throw new AppError('Failed to fetch leaderboard', 500, 'DB_ERROR')

  return (topUsers ?? []).map((entry: any, index: number) => ({
    rank: index + 1,
    userId: entry.userId,
    name: entry.user?.name,
    avatarUrl: entry.user?.avatarUrl,
    subscriptionTier: entry.user?.subscriptionTier,
    points: entry.points,
    level: getUserLevel(entry.points),
    workoutsCompleted: entry.workoutsCompleted,
    currentStreak: entry.currentStreak,
  }))
}

export async function createBadge(data: z.infer<typeof createBadgeSchema>) {
  const { data: badge, error } = await supabase
    .from('Badge')
    .insert({ id: crypto.randomUUID(), ...data })
    .select('*')
    .single()

  if (error) throw new AppError('Failed to create badge', 500, 'DB_ERROR')
  return badge
}

export async function createChallenge(data: z.infer<typeof createChallengeSchema>) {
  const { data: challenge, error } = await supabase
    .from('Challenge')
    .insert({
      id: crypto.randomUUID(),
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    })
    .select('*')
    .single()

  if (error) throw new AppError('Failed to create challenge', 500, 'DB_ERROR')
  return challenge
}

export async function updateChallenge(id: string, data: z.infer<typeof updateChallengeSchema>) {
  const { data: existing } = await supabase
    .from('Challenge')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Challenge not found', 404, 'NOT_FOUND')

  const { data: challenge, error } = await supabase
    .from('Challenge')
    .update({
      ...data,
      ...(data.startDate && { startDate: new Date(data.startDate).toISOString() }),
      ...(data.endDate && { endDate: new Date(data.endDate).toISOString() }),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new AppError('Failed to update challenge', 500, 'DB_ERROR')
  return challenge
}

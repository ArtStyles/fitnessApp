import { get, post } from '@/src/lib/api'
import type { Badge, Challenge, AppNotification } from '@/src/types'

function normBadge(b: any): Badge {
  return {
    id:          b.id,
    name:        b.name,
    description: b.description,
    icon:        b.icon,
    category:    b.category,
    unlockedAt:  b.unlockedAt ?? undefined,
    locked:      !b.isUnlocked,
    requirement: b.requirement,
  }
}

function normChallenge(c: any): Challenge {
  return {
    id:           c.id,
    title:        c.title,
    description:  c.description,
    goal:         c.goalValue,
    current:      c.userProgress?.currentValue ?? 0,
    unit:         c.goalType === 'total_minutes' ? 'minutos' : 'entrenamientos',
    endsAt:       c.endDate,
    reward:       `${c.pointsReward} puntos`,
    tier:         c.tier,
    participants: c._count?.participants ?? 0,
  }
}

function normNotification(n: any): AppNotification {
  return {
    id:        n.id,
    type:      n.type,
    title:     n.title,
    message:   n.message,
    createdAt: n.createdAt,
    read:      n.isRead,
    actionUrl: n.actionUrl ?? undefined,
  }
}

// ── Gamification summary ──────────────────────────────────────────────────────

export interface GamificationSummary {
  badges:           Badge[]
  challenges:       Challenge[]
  level:            number
  pointsToNextLevel: number
  stats:            any
}

export async function fetchGamification(): Promise<GamificationSummary> {
  const raw = await get<any>('/gamification')
  return {
    badges:            (raw.badges ?? []).map(normBadge),
    challenges:        (raw.challenges ?? []).map(normChallenge),
    level:             raw.level ?? 1,
    pointsToNextLevel: raw.pointsToNextLevel ?? 500,
    stats:             raw.stats,
  }
}

export async function fetchBadges(): Promise<Badge[]> {
  const raw = await get<any>('/gamification/badges')
  return (raw ?? []).map(normBadge)
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const raw = await get<any>('/gamification/challenges')
  return (raw ?? []).map(normChallenge)
}

export async function joinChallenge(challengeId: string): Promise<void> {
  await post(`/gamification/challenges/${challengeId}/join`)
}

export async function fetchLeaderboard() {
  return get<any>('/gamification/leaderboard')
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<AppNotification[]> {
  const raw = await get<any>('/notifications')
  // backend returns the array directly in data
  const list = Array.isArray(raw) ? raw : (raw.notifications ?? [])
  return list.map(normNotification)
}

export async function markNotificationsRead(): Promise<void> {
  await post('/notifications/read-all')
}

export async function markOneRead(id: string): Promise<void> {
  await post(`/notifications/${id}/read`)
}

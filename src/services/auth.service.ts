import { get, post } from '@/src/lib/api'
import { tokenStore } from '@/src/lib/api'
import type { User, SubscriptionTier, OnboardingProfile } from '@/src/types'

// ── Normalize backend user → frontend User shape ──────────────────────────────

export function normalizeUser(d: any): User {
  return {
    id: d.id,
    email: d.email,
    name: d.name,
    avatar: d.avatarUrl ?? undefined,
    subscription: d.subscriptionTier as SubscriptionTier,
    role: d.role,
    joinedAt: d.createdAt,
    onboarding: d.onboarding
      ? {
          goal: d.onboarding.goal,
          level: d.onboarding.level,
          equipment: d.onboarding.equipment ?? [],
          daysPerWeek: d.onboarding.daysPerWeek,
          completed: d.onboardingCompleted ?? true,
        }
      : d.onboardingCompleted
        ? { goal: 'stay_healthy', level: 'beginner', equipment: [], daysPerWeek: 3, completed: true }
        : undefined,
    stats: {
      workoutsCompleted: d.stats?.workoutsCompleted ?? 0,
      streakDays:        d.stats?.currentStreak    ?? 0,
      totalMinutes:      d.stats?.totalMinutes      ?? 0,
      currentStreak:     d.stats?.currentStreak    ?? 0,
      longestStreak:     d.stats?.longestStreak    ?? 0,
      points:            d.stats?.points            ?? 0,
      level:             d.stats?.level             ?? 1,
    },
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

interface AuthResponse {
  user: any
  accessToken: string
}

export async function apiLogin(email: string, password: string): Promise<User> {
  const data = await post<AuthResponse>('/auth/login', { email, password })
  tokenStore.set(data.accessToken)
  return normalizeUser(data.user)
}

export async function apiRegister(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const data = await post<AuthResponse>('/auth/register', { name, email, password })
  tokenStore.set(data.accessToken)
  return normalizeUser(data.user)
}

export async function apiLogout(): Promise<void> {
  try { await post('/auth/logout') } catch { /* ignore */ }
  tokenStore.clear()
}

export async function apiGetMe(): Promise<User> {
  const data = await get<any>('/auth/me')
  return normalizeUser(data)
}

export async function apiSaveOnboarding(profile: Omit<OnboardingProfile, 'completed'>): Promise<void> {
  await post('/auth/onboarding', {
    goal:        profile.goal,
    level:       profile.level,
    equipment:   profile.equipment,
    daysPerWeek: profile.daysPerWeek,
  })
}

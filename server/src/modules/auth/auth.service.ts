import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabase } from '../../config/database'
import { env } from '../../config/env'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import { registerSchema, loginSchema, onboardingSchema } from './auth.schema'

const SALT_ROUNDS = 12

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  })
  const refreshToken = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  })
  return { accessToken, refreshToken }
}

async function storeRefreshToken(userId: string, token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('RefreshToken').insert({
    id: crypto.randomUUID(),
    userId,
    token,
    expiresAt,
  })
}

export async function register(data: z.infer<typeof registerSchema>) {
  // Check if email already taken
  const { data: existing } = await supabase
    .from('User')
    .select('id')
    .eq('email', data.email)
    .maybeSingle()

  if (existing) throw new AppError('Email already in use', 409, 'EMAIL_TAKEN')

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)
  const now = new Date().toISOString()
  const userId = crypto.randomUUID()

  // Create user
  const { data: user, error: userError } = await supabase
    .from('User')
    .insert({
      id: userId,
      name: data.name,
      email: data.email,
      passwordHash,
      updatedAt: now,
    })
    .select('id, name, email, role, subscriptionTier, onboardingCompleted, avatarUrl, createdAt')
    .single()

  if (userError) throw new AppError('Failed to create user', 500, 'DB_ERROR')

  // Create user stats
  await supabase.from('UserStats').insert({
    userId,
    updatedAt: now,
  })

  const { accessToken, refreshToken } = generateTokens(user.id)
  await storeRefreshToken(user.id, refreshToken)

  return { user, accessToken, refreshToken }
}

export async function login(data: z.infer<typeof loginSchema>) {
  const { data: user, error } = await supabase
    .from('User')
    .select('*')
    .eq('email', data.email)
    .maybeSingle()

  if (error || !user) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')

  const valid = await bcrypt.compare(data.password, user.passwordHash)
  if (!valid) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')

  const { accessToken, refreshToken } = generateTokens(user.id)
  await storeRefreshToken(user.id, refreshToken)

  const { passwordHash: _, ...safeUser } = user
  return { user: safeUser, accessToken, refreshToken }
}

export async function refreshTokens(token: string) {
  let payload: any
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET)
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN')
  }

  const { data: stored } = await supabase
    .from('RefreshToken')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (!stored || stored.userId !== payload.sub || new Date(stored.expiresAt) < new Date()) {
    throw new AppError('Refresh token not found or expired', 401, 'INVALID_REFRESH_TOKEN')
  }

  // Rotate token
  await supabase.from('RefreshToken').delete().eq('id', stored.id)

  const { data: user } = await supabase
    .from('User')
    .select('id, role, subscriptionTier')
    .eq('id', payload.sub)
    .maybeSingle()

  if (!user) throw new AppError('User not found', 401, 'UNAUTHORIZED')

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id)
  await storeRefreshToken(user.id, newRefreshToken)

  return { accessToken, refreshToken: newRefreshToken }
}

export async function logout(token: string) {
  await supabase.from('RefreshToken').delete().eq('token', token)
}

export async function getMe(userId: string) {
  const { data, error } = await supabase
    .from('User')
    .select(`
      id, name, email, avatarUrl, role, subscriptionTier, onboardingCompleted, createdAt, updatedAt,
      stats:UserStats(*),
      onboarding:OnboardingProfile(*),
      userBadges:UserBadge(*, badge:Badge(*))
    `)
    .eq('id', userId)
    .single()

  if (error || !data) throw new AppError('User not found', 404, 'NOT_FOUND')

  // Normalize one-to-one relations (Supabase returns them as arrays when FK is in related table)
  return {
    ...data,
    stats: Array.isArray(data.stats) ? (data.stats[0] ?? null) : data.stats,
    onboarding: Array.isArray(data.onboarding) ? (data.onboarding[0] ?? null) : data.onboarding,
    userBadges: Array.isArray(data.userBadges) ? data.userBadges.slice(0, 5) : [],
  }
}

export async function saveOnboarding(userId: string, data: z.infer<typeof onboardingSchema>) {
  const now = new Date().toISOString()

  // Upsert onboarding profile
  await supabase.from('OnboardingProfile').upsert(
    {
      userId,
      goal: data.goal,
      level: data.level,
      equipment: data.equipment,
      daysPerWeek: data.daysPerWeek,
      completedAt: now,
    },
    { onConflict: 'userId' }
  )

  // Mark user as onboarded
  await supabase.from('User').update({
    onboardingCompleted: true,
    updatedAt: now,
  }).eq('id', userId)

  const { data: profile } = await supabase
    .from('OnboardingProfile')
    .select('*')
    .eq('userId', userId)
    .single()

  return profile
}

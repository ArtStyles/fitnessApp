import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  avatarUrl: z.string().url().optional().nullable(),
})

export const updateSubscriptionSchema = z.object({
  tier: z.enum(['basic', 'premium', 'vip']),
})

export const listUsersQuerySchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 20)),
  search: z.string().optional(),
})

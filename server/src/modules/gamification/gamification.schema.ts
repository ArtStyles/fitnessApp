import { z } from 'zod'

export const createBadgeSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(5),
  icon: z.string().min(1),
  category: z.enum(['consistency', 'performance', 'milestone', 'special']),
  requirement: z.string().min(5),
  threshold: z.number().int().min(1).default(1),
})

export const createChallengeSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(10),
  goalType: z.string().min(2),
  goalValue: z.number().int().min(1),
  pointsReward: z.number().int().min(0).default(100),
  tier: z.enum(['basic', 'premium', 'vip']).default('basic'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export const updateChallengeSchema = createChallengeSchema.partial().extend({
  isActive: z.boolean().optional(),
})

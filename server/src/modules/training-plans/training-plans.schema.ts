import { z } from 'zod'

const planDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  label: z.string().min(1),
  isRest: z.boolean().default(false),
  workoutId: z.string().optional().nullable(),
})

const planWeekSchema = z.object({
  weekNumber: z.number().int().min(1),
  days: z.array(planDaySchema),
})

export const createPlanSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(10),
  tier: z.enum(['basic', 'premium', 'vip']).default('basic'),
  durationWeeks: z.number().int().min(1),
  daysPerWeek: z.number().int().min(1).max(7),
  goal: z.enum(['lose_weight', 'build_muscle', 'improve_endurance', 'stay_healthy', 'increase_strength']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  imageUrl: z.string().url().optional().nullable(),
  trainerId: z.string().optional().nullable(),
  weeks: z.array(planWeekSchema).optional().default([]),
})

export const updatePlanSchema = createPlanSchema.partial()

export const planQuerySchema = z.object({
  goal: z
    .enum(['lose_weight', 'build_muscle', 'improve_endurance', 'stay_healthy', 'increase_strength'])
    .optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tier: z.enum(['basic', 'premium', 'vip']).optional(),
  search: z.string().optional(),
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 20)),
})

export const enrollSchema = z.object({
  planId: z.string(),
})

export const markDayCompleteSchema = z.object({
  weekNumber: z.number().int().min(1),
  dayNumber: z.number().int().min(1),
})

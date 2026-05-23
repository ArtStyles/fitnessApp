import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const onboardingSchema = z.object({
  goal: z.enum(['lose_weight', 'build_muscle', 'improve_endurance', 'stay_healthy', 'increase_strength']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  equipment: z.array(z.enum(['none', 'dumbbells', 'barbell', 'gym', 'resistance_bands', 'pull_up_bar'])),
  daysPerWeek: z.number().int().min(1).max(7),
})

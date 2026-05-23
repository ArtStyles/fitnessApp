import { z } from 'zod'

const exerciseEntrySchema = z.object({
  exerciseId: z.string(),
  sets: z.number().int().min(1),
  reps: z.string(),
  restSeconds: z.number().int().min(0).default(60),
  notes: z.string().optional().nullable(),
  orderIndex: z.number().int().min(0),
})

export const createWorkoutSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(10),
  durationMinutes: z.number().int().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  category: z.string().min(2),
  tier: z.enum(['basic', 'premium', 'vip']).default('basic'),
  imageUrl: z.string().url().optional().nullable(),
  muscleGroups: z.array(
    z.enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core', 'glutes', 'quads', 'hamstrings', 'calves'])
  ),
  equipment: z.array(
    z.enum(['none', 'dumbbells', 'barbell', 'gym', 'resistance_bands', 'pull_up_bar'])
  ),
  trainerId: z.string().optional().nullable(),
  exercises: z.array(exerciseEntrySchema).optional().default([]),
})

export const updateWorkoutSchema = createWorkoutSchema.partial()

export const workoutQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tier: z.enum(['basic', 'premium', 'vip']).optional(),
  search: z.string().optional(),
  muscleGroup: z
    .enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core', 'glutes', 'quads', 'hamstrings', 'calves'])
    .optional(),
  equipment: z
    .enum(['none', 'dumbbells', 'barbell', 'gym', 'resistance_bands', 'pull_up_bar'])
    .optional(),
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 20)),
})

const exerciseLogEntrySchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(0).optional().nullable(),
  weightKg: z.number().min(0).optional().nullable(),
  durationSec: z.number().int().min(0).optional().nullable(),
})

export const completeWorkoutSchema = z.object({
  durationMinutes: z.number().int().min(1),
  notes: z.string().optional().nullable(),
  exerciseLogs: z.array(exerciseLogEntrySchema).optional().default([]),
})

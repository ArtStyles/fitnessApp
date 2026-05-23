import { z } from 'zod'

export const createExerciseSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['Fuerza', 'Cardio', 'Core', 'Pliometria', 'Funcional']),
  primaryMuscle: z.string().min(2).max(50),
  muscleGroups: z.array(
    z.enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core', 'glutes', 'quads', 'hamstrings', 'calves'])
  ),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  equipment: z.array(z.string()),
  description: z.string().min(10),
  steps: z.array(z.string()),
  tips: z.array(z.string()),
  imageUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
})

export const updateExerciseSchema = createExerciseSchema.partial()

export const exerciseQuerySchema = z.object({
  category: z.enum(['Fuerza', 'Cardio', 'Core', 'Pliometria', 'Funcional']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  muscleGroup: z
    .enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core', 'glutes', 'quads', 'hamstrings', 'calves'])
    .optional(),
  search: z.string().optional(),
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 20)),
})

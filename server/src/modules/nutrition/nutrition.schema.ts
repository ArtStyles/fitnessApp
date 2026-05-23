import { z } from 'zod'

const mealSchema = z.object({
  name: z.string().min(2).max(150),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().int().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  imageUrl: z.string().url().optional().nullable(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
})

export const createMealPlanSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(10),
  tier: z.enum(['basic', 'premium', 'vip']).default('basic'),
  calories: z.number().int().min(0),
  meals: z.array(mealSchema).optional().default([]),
})

export const updateMealPlanSchema = createMealPlanSchema.partial()

export const nutritionQuerySchema = z.object({
  tier: z.enum(['basic', 'premium', 'vip']).optional(),
  search: z.string().optional(),
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 20)),
})

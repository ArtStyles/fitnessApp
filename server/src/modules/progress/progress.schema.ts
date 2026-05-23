import { z } from 'zod'

const measurementsSchema = z.object({
  chest: z.number().min(0).optional(),
  waist: z.number().min(0).optional(),
  hips: z.number().min(0).optional(),
  arms: z.number().min(0).optional(),
  thighs: z.number().min(0).optional(),
}).optional()

export const createEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  weightKg: z.number().min(0).max(500).optional().nullable(),
  bodyFatPct: z.number().min(0).max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  measurements: measurementsSchema,
})

export const updateEntrySchema = createEntrySchema.partial()

export const progressQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 30)),
})

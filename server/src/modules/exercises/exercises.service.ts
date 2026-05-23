import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import { createExerciseSchema, updateExerciseSchema, exerciseQuerySchema } from './exercises.schema'

export async function listExercises(filters: z.infer<typeof exerciseQuerySchema>) {
  const { category, difficulty, muscleGroup, search, page, limit } = filters
  const skip = (page - 1) * limit

  let query = supabase
    .from('ExerciseLibrary')
    .select('*, createdBy:User!ExerciseLibrary_createdById_fkey(id, name)', { count: 'exact' })
    .order('name', { ascending: true })
    .range(skip, skip + limit - 1)

  if (category) query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (muscleGroup) query = query.contains('muscleGroups', [muscleGroup])
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,primaryMuscle.ilike.%${search}%`
    )
  }

  const { data: exercises, count, error } = await query

  if (error) throw new AppError('Failed to fetch exercises', 500, 'DB_ERROR')

  return {
    exercises: exercises ?? [],
    pagination: {
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  }
}

export async function getExerciseById(id: string) {
  const { data: exercise, error } = await supabase
    .from('ExerciseLibrary')
    .select('*, createdBy:User!ExerciseLibrary_createdById_fkey(id, name)')
    .eq('id', id)
    .single()

  if (error || !exercise) throw new AppError('Exercise not found', 404, 'NOT_FOUND')
  return exercise
}

export async function createExercise(data: z.infer<typeof createExerciseSchema>, createdById: string) {
  const { data: exercise, error } = await supabase
    .from('ExerciseLibrary')
    .insert({
      id: crypto.randomUUID(),
      ...data,
      createdById,
      updatedAt: new Date().toISOString(),
    })
    .select('*, createdBy:User!ExerciseLibrary_createdById_fkey(id, name)')
    .single()

  if (error) throw new AppError('Failed to create exercise', 500, 'DB_ERROR')
  return exercise
}

export async function updateExercise(id: string, data: z.infer<typeof updateExerciseSchema>) {
  const { data: existing } = await supabase
    .from('ExerciseLibrary')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Exercise not found', 404, 'NOT_FOUND')

  const { data: exercise, error } = await supabase
    .from('ExerciseLibrary')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select('*, createdBy:User!ExerciseLibrary_createdById_fkey(id, name)')
    .single()

  if (error) throw new AppError('Failed to update exercise', 500, 'DB_ERROR')
  return exercise
}

export async function deleteExercise(id: string) {
  const { data: existing } = await supabase
    .from('ExerciseLibrary')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Exercise not found', 404, 'NOT_FOUND')
  await supabase.from('ExerciseLibrary').delete().eq('id', id)
}

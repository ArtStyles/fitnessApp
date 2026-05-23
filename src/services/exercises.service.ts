import { get, getList, post, put, del } from '@/src/lib/api'
import type { ExerciseLibraryItem } from '@/src/types'

export interface ExercisesFilter {
  search?:     string
  category?:   string
  difficulty?: string
  muscleGroup?: string
  page?:       number
  limit?:      number
}

function norm(d: any): ExerciseLibraryItem {
  return {
    id:           d.id,
    name:         d.name,
    // Map DB 'Pliometria' → display 'Pliometría'
    category:     (d.category === 'Pliometria' ? 'Pliometría' : d.category) as any,
    primaryMuscle: d.primaryMuscle,
    muscleGroups: d.muscleGroups ?? [],
    difficulty:   d.difficulty,
    equipment:    d.equipment ?? [],
    description:  d.description,
    steps:        d.steps ?? [],
    tips:         d.tips ?? [],
    image:        d.imageUrl ?? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    videoUrl:     d.videoUrl ?? undefined,
  }
}

export async function fetchExercises(filters: ExercisesFilter = {}): Promise<{
  exercises: ExerciseLibraryItem[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}> {
  const { items, meta } = await getList<any>('/exercises', filters)
  return { exercises: items.map(norm), pagination: meta }
}

export async function fetchExercise(id: string): Promise<ExerciseLibraryItem> {
  return norm(await get<any>(`/exercises/${id}`))
}

export async function adminCreateExercise(data: any): Promise<ExerciseLibraryItem> {
  return norm(await post<any>('/exercises', data))
}

export async function adminUpdateExercise(id: string, data: any): Promise<ExerciseLibraryItem> {
  return norm(await put<any>(`/exercises/${id}`, data))
}

export async function adminDeleteExercise(id: string): Promise<void> {
  await del(`/exercises/${id}`)
}

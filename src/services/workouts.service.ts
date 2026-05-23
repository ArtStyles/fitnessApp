import { get, getList, post, put, patch, del } from '@/src/lib/api'
import type { Workout } from '@/src/types'

export interface WorkoutsFilter {
  search?:     string
  category?:   string
  difficulty?: string
  equipment?:  string
  muscleGroup?: string
  page?:       number
  limit?:      number
}

export interface WorkoutsPage {
  workouts:   Workout[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

// ── Normalize backend workout → frontend Workout shape ────────────────────────

function norm(d: any): Workout {
  return {
    id:              d.id,
    title:           d.title,
    description:     d.description,
    duration:        `${d.durationMinutes} min`,
    durationMinutes: d.durationMinutes,
    difficulty:      d.difficulty,
    category:        d.category,
    tier:            d.tier,
    image:           d.imageUrl ?? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    exercises:       (d.exercises ?? []).map((e: any) => ({
      id:          e.id,                              // WorkoutExercise row id
      exerciseId:  e.exercise?.id ?? e.exerciseId,   // ExerciseLibrary id for logs
      name:        e.exercise?.name ?? e.name ?? '',
      sets:        e.sets,
      reps:        e.reps,
      rest:        `${e.restSeconds}s`,
      restSeconds: e.restSeconds ?? 60,
      videoUrl:    e.exercise?.videoUrl,
      notes:       e.notes ?? undefined,
      muscleGroups: e.exercise?.muscleGroups ?? [],
    })),
    completedBy: d.completedBy ?? 0,
    equipment:   d.equipment ?? [],
    muscleGroups: d.muscleGroups ?? [],
    trainerId:   d.trainerId ?? undefined,
  }
}

// ── List / detail ─────────────────────────────────────────────────────────────

export async function fetchWorkouts(filters: WorkoutsFilter = {}): Promise<WorkoutsPage> {
  const { items, meta } = await getList<any>('/workouts', filters)
  return { workouts: items.map(norm), pagination: meta }
}

export async function fetchWorkout(id: string): Promise<Workout> {
  return norm(await get<any>(`/workouts/${id}`))
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export interface StartSessionResponse {
  id:      string
  workout: Workout
}

export async function startSession(workoutId: string): Promise<StartSessionResponse> {
  // Backend: POST /workouts/:id/sessions
  const raw = await post<any>(`/workouts/${workoutId}/sessions`)
  return { id: raw.id, workout: norm(raw.workout ?? raw) }
}

export interface ExerciseLogInput {
  exerciseId:  string
  setNumber:   number
  reps?:       number
  weightKg?:   number
  durationSec?: number
}

export async function completeSession(
  sessionId: string,
  durationMinutes: number,
  exerciseLogs: ExerciseLogInput[],
  notes?: string,
): Promise<void> {
  // Backend: PATCH /workouts/sessions/:sessionId/complete
  await patch(`/workouts/sessions/${sessionId}/complete`, {
    durationMinutes,
    exerciseLogs,
    notes,
  })
}

export interface WorkoutSessionSummary {
  id: string
  workoutId: string
  workoutTitle: string
  durationMinutes: number
  startedAt: string
  completedAt: string | null
}

function normSession(s: any): WorkoutSessionSummary {
  return {
    id:              s.id,
    workoutId:       s.workoutId,
    workoutTitle:    s.workout?.title ?? 'Entrenamiento',
    durationMinutes: s.durationMinutes ?? 0,
    startedAt:       s.startedAt,
    completedAt:     s.completedAt ?? null,
  }
}

export async function fetchHistory(page = 1, limit = 10): Promise<{
  sessions: WorkoutSessionSummary[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}> {
  const { items, meta } = await getList<any>('/workouts/history', { page, limit })
  return { sessions: items.map(normSession), pagination: meta }
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export async function adminCreateWorkout(data: any): Promise<Workout> {
  return norm(await post<any>('/workouts', data))
}

export async function adminUpdateWorkout(id: string, data: any): Promise<Workout> {
  return norm(await put<any>(`/workouts/${id}`, data))
}

export async function adminDeleteWorkout(id: string): Promise<void> {
  await del(`/workouts/${id}`)
}

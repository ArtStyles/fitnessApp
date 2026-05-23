/**
 * Generic React Query hooks for every backend module.
 * Pages import from here instead of calling services directly.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWorkouts, fetchWorkout, fetchHistory, type WorkoutsFilter, startSession, completeSession, type ExerciseLogInput } from '@/src/services/workouts.service'
import { fetchExercises, type ExercisesFilter } from '@/src/services/exercises.service'
import { fetchPlans, fetchPlan, enrollInPlan, unenrollFromPlan, fetchMyEnrollments, markPlanDayComplete } from '@/src/services/training-plans.service'
import { fetchMealPlans, fetchMealPlan } from '@/src/services/nutrition.service'
import { fetchProgress, createProgressEntry, deleteProgressEntry, type ProgressInput } from '@/src/services/progress.service'
import { fetchGamification, fetchNotifications, markNotificationsRead } from '@/src/services/gamification.service'

// ── Workouts ──────────────────────────────────────────────────────────────────

export function useWorkouts(filters: WorkoutsFilter = {}) {
  return useQuery({
    queryKey: ['workouts', filters],
    queryFn:  () => fetchWorkouts(filters),
    staleTime: 2 * 60 * 1000,
  })
}

export function useWorkout(id: string | undefined) {
  return useQuery({
    queryKey:  ['workout', id],
    queryFn:   () => fetchWorkout(id!),
    enabled:   !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStartSession() {
  return useMutation({
    mutationFn: (workoutId: string) => startSession(workoutId),
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error al iniciar sesión'),
  })
}

export function useCompleteSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId, durationMinutes, exerciseLogs, notes,
    }: { sessionId: string; durationMinutes: number; exerciseLogs: ExerciseLogInput[]; notes?: string }) =>
      completeSession(sessionId, durationMinutes, exerciseLogs, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] })
      qc.invalidateQueries({ queryKey: ['gamification'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error al completar sesión'),
  })
}

export function useWorkoutHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['workout-history', page, limit],
    queryFn:  () => fetchHistory(page, limit),
    staleTime: 2 * 60 * 1000,
  })
}

// ── Exercises ─────────────────────────────────────────────────────────────────

export function useExercises(filters: ExercisesFilter = {}) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn:  () => fetchExercises(filters),
    staleTime: 10 * 60 * 1000,
  })
}

// ── Training Plans ────────────────────────────────────────────────────────────

export function useTrainingPlans(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['training-plans', filters],
    queryFn:  () => fetchPlans(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTrainingPlan(id: string | undefined) {
  return useQuery({
    queryKey:  ['training-plan', id],
    queryFn:   () => fetchPlan(id!),
    enabled:   !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['my-enrollments'],
    queryFn:  fetchMyEnrollments,
    staleTime: 2 * 60 * 1000,
  })
}

export function useEnrollMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId: string) => enrollInPlan(planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-enrollments'] })
      qc.invalidateQueries({ queryKey: ['training-plans'] })
      toast.success('¡Te has inscrito en el programa!')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error al inscribirse'),
  })
}

export function useUnenrollMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId: string) => unenrollFromPlan(planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-enrollments'] })
      toast.success('Te has desinscrito del programa')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error'),
  })
}

export function useMarkDayCompleteMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, week, day }: { planId: string; week: number; day: number }) =>
      markPlanDayComplete(planId, week, day),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-enrollments'] }),
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error'),
  })
}

// ── Nutrition ─────────────────────────────────────────────────────────────────

export function useMealPlans(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['meal-plans', filters],
    queryFn:  () => fetchMealPlans(filters),
    staleTime: 10 * 60 * 1000,
  })
}

export function useMealPlan(id: string | undefined) {
  return useQuery({
    queryKey:  ['meal-plan', id],
    queryFn:   () => fetchMealPlan(id!),
    enabled:   !!id,
    staleTime: 10 * 60 * 1000,
  })
}

// ── Progress ──────────────────────────────────────────────────────────────────

export function useProgress() {
  return useQuery({
    queryKey: ['progress'],
    queryFn:  fetchProgress,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProgressInput) => createProgressEntry(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress'] })
      toast.success('Entrada de progreso guardada')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error'),
  })
}

export function useDeleteProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProgressEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['progress'] }),
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Error'),
  })
}

// ── Gamification ──────────────────────────────────────────────────────────────

export function useGamificationData() {
  return useQuery({
    queryKey: ['gamification'],
    queryFn:  fetchGamification,
    staleTime: 2 * 60 * 1000,
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn:  fetchNotifications,
    refetchInterval: 60_000,   // poll every minute
    staleTime: 30_000,
  })
}

export function useMarkAllReadMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markNotificationsRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

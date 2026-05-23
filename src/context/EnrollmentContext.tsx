import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import type { Enrollment, TrainingPlan } from '@/src/types'
import {
  fetchMyEnrollments, enrollInPlan as apiEnroll,
  unenrollFromPlan as apiUnenroll, markPlanDayComplete,
} from '@/src/services/training-plans.service'

interface EnrollmentContextValue {
  enrollments:      Enrollment[]
  isLoading:        boolean
  enrollInPlan:     (plan: TrainingPlan) => Promise<void>
  unenrollFromPlan: (planId: string)     => Promise<void>
  getEnrollment:    (planId: string)     => Enrollment | null
  getActiveEnrollment: ()                => Enrollment | null
  markDayComplete:  (planId: string, week: number, day: number) => Promise<void>
  isDayComplete:    (planId: string, week: number, day: number) => boolean
  refetch:          () => void
}

const EnrollmentContext = createContext<EnrollmentContextValue | null>(null)

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading,   setIsLoading]   = useState(false)

  const load = useCallback(async () => {
    if (!isAuthenticated) { setEnrollments([]); return }
    setIsLoading(true)
    try {
      const data = await fetchMyEnrollments()
      setEnrollments(data)
    } catch { /* ignore if backend offline */ }
    finally { setIsLoading(false) }
  }, [isAuthenticated])

  useEffect(() => { load() }, [load])

  const enrollInPlan = useCallback(async (plan: TrainingPlan) => {
    if (!user) return
    try {
      const enrollment = await apiEnroll(plan.id)
      setEnrollments(prev => {
        const exists = prev.some(e => e.planId === plan.id)
        return exists ? prev : [...prev, enrollment]
      })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Error al inscribirse'
      throw new Error(msg)
    }
  }, [user])

  const unenrollFromPlan = useCallback(async (planId: string) => {
    if (!user) return
    await apiUnenroll(planId)
    setEnrollments(prev => prev.filter(e => e.planId !== planId))
  }, [user])

  const getEnrollment = useCallback((planId: string): Enrollment | null => {
    if (!user) return null
    return enrollments.find(e => e.planId === planId) ?? null
  }, [user, enrollments])

  const getActiveEnrollment = useCallback((): Enrollment | null => {
    if (!user) return null
    return enrollments.find(e => !e.completedAt) ?? null
  }, [user, enrollments])

  const markDayComplete = useCallback(async (planId: string, week: number, day: number) => {
    if (!user) return
    // Call API first; on success update optimistic state
    await markPlanDayComplete(planId, week, day)
    setEnrollments(prev => prev.map(e => {
      if (e.planId !== planId) return e
      const dayProgress = e.dayProgress.map(d =>
        d.week === week && d.day === day
          ? { ...d, completedAt: new Date().toISOString() }
          : d
      )
      // Plan is complete only when every non-rest day progress entry is completed.
      // The backend creates progress entries only for every day (including rest).
      // We only check entries that existed BEFORE this completion to determine done-ness
      // — the backend is the source of truth for plan completion.
      const trainingDaysCompleted = dayProgress.filter(d => d.completedAt !== null).length
      const totalDays = dayProgress.length
      const allDone = totalDays > 0 && trainingDaysCompleted === totalDays
      return { ...e, dayProgress, completedAt: allDone ? new Date().toISOString() : e.completedAt }
    }))
  }, [user])

  const isDayComplete = useCallback((planId: string, week: number, day: number): boolean => {
    const enrollment = enrollments.find(e => e.planId === planId)
    if (!enrollment) return false
    return enrollment.dayProgress.some(d => d.week === week && d.day === day && d.completedAt !== null)
  }, [enrollments])

  return (
    <EnrollmentContext.Provider value={{
      enrollments,
      isLoading,
      enrollInPlan,
      unenrollFromPlan,
      getEnrollment,
      getActiveEnrollment,
      markDayComplete,
      isDayComplete,
      refetch: load,
    }}>
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext)
  if (!ctx) throw new Error('useEnrollment must be inside EnrollmentProvider')
  return ctx
}

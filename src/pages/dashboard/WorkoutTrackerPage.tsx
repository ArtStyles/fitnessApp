import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Timer, X, SkipForward, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useWorkout, useStartSession, useCompleteSession } from '@/src/hooks/useApi'
import type { ExerciseLogInput } from '@/src/services/workouts.service'

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return seconds
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function WorkoutTrackerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: workout, isLoading: workoutLoading } = useWorkout(id)
  const startSession = useStartSession()
  const completeSession = useCompleteSession()

  const sessionIdRef = useRef<string | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)

  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({})
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogInput[]>([])
  const [isResting, setIsResting] = useState(false)
  const [restLeft, setRestLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const elapsed = useTimer(running)

  // Start session once workout is loaded
  useEffect(() => {
    if (!workout || sessionStarted) return
    setSessionStarted(true)
    startSession.mutateAsync(workout.id)
      .then(res => {
        sessionIdRef.current = res.id
        setRunning(true)
      })
      .catch(() => navigate(`/workouts/${id}`))
  }, [workout, sessionStarted])

  // Rest countdown
  useEffect(() => {
    if (!isResting || restLeft <= 0) return
    const timerId = setInterval(() => setRestLeft(r => {
      if (r <= 1) { setIsResting(false); return 0 }
      return r - 1
    }), 1000)
    return () => clearInterval(timerId)
  }, [isResting, restLeft])

  const currentExercise = workout?.exercises[exerciseIndex]
  const totalExercises = workout?.exercises.length ?? 0
  const progress = (exerciseIndex / totalExercises) * 100
  const currentSets = currentExercise ? (completedSets[currentExercise.id] ?? 0) : 0

  const handleFinish = useCallback(async () => {
    setRunning(false)
    const durationMinutes = Math.max(1, Math.round(elapsed / 60))
    try {
      if (sessionIdRef.current) {
        await completeSession.mutateAsync({
          sessionId: sessionIdRef.current,
          durationMinutes,
          exerciseLogs,
        })
      }
      navigate(`/workouts/${id}/complete`, { state: { elapsed, workout } })
    } catch {
      navigate(`/workouts/${id}/complete`, { state: { elapsed, workout } })
    }
  }, [elapsed, exerciseLogs, workout, id, navigate, completeSession])

  const handleCompleteSet = useCallback(() => {
    if (!currentExercise) return
    const next = currentSets + 1
    setCompletedSets(prev => ({ ...prev, [currentExercise.id]: next }))

    // Use exerciseId (library id) if available, fall back to id
    setExerciseLogs(prev => [...prev, {
      exerciseId: currentExercise.exerciseId ?? currentExercise.id,
      setNumber: next,
    }])

    if (next >= currentExercise.sets) {
      if (exerciseIndex + 1 >= totalExercises) {
        handleFinish()
      } else {
        setRestLeft(currentExercise.restSeconds ?? 60)
        setIsResting(true)
        setExerciseIndex(i => i + 1)
      }
    } else {
      setRestLeft(currentExercise.restSeconds ?? 60)
      setIsResting(true)
    }
  }, [currentExercise, currentSets, exerciseIndex, totalExercises, handleFinish])

  const handleSkip = () => {
    if (exerciseIndex + 1 >= totalExercises) {
      handleFinish()
    } else {
      setExerciseIndex(i => i + 1)
      setIsResting(false)
    }
  }

  const handleQuit = () => navigate(`/workouts/${id}`)

  if (workoutLoading || startSession.isPending) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  if (!workout) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Entrenamiento no encontrado</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={handleQuit} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Salir">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{workout.title}</p>
          <p className="font-mono text-lg font-bold">{formatTime(elapsed)}</p>
        </div>
        <button onClick={handleSkip} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Saltar ejercicio">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Ejercicio {exerciseIndex + 1} de {totalExercises}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {isResting ? (
          <motion.div
            key="rest"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary flex flex-col items-center justify-center">
              <Timer className="w-6 h-6 text-primary mb-1" />
              <span className="text-4xl font-bold text-primary">{restLeft}</span>
              <span className="text-xs text-muted-foreground">seg</span>
            </div>
            <p className="text-lg font-medium">Descansando...</p>
            <Button variant="outline" onClick={() => setIsResting(false)}>
              Saltar descanso
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={`exercise-${exerciseIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 text-center w-full max-w-sm"
          >
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Ejercicio actual</p>
              <h2 className="text-3xl font-bold">{currentExercise?.name}</h2>
              {currentExercise?.notes && (
                <p className="text-sm text-muted-foreground mt-2">💡 {currentExercise.notes}</p>
              )}
            </div>

            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-3">
                Series completadas: {currentSets} / {currentExercise?.sets}
              </p>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: currentExercise?.sets ?? 0 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      i < currentSets
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {i < currentSets ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">{currentExercise?.reps}</p>
                <p className="text-xs text-muted-foreground">Repeticiones</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold">{currentExercise?.rest}</p>
                <p className="text-xs text-muted-foreground">Descanso</p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleCompleteSet}
              disabled={completeSession.isPending}
              className="w-full text-lg h-14 gap-2"
            >
              {completeSession.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentSets + 1 >= (currentExercise?.sets ?? 0) && exerciseIndex + 1 >= totalExercises
                ? 'Finalizar Entrenamiento'
                : currentSets + 1 >= (currentExercise?.sets ?? 0)
                  ? <><span>Siguiente Ejercicio</span><ChevronRight className="w-5 h-5" /></>
                  : 'Serie Completada ✓'
              }
            </Button>
          </motion.div>
        )}
      </div>

      {/* Exercise list preview */}
      <div className="border-t border-border p-4 overflow-x-auto">
        <div className="flex gap-2 min-w-fit">
          {workout.exercises.map((ex, i) => (
            <div
              key={ex.id}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === exerciseIndex
                  ? 'bg-primary text-primary-foreground'
                  : i < exerciseIndex
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {ex.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

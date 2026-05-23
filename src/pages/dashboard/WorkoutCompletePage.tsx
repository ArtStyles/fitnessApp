import { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Dumbbell, Clock, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Workout } from '@/src/types'

function fireConfetti() {
  try {
    import('canvas-confetti').then(mod => {
      mod.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
    }).catch(() => {})
  } catch { /* ignore */ }
}

interface LocationState {
  elapsed: number
  workout: Workout
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}m ${String(sec).padStart(2, '0')}s`
}


export default function WorkoutCompletePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  useEffect(() => {
    fireConfetti()
  }, [])

  if (!state) {
    navigate('/workouts')
    return null
  }

  const { elapsed, workout } = state
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0)
  const caloriesEstimate = Math.round((elapsed / 60) * 7)

  const stats = [
    { label: 'Tiempo', value: formatTime(elapsed), icon: Clock },
    { label: 'Ejercicios', value: workout.exercises.length, icon: Dumbbell },
    { label: 'Series totales', value: totalSets, icon: Trophy },
    { label: 'Calorías est.', value: `~${caloriesEstimate} kcal`, icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Trophy */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-8xl"
          aria-hidden="true"
        >
          🏆
        </motion.div>

        <div>
          <h1 className="text-3xl font-bold mb-2">¡Entrenamiento completado!</h1>
          <p className="text-muted-foreground">{workout.title}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" asChild>
            <Link to="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/workouts">
              <RotateCcw className="w-4 h-4 mr-2" />
              Ver más entrenamientos
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

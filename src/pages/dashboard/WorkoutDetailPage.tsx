import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Flame, Users, Play, Check, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWorkout } from '@/src/hooks/useApi'
import { useAuth } from '@/src/context/AuthContext'

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400'
}

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
}

export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasAccess } = useAuth()

  const { data: workout, isLoading } = useWorkout(id)

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Entrenamiento no encontrado</h2>
        <Link to="/workouts" className="text-primary hover:underline">
          Volver a entrenamientos
        </Link>
      </div>
    )
  }

  const canAccess = hasAccess(workout.tier)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link to="/workouts">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
      </Button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="relative h-64 md:h-80">
          <img
            src={workout.image}
            alt={workout.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {!canAccess && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Contenido Premium</h3>
                <p className="text-muted-foreground mb-4">
                  Requiere plan {workout.tier} o superior
                </p>
                <Button asChild>
                  <Link to="/pricing">Mejorar Plan</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={difficultyColors[workout.difficulty]}>
              {difficultyLabels[workout.difficulty]}
            </Badge>
            <Badge variant="outline">{workout.category}</Badge>
            <Badge variant="secondary" className="capitalize">{workout.tier}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{workout.title}</h1>
          <p className="text-muted-foreground">{workout.description}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-lg font-bold">{workout.duration}</p>
          <p className="text-xs text-muted-foreground">Duración</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <Flame className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-lg font-bold">{workout.exercises.length}</p>
          <p className="text-xs text-muted-foreground">Ejercicios</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-lg font-bold">{workout.completedBy.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Completados</p>
        </div>
      </div>

      {/* Start Button */}
      {canAccess && (
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 glow-primary"
          onClick={() => navigate(`/workouts/${workout.id}/track`)}
        >
          <Play className="w-5 h-5 mr-2" />
          Comenzar Entrenamiento
        </Button>
      )}

      {/* Exercises List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ejercicios</h2>
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border ${
                canAccess 
                  ? 'bg-card border-border' 
                  : 'bg-card/50 border-border/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{exercise.sets} series</span>
                    <span>{exercise.reps} reps</span>
                    <span>Descanso: {exercise.rest}</span>
                  </div>
                  {exercise.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {exercise.notes}
                    </p>
                  )}
                </div>
                {canAccess && (
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Lock, Check } from 'lucide-react'
import type { SubscriptionTier, Workout } from '@/src/types'
import { useAuth } from '@/src/context/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

interface WorkoutCardProps {
  workout: Workout
}

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

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent'
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const { hasAccess } = useAuth()
  const canAccess = hasAccess(workout.tier)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={workout.image}
          alt={workout.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Tier Badge */}
        <Badge className={`absolute top-3 right-3 ${tierColors[workout.tier]} capitalize`}>
          {workout.tier}
        </Badge>

        {/* Lock Overlay */}
        {!canAccess && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Requiere plan {workout.tier}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={difficultyColors[workout.difficulty]}>
            {difficultyLabels[workout.difficulty]}
          </Badge>
          <span className="text-xs text-muted-foreground">{workout.duration}</span>
        </div>

        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {workout.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {workout.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Check className="w-4 h-4" />
            <span>{workout.completedBy.toLocaleString()} completados</span>
          </div>
          
          {canAccess && (
            <Link
              to={`/workouts/${workout.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver detalles
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

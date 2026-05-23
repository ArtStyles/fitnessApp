import { motion } from 'framer-motion'
import { Lock, Utensils, Flame } from 'lucide-react'
import type { SubscriptionTier, MealPlan } from '@/src/types'
import { useAuth } from '@/src/context/AuthContext'
import { Badge } from '@/components/ui/badge'

interface MealPlanCardProps {
  mealPlan: MealPlan
  onClick?: () => void
}

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent'
}

export default function MealPlanCard({ mealPlan, onClick }: MealPlanCardProps) {
  const { hasAccess } = useAuth()
  const canAccess = hasAccess(mealPlan.tier)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={canAccess ? { y: -4 } : {}}
      onClick={canAccess ? onClick : undefined}
      className={`group relative rounded-xl overflow-hidden bg-card border border-border ${
        canAccess ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
    >
      {/* Header Image Grid */}
      <div className="relative h-40 grid grid-cols-2 gap-1 p-1">
        <img
          src={mealPlan.meals.breakfast.image}
          alt="Desayuno"
          className="w-full h-full object-cover rounded-tl-lg"
        />
        <img
          src={mealPlan.meals.lunch.image}
          alt="Almuerzo"
          className="w-full h-full object-cover rounded-tr-lg"
        />
        
        {/* Tier Badge */}
        <Badge className={`absolute top-3 right-3 ${tierColors[mealPlan.tier]} capitalize z-10`}>
          {mealPlan.tier}
        </Badge>

        {/* Lock Overlay */}
        {!canAccess && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Requiere plan {mealPlan.tier}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {mealPlan.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {mealPlan.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Flame className="w-4 h-4 text-primary" />
              <span>{mealPlan.calories} kcal</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Utensils className="w-4 h-4" />
              <span>4 comidas</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

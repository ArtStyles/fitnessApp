import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMealPlan } from '@/src/hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import {
  ArrowLeft,
  Flame,
  Lock,
  Utensils,
  Apple,
  Salad,
  Coffee,
  Loader2,
} from 'lucide-react'
import type { Meal } from '../../types'

const mealIcons: Record<string, React.ElementType> = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Salad,
  snack: Apple,
}

const mealLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
}

export default function MealPlanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: mealPlan, isLoading } = useMealPlan(id)

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-foreground mb-4">Plan no encontrado</h2>
        <Link to="/nutrition" className="text-primary hover:underline">
          Volver a Nutricion
        </Link>
      </div>
    )
  }

  const tierOrder = { basic: 1, premium: 2, vip: 3 }
  const userTier = user?.subscription || 'basic'
  const hasAccess = tierOrder[userTier] >= tierOrder[mealPlan.tier]

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Contenido Premium</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Este plan de alimentacion requiere una suscripcion {mealPlan.tier.toUpperCase()}. 
          Actualiza tu plan para acceder a todo el contenido.
        </p>
        <Link 
          to="/pricing" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Ver Planes
        </Link>
      </div>
    )
  }

  // Calculate total macros from all meals
  const allMeals: { type: string; meal: Meal }[] = [
    { type: 'breakfast', meal: mealPlan.meals.breakfast },
    { type: 'lunch', meal: mealPlan.meals.lunch },
    { type: 'dinner', meal: mealPlan.meals.dinner },
    ...mealPlan.meals.snacks.map(snack => ({ type: 'snack', meal: snack }))
  ]

  const totalMacros = allMeals.reduce(
    (acc, { meal }) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fats,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mealPlan.title}</h1>
          <p className="text-muted-foreground">{mealPlan.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{mealPlan.calories}</p>
          <p className="text-sm text-muted-foreground">Calorias/dia</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-500 font-bold text-sm">P</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalMacros.protein}g</p>
          <p className="text-sm text-muted-foreground">Proteina</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-yellow-500 font-bold text-sm">C</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalMacros.carbs}g</p>
          <p className="text-sm text-muted-foreground">Carbohidratos</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-green-500 font-bold text-sm">G</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalMacros.fat}g</p>
          <p className="text-sm text-muted-foreground">Grasas</p>
        </motion.div>
      </div>

      {/* Meals */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Plan del Dia</h2>
        
        <div className="space-y-4">
          {allMeals.map(({ type, meal }, index) => {
            const Icon = mealIcons[type] || Utensils
            
            return (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  {meal.image && (
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      className="w-24 h-24 rounded-xl object-cover hidden sm:block"
                    />
                  )}
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 sm:hidden">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 items-center justify-center hidden sm:flex">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {mealLabels[type]}
                        </h3>
                      </div>
                      <span className="px-2 py-1 bg-primary/20 rounded text-xs text-primary font-medium">
                        {meal.calories} kcal
                      </span>
                    </div>
                    
                    <p className="text-foreground font-medium mb-3">{meal.name}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {meal.ingredients.map((ingredient, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 pt-3 border-t border-border text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        P: {meal.protein}g
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        C: {meal.carbs}g
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        G: {meal.fats}g
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Instructions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Preparacion</h2>
        
        {allMeals.map(({ type, meal }) => (
          <motion.div
            key={`prep-${meal.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {mealLabels[type]}: {meal.name}
            </h3>
            <ol className="space-y-2">
              {meal.instructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">
                    {i + 1}
                  </span>
                  {instruction}
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-xl border-l-4 border-l-primary"
      >
        <h3 className="text-lg font-semibold text-foreground mb-3">Consejos del Entrenador</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Bebe al menos 2-3 litros de agua al dia para mantener una hidratacion optima.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Prepara tus comidas con anticipacion para asegurar el cumplimiento del plan.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Ajusta las porciones segun tu nivel de actividad fisica del dia.
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

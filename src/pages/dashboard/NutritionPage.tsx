import { useState } from 'react'
import { motion } from 'framer-motion'
import { Utensils, Flame, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MealPlanCard from '@/src/components/ui/MealPlanCard'
import { useMealPlans } from '@/src/hooks/useApi'
import { useAuth } from '@/src/context/AuthContext'
import type { MealPlan, Meal } from '@/src/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function NutritionPage() {
  const { hasAccess } = useAuth()
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  const { data, isLoading } = useMealPlans()
  const mealPlans = data?.plans ?? []

  const handleMealPlanClick = (mealPlan: MealPlan) => {
    if (hasAccess(mealPlan.tier)) {
      setSelectedMealPlan(mealPlan)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Nutrición</h1>
            <p className="text-muted-foreground">
              Planes de alimentación diseñados para tus objetivos
            </p>
          </div>
        </div>
      </motion.div>

      {/* Daily macros tracker */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Macros de hoy</h2>
          <span className="text-xs text-muted-foreground">1.540 / 2.200 kcal</span>
        </div>

        {/* Calories ring summary */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg width="80" height="80" className="-rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.28 0.02 250)" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.75 0.18 45)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - 1540 / 2200)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold">70%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm flex-1">
            <span className="text-muted-foreground">Consumidas</span><span className="font-semibold">1.540 kcal</span>
            <span className="text-muted-foreground">Objetivo</span><span className="font-semibold">2.200 kcal</span>
            <span className="text-muted-foreground">Restantes</span><span className="font-semibold text-primary">660 kcal</span>
          </div>
        </div>

        {/* Macro bars */}
        {[
          { label: 'Proteína',      consumed: 95,  goal: 150, unit: 'g', color: 'bg-blue-500' },
          { label: 'Carbohidratos', consumed: 175, goal: 250, unit: 'g', color: 'bg-yellow-500' },
          { label: 'Grasas',        consumed: 45,  goal: 70,  unit: 'g', color: 'bg-purple-500' },
        ].map(macro => (
          <div key={macro.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{macro.label}</span>
              <span className="font-medium">{macro.consumed} / {macro.goal}{macro.unit}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${macro.color} rounded-full transition-all`}
                style={{ width: `${Math.min(100, (macro.consumed / macro.goal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Meal Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Planes de Alimentación</h2>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((mealPlan: MealPlan, index: number) => (
              <motion.div
                key={mealPlan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MealPlanCard
                  mealPlan={mealPlan}
                  onClick={() => handleMealPlanClick(mealPlan)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Meal Plan Detail Dialog */}
      <Dialog open={!!selectedMealPlan} onOpenChange={() => setSelectedMealPlan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMealPlan?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedMealPlan && (
            <div className="space-y-6">
              <p className="text-muted-foreground">{selectedMealPlan.description}</p>
              
              <div className="flex gap-4">
                <Badge variant="outline">
                  <Flame className="w-3 h-3 mr-1" />
                  {selectedMealPlan.calories} kcal/día
                </Badge>
              </div>

              <Tabs defaultValue="breakfast">
                <TabsList className="w-full">
                  <TabsTrigger value="breakfast" className="flex-1">Desayuno</TabsTrigger>
                  <TabsTrigger value="lunch" className="flex-1">Almuerzo</TabsTrigger>
                  <TabsTrigger value="dinner" className="flex-1">Cena</TabsTrigger>
                  <TabsTrigger value="snacks" className="flex-1">Snacks</TabsTrigger>
                </TabsList>
                
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                  <TabsContent key={mealType} value={mealType}>
                    <MealDetail 
                      meal={selectedMealPlan.meals[mealType]} 
                      onSelect={() => setSelectedMeal(selectedMealPlan.meals[mealType])}
                    />
                  </TabsContent>
                ))}
                
                <TabsContent value="snacks">
                  <div className="space-y-4">
                    {selectedMealPlan.meals.snacks.map((snack) => (
                      <MealDetail 
                        key={snack.id} 
                        meal={snack}
                        onSelect={() => setSelectedMeal(snack)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Meal Detail Dialog */}
      <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMeal?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedMeal && (
            <div className="space-y-6">
              <img
                src={selectedMeal.image}
                alt={selectedMeal.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold">{selectedMeal.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold">{selectedMeal.protein}g</p>
                  <p className="text-xs text-muted-foreground">Proteína</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold">{selectedMeal.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbos</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold">{selectedMeal.fats}g</p>
                  <p className="text-xs text-muted-foreground">Grasas</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Ingredientes</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {selectedMeal.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Instrucciones</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {selectedMeal.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MealDetail({ meal, onSelect }: { meal: Meal; onSelect: () => void }) {
  return (
    <div 
      onClick={onSelect}
      className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-all"
    >
      <div className="flex gap-4">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="font-medium mb-1">{meal.name}</h4>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{meal.calories} kcal</span>
            <span>{meal.protein}g prot</span>
            <span>{meal.carbs}g carbs</span>
            <span>{meal.fats}g grasa</span>
          </div>
        </div>
      </div>
    </div>
  )
}

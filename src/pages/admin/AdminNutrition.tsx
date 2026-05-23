import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Utensils, Flame, X, Coffee, Sun, Moon, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmDeleteModal } from '@/src/components/ui/ConfirmDeleteModal'
import { useMealPlans } from '@/src/hooks/useApi'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { MealPlan, Meal, SubscriptionTier } from '@/src/types'

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent'
}

const emptyMeal: Meal = {
  id: '',
  name: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  image: '',
  ingredients: [],
  instructions: []
}

interface MealPlanFormData {
  title: string
  description: string
  calories: number
  tier: SubscriptionTier
  meals: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal[]
  }
}

const initialFormData: MealPlanFormData = {
  title: '',
  description: '',
  calories: 2000,
  tier: 'basic',
  meals: {
    breakfast: { ...emptyMeal, id: 'new-breakfast', name: 'Desayuno' },
    lunch: { ...emptyMeal, id: 'new-lunch', name: 'Almuerzo' },
    dinner: { ...emptyMeal, id: 'new-dinner', name: 'Cena' },
    snacks: []
  }
}

export default function AdminNutrition() {
  const { data: mealPlansData, isLoading } = useMealPlans()
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [seeded, setSeeded] = useState(false)

  if (!seeded && mealPlansData?.plans) {
    setMealPlans(mealPlansData.plans)
    setSeeded(true)
  }

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MealPlan | null>(null)
  const [activeTab, setActiveTab] = useState('info')

  const [formData, setFormData] = useState<MealPlanFormData>(initialFormData)

  const filteredPlans = mealPlans.filter(plan =>
    plan.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (plan: MealPlan) => {
    setEditingPlan(plan)
    setFormData({
      title: plan.title,
      description: plan.description,
      calories: plan.calories,
      tier: plan.tier,
      meals: plan.meals
    })
    setActiveTab('info')
    setIsModalOpen(true)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      setMealPlans(mealPlans.filter(p => p.id !== deleteTarget.id))
      toast.success('Plan de nutricion eliminado correctamente')
      setDeleteTarget(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.title) {
      toast.error('Por favor ingresa un titulo')
      return
    }

    // Calculate total calories from meals
    const totalCalories = formData.meals.breakfast.calories +
      formData.meals.lunch.calories +
      formData.meals.dinner.calories +
      formData.meals.snacks.reduce((sum, s) => sum + s.calories, 0)

    if (editingPlan) {
      setMealPlans(mealPlans.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...formData, calories: totalCalories || formData.calories }
          : p
      ))
      toast.success('Plan de nutricion actualizado correctamente')
    } else {
      const newPlan: MealPlan = {
        id: `meal-plan-${Date.now()}`,
        ...formData,
        calories: totalCalories || formData.calories
      }
      setMealPlans([newPlan, ...mealPlans])
      toast.success('Plan de nutricion creado correctamente')
    }
    closeModal()
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null)
    setFormData(initialFormData)
    setActiveTab('info')
  }

  const openNewModal = () => {
    setEditingPlan(null)
    setFormData(initialFormData)
    setActiveTab('info')
    setIsModalOpen(true)
  }

  // Meal management functions
  const updateMeal = (mealType: 'breakfast' | 'lunch' | 'dinner', field: keyof Meal, value: string | number | string[]) => {
    setFormData({
      ...formData,
      meals: {
        ...formData.meals,
        [mealType]: { ...formData.meals[mealType], [field]: value }
      }
    })
  }

  const addSnack = () => {
    const newSnack: Meal = {
      ...emptyMeal,
      id: `snack-${Date.now()}`,
      name: `Snack ${formData.meals.snacks.length + 1}`
    }
    setFormData({
      ...formData,
      meals: {
        ...formData.meals,
        snacks: [...formData.meals.snacks, newSnack]
      }
    })
  }

  const updateSnack = (index: number, field: keyof Meal, value: string | number | string[]) => {
    const updatedSnacks = [...formData.meals.snacks]
    updatedSnacks[index] = { ...updatedSnacks[index], [field]: value }
    setFormData({
      ...formData,
      meals: {
        ...formData.meals,
        snacks: updatedSnacks
      }
    })
  }

  const removeSnack = (index: number) => {
    setFormData({
      ...formData,
      meals: {
        ...formData.meals,
        snacks: formData.meals.snacks.filter((_, i) => i !== index)
      }
    })
  }

  const MealEditor = ({ 
    meal, 
    onUpdate, 
    icon: Icon,
    title
  }: { 
    meal: Meal
    onUpdate: (field: keyof Meal, value: string | number | string[]) => void
    icon: React.ElementType
    title: string
  }) => (
    <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <span className="font-medium">{title}</span>
      </div>

      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input
          value={meal.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder="Nombre de la comida"
        />
      </div>

      <div className="space-y-2">
        <Label>URL de Imagen</Label>
        <div className="flex gap-2">
          <Input
            value={meal.image}
            onChange={(e) => onUpdate('image', e.target.value)}
            placeholder="https://..."
          />
          {meal.image && (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img src={meal.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Calorias</Label>
          <Input
            type="number"
            value={meal.calories}
            onChange={(e) => onUpdate('calories', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Proteinas (g)</Label>
          <Input
            type="number"
            value={meal.protein}
            onChange={(e) => onUpdate('protein', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Carbos (g)</Label>
          <Input
            type="number"
            value={meal.carbs}
            onChange={(e) => onUpdate('carbs', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Grasas (g)</Label>
          <Input
            type="number"
            value={meal.fats}
            onChange={(e) => onUpdate('fats', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ingredientes (uno por linea)</Label>
        <Textarea
          value={meal.ingredients.join('\n')}
          onChange={(e) => onUpdate('ingredients', e.target.value.split('\n').filter(i => i.trim()))}
          placeholder="200g pechuga de pollo&#10;1 taza de arroz&#10;..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Instrucciones (una por linea)</Label>
        <Textarea
          value={meal.instructions.join('\n')}
          onChange={(e) => onUpdate('instructions', e.target.value.split('\n').filter(i => i.trim()))}
          placeholder="1. Cocinar el pollo...&#10;2. Preparar el arroz...&#10;..."
          rows={3}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planes de Nutricion</h1>
            <p className="text-muted-foreground">
              Gestiona los planes de alimentacion
            </p>
          </div>
        </div>
        <Button onClick={openNewModal} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Plan
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar planes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {isLoading && !seeded ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : null}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Calorias</TableHead>
              <TableHead>Plan Requerido</TableHead>
              <TableHead>Comidas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden grid grid-cols-2 gap-0.5">
                      <img
                        src={plan.meals.breakfast.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <img
                        src={plan.meals.lunch.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-primary" />
                    <span>{plan.calories} kcal</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`capitalize ${tierColors[plan.tier]}`}>
                    {plan.tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  {3 + plan.meals.snacks.length} comidas/dia
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(plan)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingPlan ? 'Editar Plan de Nutricion' : 'Nuevo Plan de Nutricion'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editingPlan ? 'Modifica los detalles del plan' : 'Crea un nuevo plan alimenticio para tus usuarios'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-6">
                  <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Info General
                  </TabsTrigger>
                  <TabsTrigger value="breakfast" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Coffee className="w-4 h-4 mr-1" /> Desayuno
                  </TabsTrigger>
                  <TabsTrigger value="lunch" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Sun className="w-4 h-4 mr-1" /> Almuerzo
                  </TabsTrigger>
                  <TabsTrigger value="dinner" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Moon className="w-4 h-4 mr-1" /> Cena
                  </TabsTrigger>
                  <TabsTrigger value="snacks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Apple className="w-4 h-4 mr-1" /> Snacks ({formData.meals.snacks.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-6">
                  <TabsContent value="info" className="mt-0 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titulo *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Plan Deficit Calorico"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripcion</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descripcion del plan alimenticio..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="calories">Calorias Objetivo</Label>
                        <Input
                          id="calories"
                          type="number"
                          value={formData.calories}
                          onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Se calculara automaticamente de las comidas
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Plan Requerido</Label>
                        <Select
                          value={formData.tier}
                          onValueChange={(value) => setFormData({ ...formData, tier: value as SubscriptionTier })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basico</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Macros summary */}
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm font-medium mb-3">Resumen de Macros del Plan</p>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {formData.meals.breakfast.calories + formData.meals.lunch.calories + formData.meals.dinner.calories + formData.meals.snacks.reduce((s, m) => s + m.calories, 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">Calorias</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-400">
                            {formData.meals.breakfast.protein + formData.meals.lunch.protein + formData.meals.dinner.protein + formData.meals.snacks.reduce((s, m) => s + m.protein, 0)}g
                          </p>
                          <p className="text-xs text-muted-foreground">Proteinas</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-400">
                            {formData.meals.breakfast.carbs + formData.meals.lunch.carbs + formData.meals.dinner.carbs + formData.meals.snacks.reduce((s, m) => s + m.carbs, 0)}g
                          </p>
                          <p className="text-xs text-muted-foreground">Carbos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-400">
                            {formData.meals.breakfast.fats + formData.meals.lunch.fats + formData.meals.dinner.fats + formData.meals.snacks.reduce((s, m) => s + m.fats, 0)}g
                          </p>
                          <p className="text-xs text-muted-foreground">Grasas</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="breakfast" className="mt-0">
                    <MealEditor
                      meal={formData.meals.breakfast}
                      onUpdate={(field, value) => updateMeal('breakfast', field, value)}
                      icon={Coffee}
                      title="Desayuno"
                    />
                  </TabsContent>

                  <TabsContent value="lunch" className="mt-0">
                    <MealEditor
                      meal={formData.meals.lunch}
                      onUpdate={(field, value) => updateMeal('lunch', field, value)}
                      icon={Sun}
                      title="Almuerzo"
                    />
                  </TabsContent>

                  <TabsContent value="dinner" className="mt-0">
                    <MealEditor
                      meal={formData.meals.dinner}
                      onUpdate={(field, value) => updateMeal('dinner', field, value)}
                      icon={Moon}
                      title="Cena"
                    />
                  </TabsContent>

                  <TabsContent value="snacks" className="mt-0 space-y-4">
                    {formData.meals.snacks.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                        <Apple className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">No hay snacks agregados</p>
                        <Button onClick={addSnack} variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Snack
                        </Button>
                      </div>
                    ) : (
                      <>
                        {formData.meals.snacks.map((snack, index) => (
                          <div key={snack.id || index} className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 z-10 text-destructive hover:text-destructive"
                              onClick={() => removeSnack(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <MealEditor
                              meal={snack}
                              onUpdate={(field, value) => updateSnack(index, field, value)}
                              icon={Apple}
                              title={`Snack ${index + 1}`}
                            />
                          </div>
                        ))}
                        <Button onClick={addSnack} variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Snack
                        </Button>
                      </>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleSubmit}>
                  {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Plan de Nutricion"
        description="Esta accion no se puede deshacer. El plan de nutricion sera eliminado permanentemente."
        itemName={deleteTarget?.title}
      />
    </div>
  )
}

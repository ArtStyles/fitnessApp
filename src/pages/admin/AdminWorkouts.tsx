import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Dumbbell, X, GripVertical } from 'lucide-react'
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
import { ConfirmDeleteModal } from '@/src/components/ui/ConfirmDeleteModal'
import { useWorkouts } from '@/src/hooks/useApi'
import { useQueryClient } from '@tanstack/react-query'
import { adminCreateWorkout, adminUpdateWorkout, adminDeleteWorkout } from '@/src/services/workouts.service'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Workout, Exercise, SubscriptionTier } from '@/src/types'

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400'
}

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent'
}

const categories = ['Fuerza', 'Cardio', 'HIIT', 'Flexibilidad', 'Funcional', 'CrossFit', 'Yoga', 'Pilates']

interface WorkoutFormData {
  title: string
  description: string
  duration: string
  difficulty: Workout['difficulty']
  category: string
  tier: SubscriptionTier
  image: string
  exercises: Exercise[]
}

const emptyExercise: Exercise = {
  id: '',
  name: '',
  sets: 3,
  reps: '12',
  rest: '60s',
  notes: ''
}

const initialFormData: WorkoutFormData = {
  title: '',
  description: '',
  duration: '',
  difficulty: 'intermediate',
  category: '',
  tier: 'basic',
  image: '',
  exercises: []
}

export default function AdminWorkouts() {
  const { data: workoutsData, isLoading } = useWorkouts()
  const qc = useQueryClient()
  const workouts: Workout[] = workoutsData?.workouts ?? []

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'exercises'>('info')

  const [formData, setFormData] = useState<WorkoutFormData>(initialFormData)

  const filteredWorkouts = workouts.filter((workout: Workout) =>
    workout.title.toLowerCase().includes(search.toLowerCase()) ||
    workout.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout)
    setFormData({
      title: workout.title,
      description: workout.description,
      duration: workout.duration,
      difficulty: workout.difficulty,
      category: workout.category,
      tier: workout.tier,
      image: workout.image,
      exercises: workout.exercises.length > 0 ? workout.exercises : []
    })
    setActiveTab('info')
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await adminDeleteWorkout(deleteTarget.id)
      qc.invalidateQueries({ queryKey: ['workouts'] })
      toast.success('Entrenamiento eliminado correctamente')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al eliminar')
    }
    setDeleteTarget(null)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category) {
      toast.error('Por favor completa los campos requeridos')
      return
    }

    const durationMinutes = parseInt(formData.duration) || 30
    const payload = {
      title:       formData.title,
      description: formData.description,
      durationMinutes,
      difficulty:  formData.difficulty,
      category:    formData.category,
      tier:        formData.tier,
      imageUrl:    formData.image || undefined,
      muscleGroups: [],
      equipment:   [],
      exercises:   formData.exercises.map((e, i) => ({
        exerciseId:  e.exerciseId || e.id,
        sets:        e.sets,
        reps:        e.reps,
        restSeconds: parseInt(e.rest) || 60,
        notes:       e.notes ?? null,
        orderIndex:  i,
      })),
    }

    try {
      if (editingWorkout) {
        await adminUpdateWorkout(editingWorkout.id, payload)
        toast.success('Entrenamiento actualizado correctamente')
      } else {
        await adminCreateWorkout(payload)
        toast.success('Entrenamiento creado correctamente')
      }
      qc.invalidateQueries({ queryKey: ['workouts'] })
      closeModal()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al guardar')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingWorkout(null)
    setFormData(initialFormData)
    setActiveTab('info')
  }

  const openNewModal = () => {
    setEditingWorkout(null)
    setFormData(initialFormData)
    setActiveTab('info')
    setIsModalOpen(true)
  }

  // Exercise management
  const addExercise = () => {
    const newExercise: Exercise = {
      ...emptyExercise,
      id: `exercise-${Date.now()}`
    }
    setFormData({ ...formData, exercises: [...formData.exercises, newExercise] })
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = [...formData.exercises]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, exercises: updated })
  }

  const removeExercise = (index: number) => {
    setFormData({ 
      ...formData, 
      exercises: formData.exercises.filter((_, i) => i !== index) 
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Entrenamientos</h1>
            <p className="text-muted-foreground">
              Gestiona los entrenamientos de la plataforma
            </p>
          </div>
        </div>
        <Button onClick={openNewModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Entrenamiento
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar entrenamientos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : null}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entrenamiento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Dificultad</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Duracion</TableHead>
              <TableHead>Ejercicios</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={workout.image}
                      alt={workout.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{workout.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {workout.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{workout.category}</TableCell>
                <TableCell>
                  <Badge className={difficultyColors[workout.difficulty]}>
                    {difficultyLabels[workout.difficulty]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`capitalize ${tierColors[workout.tier]}`}>
                    {workout.tier}
                  </Badge>
                </TableCell>
                <TableCell>{workout.duration}</TableCell>
                <TableCell>{workout.exercises.length}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(workout)}>
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
              className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingWorkout ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editingWorkout ? 'Modifica los detalles del entrenamiento' : 'Crea un nuevo entrenamiento para tus usuarios'}
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
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'info' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Informacion General
                </button>
                <button
                  onClick={() => setActiveTab('exercises')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'exercises' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Ejercicios ({formData.exercises.length})
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'info' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titulo *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Full Body Power"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripcion</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descripcion del entrenamiento..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">URL de Imagen</Label>
                      <div className="flex gap-2">
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://..."
                        />
                        {formData.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={formData.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duracion</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="45 min"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dificultad</Label>
                        <Select
                          value={formData.difficulty}
                          onValueChange={(value) => setFormData({ ...formData, difficulty: value as Workout['difficulty'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.exercises.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                        <Dumbbell className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">No hay ejercicios agregados</p>
                        <Button onClick={addExercise} variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Ejercicio
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {formData.exercises.map((exercise, index) => (
                            <motion.div
                              key={exercise.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-muted/50 rounded-xl border border-border"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 text-muted-foreground cursor-grab">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                                      {index + 1}
                                    </span>
                                    <Input
                                      value={exercise.name}
                                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                                      placeholder="Nombre del ejercicio"
                                      className="flex-1"
                                    />
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <Label className="text-xs">Series</Label>
                                      <Input
                                        type="number"
                                        value={exercise.sets}
                                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                                        min={1}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Repeticiones</Label>
                                      <Input
                                        value={exercise.reps}
                                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                        placeholder="12"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Descanso</Label>
                                      <Input
                                        value={exercise.rest}
                                        onChange={(e) => updateExercise(index, 'rest', e.target.value)}
                                        placeholder="60s"
                                      />
                                    </div>
                                  </div>
                                  <Input
                                    value={exercise.notes || ''}
                                    onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                                    placeholder="Notas adicionales (opcional)"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeExercise(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <Button onClick={addExercise} variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Ejercicio
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingWorkout ? 'Guardar Cambios' : 'Crear Entrenamiento'}
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
        title="Eliminar Entrenamiento"
        description="Esta accion no se puede deshacer. El entrenamiento sera eliminado permanentemente."
        itemName={deleteTarget?.title}
      />
    </div>
  )
}

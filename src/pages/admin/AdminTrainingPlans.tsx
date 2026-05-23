import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit, Trash2, BookOpen, X, Dumbbell, Bed, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ConfirmDeleteModal } from '@/src/components/ui/ConfirmDeleteModal'
import { useTrainingPlans, useWorkouts } from '@/src/hooks/useApi'
import { useQueryClient } from '@tanstack/react-query'
import { adminCreatePlan, adminUpdatePlan, adminDeletePlan } from '@/src/services/training-plans.service'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type {
  TrainingPlan, TrainingPlanWeek,
  SubscriptionTier, FitnessGoal, FitnessLevel,
  Workout,
} from '@/src/types'

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent',
}

const goalLabels: Record<FitnessGoal, string> = {
  lose_weight: 'Pérdida de peso',
  build_muscle: 'Ganar músculo',
  improve_endurance: 'Resistencia',
  increase_strength: 'Fuerza',
  stay_healthy: 'Salud general',
}

const levelLabels: Record<FitnessLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface PlanFormData {
  title: string
  description: string
  tier: SubscriptionTier
  durationWeeks: number
  daysPerWeek: number
  goal: FitnessGoal
  level: FitnessLevel
  image: string
  weeks: TrainingPlanWeek[]
}

function buildWeeks(durationWeeks: number, daysPerWeek: number): TrainingPlanWeek[] {
  return Array.from({ length: durationWeeks }, (_, wi) => ({
    week: wi + 1,
    days: Array.from({ length: 7 }, (_, di) => ({
      day: di + 1,
      workoutId: null,
      label: dayNames[di],
      isRest: di >= daysPerWeek,
    })),
  }))
}

const initialFormData: PlanFormData = {
  title: '',
  description: '',
  tier: 'basic',
  durationWeeks: 4,
  daysPerWeek: 3,
  goal: 'lose_weight',
  level: 'beginner',
  image: '',
  weeks: buildWeeks(4, 3),
}

// ── Week / Day editor ────────────────────────────────────────────────────────

function WeekEditor({
  week,
  onToggleRest,
  onChangeWorkout,
  availableWorkouts,
}: {
  week: TrainingPlanWeek
  onToggleRest: (dayIndex: number) => void
  onChangeWorkout: (dayIndex: number, workoutId: string | null) => void
  availableWorkouts: Workout[]
}) {
  const [expanded, setExpanded] = useState(week.week === 1)
  const trainingCount = week.days.filter(d => !d.isRest).length

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Week header */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">Semana {week.week}</span>
          {/* Mini preview dots */}
          <div className="flex gap-0.5">
            {week.days.map((d, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${d.isRest ? 'bg-border' : 'bg-primary'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">{trainingCount} entrenos</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded day editor */}
      {expanded && (
        <div className="divide-y divide-border">
          {week.days.map((day, di) => (
            <div key={di} className={`flex items-center gap-3 px-4 py-2.5 ${day.isRest ? 'bg-secondary/20' : ''}`}>
              {/* Day name */}
              <span className="w-7 text-xs font-semibold text-muted-foreground shrink-0">
                {dayNames[di]}
              </span>

              {/* Toggle rest/workout */}
              <button
                type="button"
                onClick={() => onToggleRest(di)}
                title={day.isRest ? 'Convertir en entrenamiento' : 'Convertir en descanso'}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  day.isRest
                    ? 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                {day.isRest
                  ? <><Bed className="w-3.5 h-3.5" /><span>Descanso</span></>
                  : <><Dumbbell className="w-3.5 h-3.5" /><span>Entreno</span></>
                }
              </button>

              {/* Workout selector — native select avoids Radix portal z-index issues */}
              {!day.isRest && (
                <select
                  value={day.workoutId ?? ''}
                  onChange={e => onChangeWorkout(di, e.target.value || null)}
                  className="flex-1 h-8 rounded-lg border border-border bg-background text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">— Sin asignar —</option>
                  {availableWorkouts.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.duration})
                    </option>
                  ))}
                </select>
              )}

              {day.isRest && (
                <span className="flex-1 text-xs text-muted-foreground italic">Recuperación / descanso</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AdminTrainingPlans() {
  const { data: plansData, isLoading: plansLoading } = useTrainingPlans()
  const { data: workoutsData } = useWorkouts()
  const qc = useQueryClient()
  const plans: TrainingPlan[] = plansData?.plans ?? []
  const availableWorkouts: Workout[] = workoutsData?.workouts ?? []

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TrainingPlan | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'weeks'>('info')
  const [formData, setFormData] = useState<PlanFormData>(initialFormData)

  const filteredPlans = plans.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    goalLabels[p.goal].toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (plan: TrainingPlan) => {
    setEditingPlan(plan)
    setFormData({
      title: plan.title,
      description: plan.description,
      tier: plan.tier,
      durationWeeks: plan.durationWeeks,
      daysPerWeek: plan.daysPerWeek,
      goal: plan.goal,
      level: plan.level,
      image: plan.image,
      weeks: plan.weeks,
    })
    setActiveTab('info')
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await adminDeletePlan(deleteTarget.id)
      qc.invalidateQueries({ queryKey: ['training-plans'] })
      toast.success('Plan eliminado correctamente')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al eliminar')
    }
    setDeleteTarget(null)
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error('El título es obligatorio')
      return
    }

    // Map frontend shape (week/day) → backend shape (weekNumber/dayNumber)
    const weeksPayload = formData.weeks.map(w => ({
      weekNumber: w.week,
      days: w.days.map(d => ({
        dayNumber:  d.day,
        label:      d.label,
        isRest:     d.isRest,
        workoutId:  d.workoutId ?? null,
      })),
    }))

    const payload = {
      title:        formData.title,
      description:  formData.description,
      tier:         formData.tier,
      durationWeeks: formData.durationWeeks,
      daysPerWeek:  formData.daysPerWeek,
      goal:         formData.goal,
      level:        formData.level,
      imageUrl:     formData.image || undefined,
      weeks:        weeksPayload,
    }

    try {
      if (editingPlan) {
        await adminUpdatePlan(editingPlan.id, payload)
        toast.success('Plan actualizado correctamente')
      } else {
        await adminCreatePlan(payload)
        toast.success('Plan creado correctamente')
      }
      qc.invalidateQueries({ queryKey: ['training-plans'] })
      closeModal()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al guardar')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null)
    setFormData(initialFormData)
    setActiveTab('info')
  }

  const openNewModal = () => {
    setEditingPlan(null)
    setFormData({ ...initialFormData, weeks: buildWeeks(4, 3) })
    setActiveTab('info')
    setIsModalOpen(true)
  }

  // Rebuild weeks when duration or daysPerWeek changes (only for new plans)
  const handleDurationChange = (weeks: number) => {
    setFormData(prev => ({
      ...prev,
      durationWeeks: weeks,
      weeks: buildWeeks(weeks, prev.daysPerWeek),
    }))
  }

  const handleDaysChange = (days: number) => {
    setFormData(prev => ({
      ...prev,
      daysPerWeek: days,
      weeks: buildWeeks(prev.durationWeeks, days),
    }))
  }

  const toggleDayRest = (weekIndex: number, dayIndex: number) => {
    setFormData(prev => {
      const weeks = prev.weeks.map((w, wi) => {
        if (wi !== weekIndex) return w
        const days = w.days.map((d, di) => {
          if (di !== dayIndex) return d
          return { ...d, isRest: !d.isRest, workoutId: !d.isRest ? null : d.workoutId }
        })
        return { ...w, days }
      })
      return { ...prev, weeks }
    })
  }

  const changeWorkout = (weekIndex: number, dayIndex: number, workoutId: string | null) => {
    setFormData(prev => {
      const weeks = prev.weeks.map((w, wi) => {
        if (wi !== weekIndex) return w
        const days = w.days.map((d, di) => {
          if (di !== dayIndex) return d
          const workout = workoutId ? availableWorkouts.find(wo => wo.id === workoutId) : null
          return { ...d, workoutId, label: workout ? workout.title : dayNames[di] }
        })
        return { ...w, days }
      })
      return { ...prev, weeks }
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
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planes de Entrenamiento</h1>
            <p className="text-muted-foreground">Gestiona los programas estructurados de la plataforma</p>
          </div>
        </div>
        <Button onClick={openNewModal}>
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
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {plansLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : null}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Suscripción</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Inscritos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{plan.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{goalLabels[plan.goal]}</TableCell>
                <TableCell>{levelLabels[plan.level]}</TableCell>
                <TableCell>
                  <Badge className={`capitalize ${tierColors[plan.tier]}`}>{plan.tier}</Badge>
                </TableCell>
                <TableCell>{plan.durationWeeks} sem · {plan.daysPerWeek} días/sem</TableCell>
                <TableCell>{plan.enrolledCount.toLocaleString()}</TableCell>
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
            {filteredPlans.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron planes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingPlan ? 'Editar Plan' : 'Nuevo Plan de Entrenamiento'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editingPlan
                      ? 'Modifica los detalles del programa'
                      : 'Crea un programa estructurado semana a semana'}
                  </p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {(['info', 'weeks'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'info' ? 'Información General' : `Semanas (${formData.weeks.length})`}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'info' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título *</Label>
                      <Input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Transformación Total 4 Semanas"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe el programa..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>URL de Imagen</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.image}
                          onChange={e => setFormData({ ...formData, image: e.target.value })}
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
                        <Label>Duración (semanas)</Label>
                        <Select
                          value={String(formData.durationWeeks)}
                          onValueChange={v => handleDurationChange(Number(v))}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[2, 4, 6, 8, 10, 12].map(n => (
                              <SelectItem key={n} value={String(n)}>{n} semanas</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Días por semana</Label>
                        <Select
                          value={String(formData.daysPerWeek)}
                          onValueChange={v => handleDaysChange(Number(v))}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[2, 3, 4, 5, 6].map(n => (
                              <SelectItem key={n} value={String(n)}>{n} días</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Objetivo</Label>
                        <Select
                          value={formData.goal}
                          onValueChange={v => setFormData({ ...formData, goal: v as FitnessGoal })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(Object.entries(goalLabels) as [FitnessGoal, string][]).map(([v, l]) => (
                              <SelectItem key={v} value={v}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nivel</Label>
                        <Select
                          value={formData.level}
                          onValueChange={v => setFormData({ ...formData, level: v as FitnessLevel })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(Object.entries(levelLabels) as [FitnessLevel, string][]).map(([v, l]) => (
                              <SelectItem key={v} value={v}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Plan Requerido</Label>
                      <Select
                        value={formData.tier}
                        onValueChange={v => setFormData({ ...formData, tier: v as SubscriptionTier })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                      <Dumbbell className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>
                        Haz clic en <strong className="text-foreground">Descanso / Entreno</strong> para cambiar el tipo de día.
                        Luego selecciona el entrenamiento del desplegable. Los puntos en el encabezado muestran el resumen de cada semana.
                      </span>
                    </div>
                    {formData.weeks.map((week, wi) => (
                      <WeekEditor
                        key={week.week}
                        week={week}
                        onToggleRest={di => toggleDayRest(wi, di)}
                        onChangeWorkout={(di, wid) => changeWorkout(wi, di, wid)}
                        availableWorkouts={availableWorkouts}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Plan"
        description="Esta acción no se puede deshacer. El plan será eliminado permanentemente."
        itemName={deleteTarget?.title}
      />
    </div>
  )
}

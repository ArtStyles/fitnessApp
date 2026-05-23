import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Dumbbell, Bed, CheckCircle2, Circle, Play, Calendar, Users, Trophy, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEnrollment } from '@/src/context/EnrollmentContext'
import { useTrainingPlan } from '@/src/hooks/useApi'
import { toast } from 'sonner'

const goalLabels: Record<string, string> = {
  lose_weight: 'Pérdida de peso',
  build_muscle: 'Ganar músculo',
  improve_endurance: 'Resistencia',
  increase_strength: 'Fuerza',
  stay_healthy: 'Salud general',
}

const tierColors: Record<string, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent',
}

const levelLabels: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

export default function EnrolledPlanPage() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { getEnrollment, markDayComplete, isDayComplete, unenrollFromPlan } = useEnrollment()

  const { data: plan, isLoading } = useTrainingPlan(planId)
  const enrollment = planId ? getEnrollment(planId) : null

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  if (!plan || !enrollment) {
    return (
      <div className="text-center py-16">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">No estás inscrito en este plan</h2>
        <p className="text-muted-foreground mb-6">Inscríbete primero desde la página de programas.</p>
        <Button asChild>
          <Link to="/training-plans">Ver programas</Link>
        </Button>
      </div>
    )
  }

  const allDays = enrollment.dayProgress
  const completedDays = allDays.filter(d => d.completedAt !== null).length
  const totalTrainingDays = plan.weeks.reduce(
    (acc, w) => acc + w.days.filter(d => !d.isRest).length, 0
  )
  const progressPct = totalTrainingDays > 0 ? Math.round((completedDays / totalTrainingDays) * 100) : 0

  const handleMarkComplete = async (week: number, day: number) => {
    await markDayComplete(plan.id, week, day)
    toast.success('Día marcado como completado')
  }

  const handleUnenroll = async () => {
    try {
      await unenrollFromPlan(plan.id)
      toast.success('Inscripción cancelada')
      navigate('/training-plans')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al cancelar inscripción')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Button variant="ghost" asChild>
        <Link to="/training-plans">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Programas
        </Link>
      </Button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative h-48 rounded-2xl overflow-hidden">
          <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={`capitalize ${tierColors[plan.tier]}`}>{plan.tier}</Badge>
              <Badge variant="outline">{levelLabels[plan.level]}</Badge>
              <Badge variant="outline">{goalLabels[plan.goal]}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{plan.title}</h1>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <Calendar className="w-6 h-6 mx-auto mb-1 text-primary" />
          <p className="text-lg font-bold">{plan.durationWeeks}</p>
          <p className="text-xs text-muted-foreground">Semanas</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <Dumbbell className="w-6 h-6 mx-auto mb-1 text-accent" />
          <p className="text-lg font-bold">{plan.daysPerWeek}</p>
          <p className="text-xs text-muted-foreground">Días/semana</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <Users className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{plan.enrolledCount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Inscritos</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Progreso general</p>
          <span className="text-sm font-bold text-primary">{progressPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {completedDays} de {totalTrainingDays} sesiones completadas
        </p>
      </div>

      {/* Weeks */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Programa semana a semana</h2>

        {plan.weeks.map(week => {
          const weekCompletedDays = week.days.filter(
            d => !d.isRest && isDayComplete(plan.id, week.week, d.day)
          ).length
          const weekTotalDays = week.days.filter(d => !d.isRest).length

          return (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (week.week - 1) * 0.07 }}
              className="rounded-2xl bg-card border border-border overflow-hidden"
            >
              {/* Week header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div>
                  <p className="font-semibold">Semana {week.week}</p>
                  <p className="text-xs text-muted-foreground">
                    {weekCompletedDays}/{weekTotalDays} sesiones completadas
                  </p>
                </div>
                {weekCompletedDays === weekTotalDays && weekTotalDays > 0 && (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Completada
                  </Badge>
                )}
              </div>

              {/* Days */}
              <div className="p-4 space-y-3">
                {week.days.map(day => {
                  const completed = !day.isRest && isDayComplete(plan.id, week.week, day.day)

                  return (
                    <div
                      key={day.day}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                        completed
                          ? 'bg-primary/10 border-primary/30'
                          : day.isRest
                          ? 'bg-secondary/30 border-transparent'
                          : 'bg-card border-border hover:border-primary/30'
                      }`}
                    >
                      {/* Day icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        day.isRest
                          ? 'bg-secondary text-muted-foreground'
                          : completed
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {day.isRest
                          ? <Bed className="w-5 h-5" />
                          : completed
                          ? <CheckCircle2 className="w-5 h-5 text-primary" />
                          : <Dumbbell className="w-5 h-5" />
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {day.isRest ? 'Día de descanso' : day.label ?? 'Entrenamiento libre'}
                        </p>
                        {day.isRest && (
                          <p className="text-xs text-muted-foreground">Recuperación activa o descanso total</p>
                        )}
                      </div>

                      {/* Actions */}
                      {!day.isRest && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {day.workoutId && !completed && (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link to={`/workouts/${day.workoutId}/track`}>
                                <Play className="w-3.5 h-3.5 mr-1" />
                                Iniciar
                              </Link>
                            </Button>
                          )}
                          {!completed ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkComplete(week.week, day.day)}
                            >
                              <Circle className="w-4 h-4 mr-1" />
                              Marcar
                            </Button>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Listo
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Unenroll */}
      <div className="pb-8">
        <button
          onClick={handleUnenroll}
          className="text-sm text-destructive hover:underline"
        >
          Cancelar inscripción en este programa
        </button>
      </div>
    </div>
  )
}

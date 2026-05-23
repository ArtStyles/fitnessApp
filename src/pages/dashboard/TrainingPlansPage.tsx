import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Lock, Users, Calendar, ChevronDown, ChevronUp, Dumbbell, Bed, CheckCircle2, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/src/context/AuthContext'
import { useEnrollment } from '@/src/context/EnrollmentContext'
import { PaywallModal } from '@/src/components/ui/PaywallModal'
import { useTrainingPlans } from '@/src/hooks/useApi'
import type { TrainingPlan, SubscriptionTier } from '@/src/types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const goalLabels: Record<string, string> = {
  lose_weight: 'Pérdida de peso',
  build_muscle: 'Ganar músculo',
  improve_endurance: 'Resistencia',
  increase_strength: 'Fuerza',
  stay_healthy: 'Salud general',
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
}

const levelLabels: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent',
}

function PlanCard({ plan }: { plan: TrainingPlan }) {
  const { hasAccess } = useAuth()
  const { enrollInPlan, getEnrollment } = useEnrollment()
  const navigate = useNavigate()

  const canAccess = hasAccess(plan.tier)
  const enrollment = getEnrollment(plan.id)
  const isEnrolled = enrollment !== null

  const [expanded, setExpanded] = useState(false)
  const [paywall, setPaywall] = useState(false)

  const handleEnroll = async () => {
    if (!canAccess) { setPaywall(true); return }
    if (isEnrolled) { navigate(`/training-plans/${plan.id}`); return }
    try {
      await enrollInPlan(plan)
      toast.success(`¡Inscrito en "${plan.title}"! Empieza cuando quieras.`)
      navigate(`/training-plans/${plan.id}`)
    } catch (err: any) {
      toast.error(err.message ?? 'Error al inscribirse')
    }
  }

  // Progress
  const totalTrainingDays = plan.weeks.reduce(
    (acc, w) => acc + w.days.filter(d => !d.isRest).length, 0
  )
  const completedDays = enrollment
    ? enrollment.dayProgress.filter(d => d.completedAt !== null).length
    : 0
  const progressPct = isEnrolled && totalTrainingDays > 0
    ? Math.round((completedDays / totalTrainingDays) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {!canAccess && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={`capitalize ${tierColors[plan.tier]}`}>{plan.tier}</Badge>
        </div>
        {isEnrolled && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-500/90 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Inscrito
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className={levelColors[plan.level]}>{levelLabels[plan.level]}</Badge>
            <Badge variant="outline">{goalLabels[plan.goal]}</Badge>
          </div>
          <h3 className="text-lg font-bold">{plan.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{plan.durationWeeks} semanas</span>
          <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" />{plan.daysPerWeek} días/sem</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{plan.enrolledCount.toLocaleString()}</span>
        </div>

        {/* Progress bar (only if enrolled) */}
        {isEnrolled && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span className="font-semibold text-primary">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{completedDays}/{totalTrainingDays} sesiones</p>
          </div>
        )}

        {/* Week preview toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? 'Ocultar programa' : 'Ver programa completo'}
        </button>

        {expanded && (
          <div className="space-y-3 pt-1">
            {plan.weeks.map(week => (
              <div key={week.week}>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Semana {week.week}</p>
                <div className="grid grid-cols-7 gap-1">
                  {week.days.map(day => (
                    <div
                      key={day.day}
                      title={day.label}
                      className={`h-8 rounded flex items-center justify-center ${
                        day.isRest ? 'bg-secondary' : 'bg-primary/20'
                      }`}
                    >
                      {day.isRest
                        ? <Bed className="w-3 h-3 text-muted-foreground" />
                        : <Dumbbell className="w-3 h-3 text-primary" />
                      }
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-0.5">
                  {['L','M','X','J','V','S','D'].map(d => <span key={d}>{d}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <Button onClick={handleEnroll} className="w-full" variant={canAccess ? 'default' : 'outline'}>
          {!canAccess
            ? <><Lock className="w-4 h-4 mr-2" />Requiere plan {plan.tier}</>
            : isEnrolled
            ? 'Ver mi progreso'
            : 'Comenzar programa'
          }
        </Button>
      </div>

      <PaywallModal
        open={paywall}
        onClose={() => setPaywall(false)}
        requiredTier={plan.tier}
        featureName={plan.title}
        featureDescription={`Programa de ${plan.durationWeeks} semanas para ${goalLabels[plan.goal].toLowerCase()}`}
      />
    </motion.div>
  )
}

export default function TrainingPlansPage() {
  const { data, isLoading } = useTrainingPlans()
  const plans = data?.plans ?? []

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planes de Entrenamiento</h1>
            <p className="text-muted-foreground">Programas estructurados de 4 a 8 semanas con progresión garantizada</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: TrainingPlan, i: number) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <PlanCard plan={plan} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

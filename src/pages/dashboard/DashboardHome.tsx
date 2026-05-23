import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Dumbbell, Utensils, TrendingUp, BookOpen, Flame, Clock, Target, Trophy, ChevronRight } from 'lucide-react'
import { useAuth } from '@/src/context/AuthContext'
import { useGamification } from '@/src/context/GamificationContext'
import WorkoutCard from '@/src/components/ui/WorkoutCard'
import { ActivityRing } from '@/src/components/ui/ActivityRing'
import { useWorkouts, useGamificationData, useWorkoutHistory } from '@/src/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const goalLabels: Record<string, string> = {
  lose_weight: 'Pérdida de peso',
  build_muscle: 'Ganar músculo',
  improve_endurance: 'Resistencia',
  increase_strength: 'Fuerza',
  stay_healthy: 'Salud general',
}

export default function DashboardHome() {
  const { user } = useAuth()
  const { getLevelInfo } = useGamification()

  const { data: workoutsData } = useWorkouts({ limit: 3 })
  const { data: gami } = useGamificationData()
  const { data: historyData } = useWorkoutHistory(1, 50)

  // Count sessions completed this week (Mon–Sun)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  startOfWeek.setHours(0, 0, 0, 0)
  const completedThisWeek = (historyData?.sessions ?? []).filter(s =>
    s.completedAt !== null && new Date(s.completedAt) >= startOfWeek
  ).length

  const weeklyGoal = user?.onboarding?.daysPerWeek ?? 5
  const weekProgress = Math.min(100, (completedThisWeek / weeklyGoal) * 100)
  const dailyGoalMins = (user?.onboarding?.daysPerWeek ?? 5) * 30
  // Use real total minutes from user stats if available
  const todayMins = user?.stats?.totalMinutes
    ? Math.min(dailyGoalMins, Math.round(user.stats.totalMinutes / 7))
    : 0
  const activityPercent = Math.min(100, (todayMins / dailyGoalMins) * 100)

  const levelInfo = getLevelInfo(user?.stats.points ?? 0)
  const pointsInLevel = (user?.stats.points ?? 0) - levelInfo.minPoints
  const pointsNeeded = levelInfo.maxPoints === Infinity ? 1000 : levelInfo.maxPoints - levelInfo.minPoints
  const levelProgress = Math.min(100, (pointsInLevel / pointsNeeded) * 100)

  const recommendedWorkout = workoutsData?.workouts[0]
  const activeChallenge = gami?.challenges[0]

  return (
    <div className="space-y-8" id="main-content">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Hola, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            {user?.onboarding?.goal ? goalLabels[user.onboarding.goal] : 'Continúa con tu progreso'}
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/workouts">
            <Dumbbell className="w-4 h-4 mr-2" />
            Comenzar Entrenamiento
          </Link>
        </Button>
      </motion.div>

      {/* Activity rings + streak + level */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex flex-wrap gap-8 justify-around">
            {/* Activity ring */}
            <ActivityRing
              value={activityPercent}
              label="Actividad hoy"
              sublabel={`${todayMins} / ${dailyGoalMins} min`}
              color="oklch(0.75 0.18 45)"
            />

            {/* Streak */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-full bg-orange-500/10 border-4 border-orange-500 flex flex-col items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 mb-0.5" />
                <span className="text-3xl font-bold">{user?.stats.currentStreak ?? 0}</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">Racha actual</p>
                <p className="text-xs text-muted-foreground">Mejor: {user?.stats.longestStreak ?? 0} días</p>
              </div>
            </div>

            {/* Level / Points */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary flex flex-col items-center justify-center">
                <Trophy className="w-5 h-5 text-primary mb-0.5" />
                <span className="text-3xl font-bold">{levelInfo.level}</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{levelInfo.title}</p>
                <p className="text-xs text-muted-foreground">{user?.stats.points ?? 0} pts</p>
              </div>
            </div>

            {/* Weekly progress */}
            <div className="flex flex-col items-center gap-2">
              <ActivityRing
                value={weekProgress}
                label="Semana"
                sublabel={`${completedThisWeek}/${weeklyGoal} días`}
                color="oklch(0.70 0.15 180)"
              />
            </div>
          </div>

          {/* Level progress bar */}
          {levelInfo.maxPoints !== Infinity && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Nivel {levelInfo.level} — {levelInfo.title}</span>
                <span>{user?.stats.points ?? 0} / {levelInfo.maxPoints} pts</span>
              </div>
              <Progress value={levelProgress} className="h-1.5" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Active challenge */}
      {activeChallenge && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <Badge variant="outline" className="text-primary border-primary/30 text-xs">Reto Activo</Badge>
                </div>
                <h3 className="font-semibold">{activeChallenge.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{activeChallenge.description}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{activeChallenge.current} / {activeChallenge.goal} {activeChallenge.unit}</span>
                    <span className="font-medium">{Math.round((activeChallenge.current / activeChallenge.goal) * 100)}%</span>
                  </div>
                  <Progress value={(activeChallenge.current / activeChallenge.goal) * 100} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Termina {formatDistanceToNow(new Date(activeChallenge.endsAt), { locale: es, addSuffix: true })} · {activeChallenge.reward}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0" asChild>
                <Link to="/workouts"><ChevronRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Dumbbell,   label: 'Entrenamientos', href: '/workouts',        color: 'from-primary/20 to-primary/5' },
          { icon: BookOpen,   label: 'Programas',      href: '/training-plans',  color: 'from-accent/20 to-accent/5' },
          { icon: Utensils,   label: 'Nutrición',      href: '/nutrition',       color: 'from-yellow-500/20 to-yellow-500/5' },
          { icon: TrendingUp, label: 'Mi Progreso',    href: '/progress',        color: 'from-green-500/20 to-green-500/5' },
        ].map(item => (
          <Link
            key={item.href}
            to={item.href}
            className={`p-5 rounded-xl bg-gradient-to-br ${item.color} border border-border hover:border-primary/50 transition-all group`}
          >
            <item.icon className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-sm">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Today's recommendation + Stats */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recommended workout */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recomendado para hoy</h2>
            <Link to="/workouts" className="text-sm text-primary hover:underline">Ver todos</Link>
          </div>
          {recommendedWorkout && <WorkoutCard workout={recommendedWorkout} />}
          <div className="grid md:grid-cols-2 gap-4">
            {workoutsData?.workouts.slice(1, 3).map(w => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tus stats</h2>
          {[
            { icon: Dumbbell, label: 'Entrenamientos totales', value: user?.stats.workoutsCompleted ?? 0, color: 'text-primary' },
            { icon: Clock,    label: 'Tiempo total',           value: `${Math.floor((user?.stats.totalMinutes ?? 0) / 60)}h`, color: 'text-accent' },
            { icon: Target,   label: 'Plan activo',            value: user?.subscription ?? 'basic', color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="font-bold capitalize">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}

          {/* Badges preview */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-sm">Badges recientes</p>
              <Link to="/profile" className="text-xs text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['⚡', '🔥', '🏃', '🗺️'].map((icon, i) => (
                <span key={i} className="text-2xl" title="Badge desbloqueado" aria-hidden="true">{icon}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

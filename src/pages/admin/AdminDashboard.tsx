import { motion } from 'framer-motion'
import { Users, Dumbbell, Utensils, TrendingUp, DollarSign, Activity } from 'lucide-react'
import StatCard from '@/src/components/ui/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkouts, useMealPlans } from '@/src/hooks/useApi'
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const subscriptionData = [
  { name: 'Ene', basic: 120, premium: 80, vip: 25 },
  { name: 'Feb', basic: 150, premium: 95, vip: 32 },
  { name: 'Mar', basic: 180, premium: 120, vip: 45 },
  { name: 'Abr', basic: 220, premium: 150, vip: 58 },
  { name: 'May', basic: 280, premium: 190, vip: 72 },
  { name: 'Jun', basic: 350, premium: 240, vip: 95 },
]

const tierDistribution = [
  { name: 'Básico', value: 45, color: 'oklch(0.65 0 0)' },
  { name: 'Premium', value: 38, color: 'oklch(0.75 0.18 45)' },
  { name: 'VIP', value: 17, color: 'oklch(0.70 0.15 180)' },
]

const recentActivity = [
  { user: 'María García', action: 'completó entrenamiento', time: 'Hace 5 min' },
  { user: 'Carlos López', action: 'se suscribió a Premium', time: 'Hace 12 min' },
  { user: 'Ana Martínez', action: 'publicó en la comunidad', time: 'Hace 25 min' },
  { user: 'Roberto Díaz', action: 'actualizó su progreso', time: 'Hace 45 min' },
  { user: 'Laura Sánchez', action: 'completó plan de nutrición', time: 'Hace 1 hora' },
]

export default function AdminDashboard() {
  const { data: workoutsData } = useWorkouts()
  const { data: mealPlansData } = useMealPlans()
  const workoutsCount = workoutsData?.workouts.length ?? 0
  const mealPlansCount = mealPlansData?.plans.length ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Vista general de la plataforma FitForge
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Usuarios Totales"
          value="12,458"
          subtitle="+234 este mes"
          icon={Users}
          color="primary"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Entrenamientos"
          value={workoutsCount}
          subtitle="Disponibles"
          icon={Dumbbell}
          color="accent"
        />
        <StatCard
          title="Planes Nutrición"
          value={mealPlansCount}
          subtitle="Activos"
          icon={Utensils}
        />
        <StatCard
          title="Ingresos Mes"
          value="$48,250"
          subtitle="Recurrentes"
          icon={DollarSign}
          color="primary"
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subscriptions Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crecimiento de Suscripciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subscriptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                  <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.16 0.02 250)',
                      border: '1px solid oklch(0.28 0.02 250)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="basic" stackId="a" fill="oklch(0.65 0 0)" name="Básico" />
                  <Bar dataKey="premium" stackId="a" fill="oklch(0.75 0.18 45)" name="Premium" />
                  <Bar dataKey="vip" stackId="a" fill="oklch(0.70 0.15 180)" name="VIP" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.16 0.02 250)',
                      border: '1px solid oklch(0.28 0.02 250)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {tierDistribution.map((tier) => (
                <div key={tier.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {tier.name} ({tier.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Métricas Clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Tasa de Retención', value: '94%', trend: '+2%' },
                { label: 'Entrenamientos Completados Hoy', value: '1,234', trend: '+156' },
                { label: 'Promedio de Sesiones/Usuario', value: '4.2', trend: '+0.3' },
                { label: 'NPS Score', value: '72', trend: '+5' },
                { label: 'Tiempo Promedio en App', value: '28 min', trend: '+3 min' },
              ].map((metric) => (
                <div 
                  key={metric.label} 
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{metric.value}</span>
                    <span className="text-xs text-green-500">{metric.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

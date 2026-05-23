import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Scale, Ruler, Camera, Plus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProgress, useCreateProgress } from '@/src/hooks/useApi'
import { ConsistencyHeatmap } from '@/src/components/ui/ConsistencyHeatmap'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import type { ProgressEntry } from '@/src/types'

export default function ProgressPage() {
  const { data: progressData = [], isLoading } = useProgress()
  const createProgress = useCreateProgress()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weightKg: '',
    bodyFatPct: '',
    notes: '',
  })

  const latestProgress = progressData[progressData.length - 1] as ProgressEntry | undefined
  const previousProgress = progressData[progressData.length - 2] as ProgressEntry | undefined

  const activityDays: any[] = []

  const chartData = progressData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    peso: entry.weight,
    grasa: entry.bodyFat
  }))

  const hasEnoughData = progressData.length >= 2

  // Safe delta with NaN guard
  const weightDelta = (latestProgress?.weight != null && previousProgress?.weight != null)
    ? latestProgress.weight - previousProgress.weight
    : null

  const fatDelta = (latestProgress?.bodyFat != null && previousProgress?.bodyFat != null)
    ? latestProgress.bodyFat - previousProgress.bodyFat
    : null

  const weeklyData = [
    { name: 'Lun', semana_ant: 1, esta_semana: 1 },
    { name: 'Mar', semana_ant: 0, esta_semana: 1 },
    { name: 'Mié', semana_ant: 1, esta_semana: 1 },
    { name: 'Jue', semana_ant: 1, esta_semana: 0 },
    { name: 'Vie', semana_ant: 0, esta_semana: 1 },
    { name: 'Sáb', semana_ant: 1, esta_semana: 0 },
    { name: 'Dom', semana_ant: 0, esta_semana: 0 },
  ]

  const handleRegister = async () => {
    if (!form.date) { toast.error('La fecha es obligatoria'); return }
    try {
      await createProgress.mutateAsync({
        date:       form.date,
        weightKg:   form.weightKg   ? parseFloat(form.weightKg)   : undefined,
        bodyFatPct: form.bodyFatPct ? parseFloat(form.bodyFatPct) : undefined,
        notes:      form.notes || undefined,
      })
      setShowModal(false)
      setForm({ date: new Date().toISOString().split('T')[0], weightKg: '', bodyFatPct: '', notes: '' })
    } catch {
      // error toast handled by the mutation
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Mi Progreso</h1>
            <p className="text-muted-foreground">Seguimiento de tu evolución física</p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Progreso
        </Button>
      </motion.div>

      {!hasEnoughData && (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {progressData.length === 0
              ? 'Registra tu primer progreso para ver estadísticas'
              : 'Necesitas al menos 2 registros para ver la comparación'}
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Ahora
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      {hasEnoughData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peso Actual</p>
                  <p className="text-2xl font-bold">{latestProgress?.weight ?? '—'} kg</p>
                </div>
                <Scale className="w-8 h-8 text-muted-foreground" />
              </div>
              {weightDelta !== null && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${weightDelta < 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {weightDelta < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  <span>{Math.abs(weightDelta).toFixed(1)} kg</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Grasa Corporal</p>
                  <p className="text-2xl font-bold">{latestProgress?.bodyFat ?? '—'}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">%</span>
                </div>
              </div>
              {fatDelta !== null && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${fatDelta < 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {fatDelta < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  <span>{Math.abs(fatDelta).toFixed(1)}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cintura</p>
                  <p className="text-2xl font-bold">{latestProgress?.measurements?.waist ?? '—'} cm</p>
                </div>
                <Ruler className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Registros</p>
                  <p className="text-2xl font-bold">{progressData.length}</p>
                </div>
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Peso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.16 0.02 250)', border: '1px solid oklch(0.28 0.02 250)', borderRadius: '8px' }} labelStyle={{ color: 'oklch(0.98 0 0)' }} />
                <Line type="monotone" dataKey="peso" stroke="oklch(0.75 0.18 45)" strokeWidth={3} dot={{ fill: 'oklch(0.75 0.18 45)', strokeWidth: 2 }} name="Peso (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Body Fat Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Grasa Corporal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.16 0.02 250)', border: '1px solid oklch(0.28 0.02 250)', borderRadius: '8px' }} labelStyle={{ color: 'oklch(0.98 0 0)' }} />
                <Line type="monotone" dataKey="grasa" stroke="oklch(0.70 0.15 180)" strokeWidth={3} dot={{ fill: 'oklch(0.70 0.15 180)', strokeWidth: 2 }} name="Grasa (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Measurements */}
      {hasEnoughData && latestProgress?.measurements && (
        <Card>
          <CardHeader>
            <CardTitle>Medidas Corporales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Pecho',   value: latestProgress.measurements.chest },
                { label: 'Cintura', value: latestProgress.measurements.waist },
                { label: 'Caderas', value: latestProgress.measurements.hips },
                { label: 'Brazos',  value: latestProgress.measurements.arms },
                { label: 'Muslos',  value: latestProgress.measurements.thighs },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-lg bg-secondary text-center">
                  <p className="text-2xl font-bold">
                    {m.value ?? '—'}
                    {m.value != null && <span className="text-sm font-normal text-muted-foreground ml-1">cm</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consistency Heatmap */}
      <Card>
        <CardHeader><CardTitle>Consistencia de Entrenamiento</CardTitle></CardHeader>
        <CardContent>
          <ConsistencyHeatmap days={activityDays} />
        </CardContent>
      </Card>

      {/* Week comparison */}
      <Card>
        <CardHeader><CardTitle>Esta semana vs Semana anterior</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickFormatter={v => v === 0 ? 'No' : 'Sí'} domain={[0,1]} ticks={[0,1]} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.16 0.02 250)', border: '1px solid oklch(0.28 0.02 250)', borderRadius: '8px' }} formatter={(v: number) => [v === 1 ? 'Entrenó' : 'Descanso', '']} />
                <Bar dataKey="semana_ant" name="Semana ant." fill="oklch(0.65 0 0)" radius={[4,4,0,0]} />
                <Bar dataKey="esta_semana" name="Esta semana" fill="oklch(0.75 0.18 45)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Progress History */}
      <Card>
        <CardHeader><CardTitle>Historial de Registros</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                No tienes registros aún. Comienza registrando tu progreso.
              </p>
            )}
            {[...progressData].reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium">
                    {new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.weight != null ? `Peso: ${entry.weight}kg` : ''}
                    {entry.weight != null && entry.bodyFat != null ? ' | ' : ''}
                    {entry.bodyFat != null ? `Grasa: ${entry.bodyFat}%` : ''}
                    {entry.weight == null && entry.bodyFat == null ? 'Sin datos de peso/grasa' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Registrar Progreso</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Fecha</Label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Peso (kg)</Label>
                  <Input type="number" step="0.1" placeholder="75.5" value={form.weightKg} onChange={e => setForm({ ...form, weightKg: e.target.value })} />
                </div>
                <div>
                  <Label>Grasa corporal (%)</Label>
                  <Input type="number" step="0.1" placeholder="18.5" value={form.bodyFatPct} onChange={e => setForm({ ...form, bodyFatPct: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Notas (opcional)</Label>
                <Input placeholder="Cómo te sentiste hoy..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleRegister} disabled={createProgress.isPending}>
                {createProgress.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

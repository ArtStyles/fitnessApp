import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/src/context/AuthContext'
import type { FitnessGoal, FitnessLevel, Equipment, OnboardingProfile } from '@/src/types'

// ─── Step data ─────────────────────────────────────────────────────────────

const goals: { value: FitnessGoal; label: string; icon: string; desc: string }[] = [
  { value: 'lose_weight',       label: 'Perder Peso',         icon: '🔥', desc: 'Quemar grasa y mejorar composición corporal' },
  { value: 'build_muscle',      label: 'Ganar Músculo',       icon: '💪', desc: 'Aumentar masa muscular y fuerza' },
  { value: 'improve_endurance', label: 'Mejorar Resistencia', icon: '🏃', desc: 'Cardio, resistencia y capacidad aeróbica' },
  { value: 'increase_strength', label: 'Aumentar Fuerza',     icon: '🏋️', desc: 'Levantar más peso y potencia máxima' },
  { value: 'stay_healthy',      label: 'Mantenerme Activo',   icon: '🌱', desc: 'Salud general, bienestar y energía' },
]

const levels: { value: FitnessLevel; label: string; icon: string; desc: string }[] = [
  { value: 'beginner',     label: 'Principiante', icon: '🌱', desc: 'Menos de 6 meses entrenando o volviendo al deporte' },
  { value: 'intermediate', label: 'Intermedio',   icon: '⚡', desc: '6 meses a 2 años de experiencia consistente' },
  { value: 'advanced',     label: 'Avanzado',     icon: '🔥', desc: 'Más de 2 años con entrenamiento serio y estructurado' },
]

const equipmentOptions: { value: Equipment; label: string; icon: string }[] = [
  { value: 'none',            label: 'Solo cuerpo',       icon: '🤸' },
  { value: 'dumbbells',       label: 'Mancuernas',        icon: '🏋️' },
  { value: 'barbell',         label: 'Barra + discos',    icon: '🪨' },
  { value: 'resistance_bands',label: 'Bandas elásticas',  icon: '🔗' },
  { value: 'pull_up_bar',     label: 'Barra de dominadas',icon: '🎯' },
  { value: 'gym',             label: 'Gimnasio completo', icon: '🏟️' },
]

const daysOptions = [2, 3, 4, 5, 6]

const TOTAL_STEPS = 5

// ─── Component ─────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { saveOnboarding } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({
    equipment: [],
    daysPerWeek: 3,
  })

  const progress = ((step) / TOTAL_STEPS) * 100

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
    else finish()
  }
  const back = () => setStep(s => Math.max(0, s - 1))

  const finish = () => {
    const finalProfile: OnboardingProfile = {
      goal: profile.goal ?? 'stay_healthy',
      level: profile.level ?? 'beginner',
      equipment: profile.equipment ?? [],
      daysPerWeek: profile.daysPerWeek ?? 3,
      completed: true,
    }
    saveOnboarding(finalProfile)
    navigate('/dashboard')
  }

  const canContinue = () => {
    if (step === 0) return !!profile.goal
    if (step === 1) return !!profile.level
    if (step === 2) return (profile.equipment?.length ?? 0) > 0
    if (step === 3) return !!profile.daysPerWeek
    return true
  }

  const toggleEquipment = (eq: Equipment) => {
    setProfile(p => {
      const current = p.equipment ?? []
      const has = current.includes(eq)
      return { ...p, equipment: has ? current.filter(e => e !== eq) : [...current, eq] }
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Configurando tu perfil</span>
          <span>{step + 1} de {TOTAL_STEPS}</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg"
        >
          {/* Step 0 — Goal */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">¿Cuál es tu objetivo principal?</h1>
                <p className="text-muted-foreground">Personalizaremos tu experiencia según tu meta</p>
              </div>
              <div className="space-y-3">
                {goals.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setProfile(p => ({ ...p, goal: g.value }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      profile.goal === g.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">{g.icon}</span>
                    <div>
                      <p className="font-semibold">{g.label}</p>
                      <p className="text-sm text-muted-foreground">{g.desc}</p>
                    </div>
                    {profile.goal === g.value && (
                      <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Level */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">¿Cuál es tu nivel de experiencia?</h1>
                <p className="text-muted-foreground">Esto nos ayuda a recomendarte el programa correcto</p>
              </div>
              <div className="space-y-3">
                {levels.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setProfile(p => ({ ...p, level: l.value }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      profile.level === l.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">{l.icon}</span>
                    <div>
                      <p className="font-semibold">{l.label}</p>
                      <p className="text-sm text-muted-foreground">{l.desc}</p>
                    </div>
                    {profile.level === l.value && (
                      <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Equipment */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">¿Con qué equipamiento cuentas?</h1>
                <p className="text-muted-foreground">Selecciona todo lo que tienes disponible</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {equipmentOptions.map(eq => {
                  const selected = profile.equipment?.includes(eq.value)
                  return (
                    <button
                      key={eq.value}
                      onClick={() => toggleEquipment(eq.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xl" aria-hidden="true">{eq.icon}</span>
                      <span className="font-medium text-sm">{eq.label}</span>
                      {selected && <Check className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Days per week */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">¿Cuántos días por semana puedes entrenar?</h1>
                <p className="text-muted-foreground">Sé realista — la consistencia importa más que la frecuencia</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {daysOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => setProfile(p => ({ ...p, daysPerWeek: d }))}
                    className={`w-16 h-16 rounded-xl border-2 font-bold text-lg transition-all ${
                      profile.daysPerWeek === d
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.daysPerWeek} días/semana → {profile.daysPerWeek! >= 5 ? 'Avanzado' : profile.daysPerWeek! >= 3 ? 'Moderado' : 'Ligero'}
              </p>
            </div>
          )}

          {/* Step 4 — Ready */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="text-6xl mb-2" aria-hidden="true">🎯</div>
              <div>
                <h1 className="text-2xl font-bold mb-2">¡Todo listo!</h1>
                <p className="text-muted-foreground">
                  Hemos preparado tu experiencia personalizada. Aquí está tu resumen:
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border text-left space-y-3">
                <SummaryRow label="Objetivo" value={goals.find(g => g.value === profile.goal)?.label ?? ''} />
                <SummaryRow label="Nivel" value={levels.find(l => l.value === profile.level)?.label ?? ''} />
                <SummaryRow label="Equipamiento" value={`${profile.equipment?.length ?? 0} opciones`} />
                <SummaryRow label="Días / semana" value={`${profile.daysPerWeek} días`} />
              </div>
              <p className="text-xs text-muted-foreground">
                Puedes cambiar esto en cualquier momento desde tu perfil
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="w-full max-w-lg mt-8 flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={back} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
        )}
        <Button
          onClick={next}
          disabled={!canContinue()}
          className="flex-1"
        >
          {step === TOTAL_STEPS - 1 ? '¡Comenzar!' : 'Continuar'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {step < TOTAL_STEPS - 1 && (
        <button
          onClick={finish}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Saltar por ahora
        </button>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

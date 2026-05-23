import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, ChevronRight, Dumbbell, Play,
  Target, Lightbulb, Package, Layers, Loader2,
} from 'lucide-react'
import { useExercises } from '@/src/hooks/useApi'
import type { ExerciseLibraryItem, ExerciseCategory, MuscleGroup } from '@/src/types'

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: Array<ExerciseCategory | 'Todos'> = [
  'Todos', 'Fuerza', 'Core', 'Cardio', 'Pliometría', 'Funcional',
]

const DIFFICULTY_LABELS = {
  beginner:     { label: 'Principiante', color: 'text-green-400',  dot: 'bg-green-400' },
  intermediate: { label: 'Intermedio',   color: 'text-yellow-400', dot: 'bg-yellow-400' },
  advanced:     { label: 'Avanzado',     color: 'text-red-400',    dot: 'bg-red-400' },
}

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest:       'Pecho',
  back:        'Espalda',
  shoulders:   'Hombros',
  biceps:      'Bíceps',
  triceps:     'Tríceps',
  core:        'Core',
  glutes:      'Glúteos',
  quads:       'Cuádriceps',
  hamstrings:  'Isquiotibiales',
  calves:      'Pantorrillas',
}

const MUSCLE_OPTIONS: Array<{ key: MuscleGroup | 'all'; label: string }> = [
  { key: 'all',        label: 'Todos los músculos' },
  { key: 'chest',      label: 'Pecho' },
  { key: 'back',       label: 'Espalda' },
  { key: 'shoulders',  label: 'Hombros' },
  { key: 'biceps',     label: 'Bíceps' },
  { key: 'triceps',    label: 'Tríceps' },
  { key: 'core',       label: 'Core' },
  { key: 'glutes',     label: 'Glúteos' },
  { key: 'quads',      label: 'Cuádriceps' },
  { key: 'hamstrings', label: 'Isquiotibiales' },
  { key: 'calves',     label: 'Pantorrillas' },
]

// ── Exercise Card ─────────────────────────────────────────────────────────────

function ExerciseCard({
  exercise,
  onClick,
}: {
  exercise: ExerciseLibraryItem
  onClick: () => void
}) {
  const diff = DIFFICULTY_LABELS[exercise.difficulty]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-card border border-border hover:border-primary/40 transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

        {/* Category pill — top left */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-xs font-semibold text-white">
          {exercise.category}
        </span>

        {/* Difficulty dot — top right */}
        <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-xs font-medium text-white">
          <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
          {diff.label}
        </span>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors leading-tight">
          {exercise.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {exercise.description}
        </p>

        {/* Muscle tags */}
        <div className="flex flex-wrap gap-1.5">
          {exercise.muscleGroups.slice(0, 3).map(m => (
            <span
              key={m}
              className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground"
            >
              {MUSCLE_LABELS[m]}
            </span>
          ))}
          {exercise.muscleGroups.length > 3 && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
              +{exercise.muscleGroups.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{exercise.primaryMuscle}</span>
          <span className="flex items-center gap-1 text-xs text-primary font-medium">
            Ver ejercicio <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Exercise Detail Modal ─────────────────────────────────────────────────────

function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: ExerciseLibraryItem
  onClose: () => void
}) {
  const diff = DIFFICULTY_LABELS[exercise.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-3xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card border border-border shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero image */}
        <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img
            src={exercise.image}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          {/* Future video placeholder badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs text-white/80 font-medium">
            <Play className="w-3.5 h-3.5 text-primary" />
            Video demo próximamente
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-start gap-3 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                  {exercise.category}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-medium ${diff.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                  {diff.label}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{exercise.name}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{exercise.primaryMuscle}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-8">
            {exercise.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Steps */}
            <div>
              <h3 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase tracking-widest text-primary">
                <Target className="w-4 h-4" />
                Ejecución paso a paso
              </h3>
              <ol className="space-y-3">
                {exercise.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-6">
              {/* Tips */}
              <div>
                <h3 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase tracking-widest text-yellow-400">
                  <Lightbulb className="w-4 h-4" />
                  Tips del entrenador
                </h3>
                <ul className="space-y-2.5">
                  {exercise.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="text-yellow-400 mt-0.5 shrink-0">›</span>
                      <span className="text-muted-foreground leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment */}
              <div>
                <h3 className="flex items-center gap-2 font-bold mb-3 text-sm uppercase tracking-widest text-accent">
                  <Package className="w-4 h-4" />
                  Material necesario
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment.map(eq => (
                    <span
                      key={eq}
                      className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Muscle groups */}
              <div>
                <h3 className="flex items-center gap-2 font-bold mb-3 text-sm uppercase tracking-widest text-muted-foreground">
                  <Dumbbell className="w-4 h-4" />
                  Músculos trabajados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map(m => (
                    <span
                      key={m}
                      className="px-3 py-1 rounded-full bg-secondary text-xs font-medium"
                    >
                      {MUSCLE_LABELS[m]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ExerciseCategory | 'Todos'>('Todos')
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all')
  const [selected, setSelected] = useState<ExerciseLibraryItem | null>(null)

  const { data, isLoading } = useExercises({
    search: search || undefined,
    category: category !== 'Todos' ? (category === 'Pliometría' ? 'Pliometria' : category) : undefined,
    difficulty: difficulty !== 'all' ? difficulty : undefined,
    muscleGroup: muscle !== 'all' ? muscle : undefined,
  })
  const filtered = data?.exercises ?? []

  return (
    <>
      <div className="p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Layers className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-black">Biblioteca de Ejercicios</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Ejercicios con instrucciones detalladas y tips profesionales.
              Próximamente con video demo.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar ejercicio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  category === cat
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty + Muscle group */}
          <div className="flex flex-wrap gap-3">
            {/* Difficulty */}
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => {
                const labels = { all: 'Todos', beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' }
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      difficulty === d
                        ? 'bg-card border border-primary/40 text-primary'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                    }`}
                  >
                    {d !== 'all' && (
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${DIFFICULTY_LABELS[d]?.dot}`} />
                    )}
                    {labels[d]}
                  </button>
                )
              })}
            </div>

            {/* Muscle group selector */}
            <select
              value={muscle}
              onChange={e => setMuscle(e.target.value as MuscleGroup | 'all')}
              className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 cursor-pointer transition-colors"
            >
              {MUSCLE_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Active filters count & clear */}
            {(category !== 'Todos' || difficulty !== 'all' || muscle !== 'all' || search) && (
              <button
                onClick={() => { setCategory('Todos'); setDifficulty('all'); setMuscle('all'); setSearch('') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} ejercicios
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(ex => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  onClick={() => setSelected(ex)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Dumbbell className="w-12 h-12 text-border mb-4" />
            <h3 className="font-bold text-lg mb-2">No se encontraron ejercicios</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Prueba con otros filtros o términos de búsqueda.
            </p>
            <button
              onClick={() => { setCategory('Todos'); setDifficulty('all'); setMuscle('all'); setSearch('') }}
              className="mt-6 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Ver todos los ejercicios
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

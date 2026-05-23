import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Dumbbell, Clock, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import WorkoutCard from '@/src/components/ui/WorkoutCard'
import { useWorkouts } from '@/src/hooks/useApi'
import type { Equipment } from '@/src/types'

const categories = ['Todos', 'Fuerza', 'Cardio', 'Core', 'Movilidad', 'Elite']
const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado']
const durations = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: '< 20 min', min: 0, max: 20 },
  { label: '20-30 min', min: 20, max: 30 },
  { label: '30-45 min', min: 30, max: 45 },
  { label: '45+ min', min: 45, max: Infinity },
]
const equipmentOptions: { value: Equipment | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'none', label: 'Sin equipo' },
  { value: 'dumbbells', label: 'Mancuernas' },
  { value: 'barbell', label: 'Barra' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'pull_up_bar', label: 'Dominadas' },
  { value: 'resistance_bands', label: 'Bandas' },
]

const difficultyMap: Record<string, string> = {
  'Principiante': 'beginner',
  'Intermedio': 'intermediate',
  'Avanzado': 'advanced',
}

export default function WorkoutsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos')
  const [selectedDuration, setSelectedDuration] = useState(durations[0])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | 'all'>('all')

  const { data, isLoading } = useWorkouts({
    search: search || undefined,
    category: selectedCategory !== 'Todos' ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== 'Todos' ? difficultyMap[selectedDifficulty] : undefined,
    equipment: selectedEquipment !== 'all' ? selectedEquipment : undefined,
  })
  const filteredWorkouts = data?.workouts ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Entrenamientos</h1>
            <p className="text-muted-foreground">{filteredWorkouts.length} rutinas disponibles</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Buscar entrenamientos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
          aria-label="Buscar entrenamientos"
        />
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categoría</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Dificultad</p>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(d => (
            <Badge
              key={d}
              variant={selectedDifficulty === d ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${selectedDifficulty === d ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/20'}`}
              onClick={() => setSelectedDifficulty(d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />Duración
        </p>
        <div className="flex flex-wrap gap-2">
          {durations.map(d => (
            <Badge
              key={d.label}
              variant={selectedDuration.label === d.label ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${selectedDuration.label === d.label ? 'bg-green-600 text-white border-green-600' : 'hover:bg-green-500/20'}`}
              onClick={() => setSelectedDuration(d)}
            >
              {d.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
          <Dumbbell className="w-3.5 h-3.5" />Equipamiento
        </p>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(eq => (
            <Badge
              key={eq.value}
              variant={selectedEquipment === eq.value ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${selectedEquipment === eq.value ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-purple-500/20'}`}
              onClick={() => setSelectedEquipment(eq.value)}
            >
              {eq.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredWorkouts.length} resultado{filteredWorkouts.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, i) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <WorkoutCard workout={workout} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No se encontraron entrenamientos</h3>
          <p className="text-muted-foreground">Intenta ajustar los filtros</p>
        </div>
      )}
    </div>
  )
}

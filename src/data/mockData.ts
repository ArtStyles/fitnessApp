import type {
  User, Workout, MealPlan, PricingPlan, ProgressEntry,
  Badge, Challenge, AppNotification, TrainingPlan, Trainer, ActivityDay,
  ExerciseLibraryItem,
} from '@/src/types'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'basico@fitforge.com',
    name: 'Ana Lopez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    subscription: 'basic',
    role: 'user',
    joinedAt: '2024-02-20',
    onboarding: { goal: 'lose_weight', level: 'beginner', equipment: ['dumbbells'], daysPerWeek: 3, completed: true },
    stats: { workoutsCompleted: 15, streakDays: 5, totalMinutes: 720, currentStreak: 5, longestStreak: 12, points: 320, level: 2 }
  },
  {
    id: '2',
    email: 'premium@fitforge.com',
    name: 'Carlos Mendez',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150',
    subscription: 'premium',
    role: 'user',
    joinedAt: '2024-01-15',
    onboarding: { goal: 'build_muscle', level: 'intermediate', equipment: ['gym', 'barbell'], daysPerWeek: 5, completed: true },
    stats: { workoutsCompleted: 47, streakDays: 12, totalMinutes: 2340, currentStreak: 12, longestStreak: 28, points: 1540, level: 5 }
  },
  {
    id: '3',
    email: 'vip@fitforge.com',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    subscription: 'vip',
    role: 'user',
    joinedAt: '2023-11-01',
    onboarding: { goal: 'increase_strength', level: 'advanced', equipment: ['gym', 'barbell', 'pull_up_bar'], daysPerWeek: 6, completed: true },
    stats: { workoutsCompleted: 89, streakDays: 30, totalMinutes: 5400, currentStreak: 30, longestStreak: 60, points: 4200, level: 9 }
  },
  {
    id: '4',
    email: 'admin@fitforge.com',
    name: 'Admin FitForge',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    subscription: 'vip',
    role: 'admin',
    joinedAt: '2023-06-01',
    onboarding: { goal: 'stay_healthy', level: 'advanced', equipment: ['gym'], daysPerWeek: 5, completed: true },
    stats: { workoutsCompleted: 156, streakDays: 45, totalMinutes: 8900, currentStreak: 45, longestStreak: 90, points: 8900, level: 12 }
  },
  {
    id: '5',
    email: 'user@fitforge.com',
    name: 'Marco Silva',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    subscription: 'premium',
    role: 'user',
    joinedAt: '2024-03-01',
    onboarding: { goal: 'build_muscle', level: 'intermediate', equipment: ['gym'], daysPerWeek: 4, completed: true },
    stats: { workoutsCompleted: 32, streakDays: 8, totalMinutes: 1600, currentStreak: 8, longestStreak: 15, points: 980, level: 4 }
  }
]

export const mockTrainers: Trainer[] = [
  {
    id: 't1',
    name: 'Alex Martínez',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200',
    specialty: 'Fuerza y Potencia',
    bio: '10 años de experiencia en entrenamiento de fuerza olímpica. Especialista en periodización avanzada.',
    workoutsCount: 48
  },
  {
    id: 't2',
    name: 'Sofia Reyes',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200',
    specialty: 'HIIT y Cardio',
    bio: 'Campeona regional de atletismo. Experta en entrenamientos de alta intensidad y quema de grasa.',
    workoutsCount: 36
  },
  {
    id: 't3',
    name: 'Diego Torres',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    specialty: 'Nutrición y Rendimiento',
    bio: 'Dietista deportivo certificado. Combina nutrición y entrenamiento para resultados óptimos.',
    workoutsCount: 24
  }
]

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Full Body Power',
    description: 'Entrenamiento completo para desarrollar fuerza y resistencia en todo el cuerpo.',
    duration: '45 min',
    durationMinutes: 45,
    difficulty: 'intermediate',
    category: 'Fuerza',
    tier: 'basic',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    completedBy: 1234,
    equipment: ['barbell', 'gym'],
    muscleGroups: ['chest', 'back', 'quads', 'hamstrings', 'shoulders'],
    trainerId: 't1',
    exercises: [
      { id: 'e1', name: 'Sentadillas', sets: 4, reps: '12', rest: '60s', notes: 'Mantén la espalda recta', muscleGroups: ['quads', 'glutes'] },
      { id: 'e2', name: 'Press de Banca', sets: 4, reps: '10', rest: '90s', muscleGroups: ['chest', 'triceps'] },
      { id: 'e3', name: 'Remo con Barra', sets: 3, reps: '12', rest: '60s', muscleGroups: ['back', 'biceps'] },
      { id: 'e4', name: 'Press Militar', sets: 3, reps: '10', rest: '60s', muscleGroups: ['shoulders', 'triceps'] },
      { id: 'e5', name: 'Peso Muerto', sets: 4, reps: '8', rest: '120s', notes: 'Controla el movimiento', muscleGroups: ['back', 'hamstrings', 'glutes'] }
    ]
  },
  {
    id: '2',
    title: 'HIIT Cardio Extreme',
    description: 'Sesión de alta intensidad para quemar grasa y mejorar tu condición cardiovascular.',
    duration: '30 min',
    durationMinutes: 30,
    difficulty: 'advanced',
    category: 'Cardio',
    tier: 'premium',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    completedBy: 892,
    equipment: ['none'],
    muscleGroups: ['core', 'quads', 'glutes', 'chest'],
    trainerId: 't2',
    exercises: [
      { id: 'e6', name: 'Burpees', sets: 4, reps: '45s', rest: '15s', muscleGroups: ['chest', 'core', 'quads'] },
      { id: 'e7', name: 'Mountain Climbers', sets: 4, reps: '45s', rest: '15s', muscleGroups: ['core', 'shoulders'] },
      { id: 'e8', name: 'Jump Squats', sets: 4, reps: '45s', rest: '15s', muscleGroups: ['quads', 'glutes'] },
      { id: 'e9', name: 'High Knees', sets: 4, reps: '45s', rest: '15s', muscleGroups: ['core', 'quads'] },
      { id: 'e10', name: 'Box Jumps', sets: 4, reps: '45s', rest: '15s', muscleGroups: ['quads', 'glutes', 'calves'] }
    ]
  },
  {
    id: '3',
    title: 'Upper Body Sculpt',
    description: 'Esculpe y define tu tren superior con esta rutina enfocada en pecho, espalda, hombros y brazos.',
    duration: '50 min',
    durationMinutes: 50,
    difficulty: 'intermediate',
    category: 'Fuerza',
    tier: 'basic',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
    completedBy: 756,
    equipment: ['pull_up_bar', 'dumbbells'],
    muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    trainerId: 't1',
    exercises: [
      { id: 'e11', name: 'Pull-ups', sets: 4, reps: '8-12', rest: '90s', muscleGroups: ['back', 'biceps'] },
      { id: 'e12', name: 'Dips', sets: 4, reps: '10-15', rest: '60s', muscleGroups: ['chest', 'triceps'] },
      { id: 'e13', name: 'Curl de Bíceps', sets: 3, reps: '12', rest: '45s', muscleGroups: ['biceps'] },
      { id: 'e14', name: 'Extensión de Tríceps', sets: 3, reps: '12', rest: '45s', muscleGroups: ['triceps'] },
      { id: 'e15', name: 'Elevaciones Laterales', sets: 3, reps: '15', rest: '45s', muscleGroups: ['shoulders'] }
    ]
  },
  {
    id: '4',
    title: 'Leg Day Destroyer',
    description: 'Rutina intensiva para piernas que construirá masa muscular y potencia en tu tren inferior.',
    duration: '55 min',
    durationMinutes: 55,
    difficulty: 'advanced',
    category: 'Fuerza',
    tier: 'premium',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800',
    completedBy: 543,
    equipment: ['gym', 'barbell'],
    muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
    trainerId: 't1',
    exercises: [
      { id: 'e16', name: 'Sentadilla Frontal', sets: 5, reps: '8', rest: '120s', muscleGroups: ['quads', 'core'] },
      { id: 'e17', name: 'Prensa de Piernas', sets: 4, reps: '12', rest: '90s', muscleGroups: ['quads', 'glutes'] },
      { id: 'e18', name: 'Zancadas Caminando', sets: 3, reps: '20', rest: '60s', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
      { id: 'e19', name: 'Curl de Femoral', sets: 4, reps: '12', rest: '60s', muscleGroups: ['hamstrings'] },
      { id: 'e20', name: 'Elevación de Pantorrillas', sets: 4, reps: '20', rest: '45s', muscleGroups: ['calves'] }
    ]
  },
  {
    id: '5',
    title: 'Core Stability Pro',
    description: 'Fortalece tu core con ejercicios diseñados por profesionales. Mejora tu postura y rendimiento.',
    duration: '25 min',
    durationMinutes: 25,
    difficulty: 'beginner',
    category: 'Core',
    tier: 'basic',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    completedBy: 2103,
    equipment: ['none'],
    muscleGroups: ['core', 'back'],
    trainerId: 't2',
    exercises: [
      { id: 'e21', name: 'Plancha', sets: 3, reps: '60s', rest: '30s', muscleGroups: ['core', 'shoulders'] },
      { id: 'e22', name: 'Dead Bug', sets: 3, reps: '12 c/lado', rest: '30s', muscleGroups: ['core'] },
      { id: 'e23', name: 'Bird Dog', sets: 3, reps: '10 c/lado', rest: '30s', muscleGroups: ['core', 'back'] },
      { id: 'e24', name: 'Crunch Inverso', sets: 3, reps: '15', rest: '30s', muscleGroups: ['core'] }
    ]
  },
  {
    id: '6',
    title: 'Elite Performance',
    description: 'Programa exclusivo VIP con técnicas avanzadas de periodización. Incluye guía personalizada.',
    duration: '60 min',
    durationMinutes: 60,
    difficulty: 'advanced',
    category: 'Elite',
    tier: 'vip',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
    completedBy: 189,
    equipment: ['gym', 'barbell'],
    muscleGroups: ['back', 'shoulders', 'quads', 'core'],
    trainerId: 't1',
    exercises: [
      { id: 'e25', name: 'Clean & Jerk', sets: 5, reps: '5', rest: '180s', notes: 'Técnica olímpica', muscleGroups: ['back', 'shoulders', 'quads'] },
      { id: 'e26', name: 'Snatch', sets: 5, reps: '5', rest: '180s', muscleGroups: ['back', 'shoulders'] },
      { id: 'e27', name: 'Front Squat', sets: 4, reps: '6', rest: '120s', muscleGroups: ['quads', 'core'] },
      { id: 'e28', name: 'Overhead Press', sets: 4, reps: '8', rest: '90s', muscleGroups: ['shoulders', 'triceps'] }
    ]
  },
  {
    id: '7',
    title: 'Yoga & Movilidad',
    description: 'Sesión de movilidad y flexibilidad para mejorar tu rango de movimiento y prevenir lesiones.',
    duration: '35 min',
    durationMinutes: 35,
    difficulty: 'beginner',
    category: 'Movilidad',
    tier: 'basic',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    completedBy: 3210,
    equipment: ['none'],
    muscleGroups: ['core', 'back', 'hamstrings', 'shoulders'],
    trainerId: 't2',
    exercises: [
      { id: 'e29', name: 'Saludo al Sol', sets: 3, reps: '5 ciclos', rest: '15s', muscleGroups: ['back', 'core'] },
      { id: 'e30', name: 'Guerrero I', sets: 2, reps: '60s c/lado', rest: '15s', muscleGroups: ['quads', 'hamstrings'] },
      { id: 'e31', name: 'Postura del Niño', sets: 3, reps: '45s', rest: '15s', muscleGroups: ['back'] },
      { id: 'e32', name: 'Paloma', sets: 2, reps: '60s c/lado', rest: '15s', muscleGroups: ['glutes', 'hamstrings'] }
    ]
  },
  {
    id: '8',
    title: 'Express 15 Min',
    description: 'Rutina rápida pero efectiva para días en que el tiempo escasea. Sin excusas.',
    duration: '15 min',
    durationMinutes: 15,
    difficulty: 'intermediate',
    category: 'Cardio',
    tier: 'basic',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800',
    completedBy: 4520,
    equipment: ['none'],
    muscleGroups: ['core', 'quads', 'chest'],
    trainerId: 't2',
    exercises: [
      { id: 'e33', name: 'Sentadillas', sets: 3, reps: '20', rest: '20s', muscleGroups: ['quads', 'glutes'] },
      { id: 'e34', name: 'Flexiones', sets: 3, reps: '15', rest: '20s', muscleGroups: ['chest', 'triceps'] },
      { id: 'e35', name: 'Plancha', sets: 3, reps: '30s', rest: '15s', muscleGroups: ['core'] }
    ]
  }
]

export const mockTrainingPlans: TrainingPlan[] = [
  {
    id: 'tp1',
    title: 'Transformación Total 4 Semanas',
    description: 'Programa progresivo diseñado para quemar grasa y ganar definición. Ideal para principiantes que quieren resultados reales.',
    tier: 'basic',
    durationWeeks: 4,
    daysPerWeek: 3,
    goal: 'lose_weight',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    enrolledCount: 2340,
    trainerId: 't2',
    weeks: [
      { week: 1, days: [
        { day: 1, workoutId: '5', label: 'Core & Movilidad', isRest: false },
        { day: 2, workoutId: null, label: 'Descanso', isRest: true },
        { day: 3, workoutId: '8', label: 'Express Cardio', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 6, workoutId: null, label: 'Descanso', isRest: true },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 2, days: [
        { day: 1, workoutId: '1', label: 'Full Body Power', isRest: false },
        { day: 2, workoutId: null, label: 'Descanso', isRest: true },
        { day: 3, workoutId: '5', label: 'Core Stability', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '7', label: 'Yoga & Movilidad', isRest: false },
        { day: 6, workoutId: null, label: 'Descanso activo', isRest: true },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 3, days: [
        { day: 1, workoutId: '5', label: 'Core Intensivo', isRest: false },
        { day: 2, workoutId: '8', label: 'Express HIIT', isRest: false },
        { day: 3, workoutId: null, label: 'Descanso', isRest: true },
        { day: 4, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 5, workoutId: null, label: 'Descanso', isRest: true },
        { day: 6, workoutId: '7', label: 'Movilidad', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 4, days: [
        { day: 1, workoutId: '1', label: 'Full Body Max', isRest: false },
        { day: 2, workoutId: '8', label: 'Cardio Express', isRest: false },
        { day: 3, workoutId: '5', label: 'Core', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '1', label: 'Full Body Final', isRest: false },
        { day: 6, workoutId: null, label: 'Descanso', isRest: true },
        { day: 7, workoutId: '7', label: 'Yoga Final', isRest: false },
      ]},
    ]
  },
  {
    id: 'tp2',
    title: 'Construcción Muscular 6 Semanas',
    description: 'Programa premium de hipertrofia con periodización progresiva. Incluye variantes de cada ejercicio y seguimiento de cargas.',
    tier: 'premium',
    durationWeeks: 6,
    daysPerWeek: 5,
    goal: 'build_muscle',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    enrolledCount: 1128,
    trainerId: 't1',
    weeks: [
      { week: 1, days: [
        { day: 1, workoutId: '3', label: 'Pecho & Espalda', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas', isRest: false },
        { day: 3, workoutId: '5', label: 'Core & Cardio', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 6, workoutId: '7', label: 'Movilidad', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 2, days: [
        { day: 1, workoutId: '1', label: 'Empuje', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas Potencia', isRest: false },
        { day: 3, workoutId: '3', label: 'Tirón', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '2', label: 'HIIT', isRest: false },
        { day: 6, workoutId: '5', label: 'Core', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 3, days: [
        { day: 1, workoutId: '3', label: 'Upper Heavy', isRest: false },
        { day: 2, workoutId: '4', label: 'Leg Day', isRest: false },
        { day: 3, workoutId: '2', label: 'HIIT Cardio', isRest: false },
        { day: 4, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 5, workoutId: null, label: 'Descanso', isRest: true },
        { day: 6, workoutId: '5', label: 'Core', isRest: false },
        { day: 7, workoutId: '7', label: 'Recuperación', isRest: false },
      ]},
      { week: 4, days: [
        { day: 1, workoutId: '1', label: 'Deload Full Body', isRest: false },
        { day: 2, workoutId: null, label: 'Descanso', isRest: true },
        { day: 3, workoutId: '7', label: 'Movilidad', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '5', label: 'Core Ligero', isRest: false },
        { day: 6, workoutId: null, label: 'Descanso', isRest: true },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 5, days: [
        { day: 1, workoutId: '3', label: 'Upper Max', isRest: false },
        { day: 2, workoutId: '4', label: 'Leg Max', isRest: false },
        { day: 3, workoutId: '5', label: 'Core Max', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '1', label: 'Full Body Max', isRest: false },
        { day: 6, workoutId: '2', label: 'HIIT Final', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 6, days: [
        { day: 1, workoutId: '1', label: 'Test Full Body', isRest: false },
        { day: 2, workoutId: '4', label: 'Test Piernas', isRest: false },
        { day: 3, workoutId: '3', label: 'Test Upper', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '2', label: 'HIIT Final', isRest: false },
        { day: 6, workoutId: '7', label: 'Cierre & Movilidad', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
    ]
  },
  {
    id: 'tp3',
    title: 'Elite Strength 8 Semanas',
    description: 'Programa exclusivo VIP con periodización olímpica. Consultas semanales con el entrenador y ajustes personalizados.',
    tier: 'vip',
    durationWeeks: 8,
    daysPerWeek: 6,
    goal: 'increase_strength',
    level: 'advanced',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
    enrolledCount: 234,
    trainerId: 't1',
    weeks: [
      { week: 1, days: [
        { day: 1, workoutId: '6', label: 'Técnica Olímpica', isRest: false },
        { day: 2, workoutId: '1', label: 'Full Body Pesado', isRest: false },
        { day: 3, workoutId: '5', label: 'Core Estabilidad', isRest: false },
        { day: 4, workoutId: '4', label: 'Piernas Potencia', isRest: false },
        { day: 5, workoutId: '3', label: 'Upper Fuerza', isRest: false },
        { day: 6, workoutId: '7', label: 'Recuperación Activa', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 2, days: [
        { day: 1, workoutId: '6', label: 'Olímpico +5%', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas', isRest: false },
        { day: 3, workoutId: '3', label: 'Upper', isRest: false },
        { day: 4, workoutId: '5', label: 'Core', isRest: false },
        { day: 5, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 6, workoutId: '7', label: 'Movilidad', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 3, days: [
        { day: 1, workoutId: '6', label: 'Olímpico Intenso', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas Heavy', isRest: false },
        { day: 3, workoutId: '3', label: 'Upper Heavy', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '1', label: 'Full Body PR', isRest: false },
        { day: 6, workoutId: '5', label: 'Core', isRest: false },
        { day: 7, workoutId: '7', label: 'Recovery', isRest: false },
      ]},
      { week: 4, days: [
        { day: 1, workoutId: '7', label: 'Deload Movilidad', isRest: false },
        { day: 2, workoutId: '5', label: 'Core Ligero', isRest: false },
        { day: 3, workoutId: null, label: 'Descanso', isRest: true },
        { day: 4, workoutId: '7', label: 'Yoga', isRest: false },
        { day: 5, workoutId: null, label: 'Descanso', isRest: true },
        { day: 6, workoutId: '8', label: 'Express', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 5, days: [
        { day: 1, workoutId: '6', label: 'Olímpico Max', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas Max', isRest: false },
        { day: 3, workoutId: '3', label: 'Upper Max', isRest: false },
        { day: 4, workoutId: '5', label: 'Core', isRest: false },
        { day: 5, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 6, workoutId: '7', label: 'Movilidad', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 6, days: [
        { day: 1, workoutId: '6', label: 'Técnica Avanzada', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas PR', isRest: false },
        { day: 3, workoutId: '3', label: 'Upper PR', isRest: false },
        { day: 4, workoutId: null, label: 'Descanso', isRest: true },
        { day: 5, workoutId: '1', label: 'Full Body PR', isRest: false },
        { day: 6, workoutId: '5', label: 'Core', isRest: false },
        { day: 7, workoutId: '7', label: 'Recovery', isRest: false },
      ]},
      { week: 7, days: [
        { day: 1, workoutId: '6', label: 'Peak Week', isRest: false },
        { day: 2, workoutId: '4', label: 'Piernas Peak', isRest: false },
        { day: 3, workoutId: '3', label: 'Upper Peak', isRest: false },
        { day: 4, workoutId: '5', label: 'Core', isRest: false },
        { day: 5, workoutId: '1', label: 'Full Body', isRest: false },
        { day: 6, workoutId: '7', label: 'Movilidad', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
      { week: 8, days: [
        { day: 1, workoutId: '6', label: 'Test Final Olímpico', isRest: false },
        { day: 2, workoutId: '4', label: 'Test Piernas', isRest: false },
        { day: 3, workoutId: null, label: 'Descanso', isRest: true },
        { day: 4, workoutId: '3', label: 'Test Upper', isRest: false },
        { day: 5, workoutId: null, label: 'Descanso', isRest: true },
        { day: 6, workoutId: '7', label: 'Celebración & Cierre', isRest: false },
        { day: 7, workoutId: null, label: 'Descanso', isRest: true },
      ]},
    ]
  }
]

export const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    title: 'Plan Déficit Calórico',
    description: 'Plan diseñado para pérdida de grasa manteniendo masa muscular.',
    tier: 'basic',
    calories: 1800,
    meals: {
      breakfast: { id: 'm1', name: 'Bowl de Avena Proteica', calories: 420, protein: 30, carbs: 55, fats: 10, image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400', ingredients: ['80g avena', '1 scoop proteína', '150ml leche', 'Frutas del bosque', 'Canela'], instructions: ['Cocina la avena con la leche', 'Añade la proteína mezclando bien', 'Decora con frutas'] },
      lunch: { id: 'm2', name: 'Pollo a la Plancha con Quinoa', calories: 520, protein: 45, carbs: 40, fats: 15, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', ingredients: ['200g pechuga', '100g quinoa', 'Verduras mixtas', 'Limón', 'Especias'], instructions: ['Cocina la quinoa', 'Sazona y cocina el pollo', 'Saltea las verduras'] },
      dinner: { id: 'm3', name: 'Salmón con Espárragos', calories: 480, protein: 40, carbs: 15, fats: 28, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', ingredients: ['180g salmón', '200g espárragos', 'Ajo', 'Aceite de oliva', 'Limón'], instructions: ['Hornea el salmón a 180°C', 'Saltea los espárragos con ajo', 'Sirve con limón'] },
      snacks: [{ id: 'm4', name: 'Yogur Griego con Nueces', calories: 200, protein: 15, carbs: 12, fats: 10, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', ingredients: ['200g yogur griego', '20g nueces', 'Miel'], instructions: ['Mezcla todo y disfruta'] }]
    }
  },
  {
    id: '2',
    title: 'Plan Ganancia Muscular',
    description: 'Alto en proteínas y calorías para maximizar el crecimiento muscular.',
    tier: 'premium',
    calories: 2800,
    meals: {
      breakfast: { id: 'm5', name: 'Tortilla de Claras con Tostadas', calories: 580, protein: 45, carbs: 60, fats: 15, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', ingredients: ['8 claras', '2 huevos enteros', 'Pan integral', 'Aguacate', 'Tomate'], instructions: ['Prepara la tortilla', 'Tuesta el pan', 'Añade aguacate y tomate'] },
      lunch: { id: 'm6', name: 'Arroz con Ternera y Verduras', calories: 780, protein: 55, carbs: 80, fats: 22, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', ingredients: ['250g ternera magra', '150g arroz', 'Brócoli', 'Zanahorias', 'Salsa de soja'], instructions: ['Cocina el arroz', 'Saltea la ternera', 'Añade las verduras'] },
      dinner: { id: 'm7', name: 'Pasta Boloñesa Proteica', calories: 720, protein: 50, carbs: 75, fats: 20, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', ingredients: ['150g pasta integral', '200g carne picada', 'Tomate natural', 'Cebolla', 'Ajo'], instructions: ['Cocina la pasta', 'Prepara la salsa boloñesa', 'Mezcla y sirve'] },
      snacks: [{ id: 'm8', name: 'Batido Post-Entreno', calories: 450, protein: 40, carbs: 50, fats: 8, image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400', ingredients: ['2 scoops proteína', '1 plátano', '50g avena', 'Leche'], instructions: ['Bate todos los ingredientes'] }]
    }
  },
  {
    id: '3',
    title: 'Plan VIP Personalizado',
    description: 'Plan completamente personalizado con ajustes semanales según tu progreso.',
    tier: 'vip',
    calories: 2400,
    meals: {
      breakfast: { id: 'm9', name: 'Bowl Mediterráneo Premium', calories: 550, protein: 35, carbs: 45, fats: 25, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', ingredients: ['Huevos poché', 'Hummus casero', 'Tomate cherry', 'Aguacate', 'Pan artesanal'], instructions: ['Prepara los huevos poché', 'Monta el bowl con todos los ingredientes'] },
      lunch: { id: 'm10', name: 'Atún Sellado con Ensalada', calories: 620, protein: 50, carbs: 25, fats: 35, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', ingredients: ['200g atún fresco', 'Mix de lechugas', 'Sésamo', 'Jengibre', 'Salsa ponzu'], instructions: ['Sella el atún por ambos lados', 'Prepara la ensalada', 'Sirve con salsa'] },
      dinner: { id: 'm11', name: 'Pechuga Rellena con Verduras', calories: 580, protein: 55, carbs: 20, fats: 30, image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400', ingredients: ['220g pechuga', 'Espinacas', 'Queso feta', 'Tomates asados', 'Hierbas frescas'], instructions: ['Rellena la pechuga', 'Hornea a 180°C por 25min', 'Acompaña con verduras'] },
      snacks: [{ id: 'm12', name: 'Mix Energético Premium', calories: 280, protein: 12, carbs: 25, fats: 18, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400', ingredients: ['Almendras', 'Nueces de macadamia', 'Chocolate negro 85%', 'Arándanos'], instructions: ['Mezcla y divide en porciones'] }]
    }
  }
]

export const mockPricingPlans: PricingPlan[] = [
  {
    tier: 'basic',
    name: 'Básico',
    price: 19,
    description: 'Perfecto para comenzar tu transformación',
    features: ['Acceso a entrenamientos básicos', 'Planes de nutrición estándar', 'Seguimiento de progreso', 'Planes de entrenamiento 4 semanas', 'Soporte por email']
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: 39,
    description: 'Para quienes buscan resultados serios',
    features: ['Todo lo del plan Básico', 'Entrenamientos avanzados', 'Planes de nutrición personalizados', 'Programas 6 semanas', 'Análisis detallado de progreso', 'Videos HD', 'Soporte prioritario'],
    popular: true
  },
  {
    tier: 'vip',
    name: 'VIP',
    price: 79,
    description: 'La experiencia completa de élite',
    features: ['Todo lo del plan Premium', 'Programa Elite 8 semanas', 'Consultas 1-a-1 con entrenador', 'Plan de nutrición personalizado', 'Acceso anticipado a contenido', 'Soporte 24/7']
  }
]

export const mockProgressData: ProgressEntry[] = [
  { id: '1', date: '2024-01-01', weight: 85, bodyFat: 22, measurements: { chest: 102, waist: 88, arms: 35 } },
  { id: '2', date: '2024-01-15', weight: 84, bodyFat: 21, measurements: { chest: 103, waist: 86, arms: 35.5 } },
  { id: '3', date: '2024-02-01', weight: 83, bodyFat: 20, measurements: { chest: 104, waist: 84, arms: 36 } },
  { id: '4', date: '2024-02-15', weight: 82, bodyFat: 19, measurements: { chest: 104, waist: 82, arms: 36.5 } },
  { id: '5', date: '2024-03-01', weight: 81, bodyFat: 18, measurements: { chest: 105, waist: 80, arms: 37 } },
  { id: '6', date: '2024-03-15', weight: 80, bodyFat: 17, measurements: { chest: 106, waist: 78, arms: 37.5 } }
]

export const mockBadges: Badge[] = [
  { id: 'b1', name: 'Primera Chispa', description: 'Completa tu primer entrenamiento', icon: '⚡', category: 'milestone', locked: false, unlockedAt: '2024-01-10', requirement: '1 entrenamiento completado' },
  { id: 'b2', name: 'Semana de Fuego', description: '7 días seguidos entrenando', icon: '🔥', category: 'consistency', locked: false, unlockedAt: '2024-01-17', requirement: '7 días de racha' },
  { id: 'b3', name: 'Guerrero del Mes', description: '30 días de racha consecutiva', icon: '🏆', category: 'consistency', locked: true, requirement: '30 días de racha' },
  { id: 'b4', name: 'Veterano', description: '100 entrenamientos completados', icon: '💪', category: 'milestone', locked: true, requirement: '100 entrenamientos' },
  { id: 'b5', name: 'Quema Calorías', description: 'Completa 10 sesiones de cardio', icon: '🏃', category: 'performance', locked: false, unlockedAt: '2024-02-05', requirement: '10 sesiones cardio' },
  { id: 'b6', name: 'Rey del Core', description: 'Completa 20 entrenamientos de core', icon: '🎯', category: 'performance', locked: true, requirement: '20 workouts core' },
  { id: 'b7', name: 'Madrugador', description: 'Entrena antes de las 7am por 5 días', icon: '🌅', category: 'special', locked: true, requirement: '5 entrenamientos antes de 7am' },
  { id: 'b8', name: 'Constancia de Acero', description: '60 días de racha consecutiva', icon: '🦾', category: 'consistency', locked: true, requirement: '60 días de racha' },
  { id: 'b9', name: 'Explorador', description: 'Prueba 5 categorías distintas', icon: '🗺️', category: 'special', locked: false, unlockedAt: '2024-02-20', requirement: '5 categorías distintas' },
  { id: 'b10', name: 'Leyenda', description: '365 días de racha consecutiva', icon: '👑', category: 'consistency', locked: true, requirement: '365 días de racha' },
]

export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Reto de Mayo: 20 Entrenamientos',
    description: 'Completa 20 entrenamientos durante el mes de mayo y desbloquea una badge exclusiva.',
    goal: 20,
    current: 8,
    unit: 'entrenamientos',
    endsAt: '2026-05-31T23:59:59Z',
    reward: '🏅 Badge Guerrero de Mayo',
    tier: 'basic',
    participants: 1240
  },
  {
    id: 'c2',
    title: 'Semana del Core',
    description: 'Completa 5 entrenamientos de core esta semana.',
    goal: 5,
    current: 2,
    unit: 'workouts core',
    endsAt: '2026-05-11T23:59:59Z',
    reward: '⭐ 500 puntos extra',
    tier: 'basic',
    participants: 856
  },
  {
    id: 'c3',
    title: 'Desafío Premium: Quema 5000 calorías',
    description: 'Registra 5000 calorías quemadas este mes. Solo para miembros Premium.',
    goal: 5000,
    current: 1850,
    unit: 'kcal',
    endsAt: '2026-05-31T23:59:59Z',
    reward: '💎 1500 puntos + Badge Exclusivo',
    tier: 'premium',
    participants: 432
  }
]

export const mockNotifications: AppNotification[] = [
  { id: 'n1', type: 'achievement', title: '¡Badge desbloqueado!', message: 'Has ganado el badge "Quema Calorías". ¡Sigue así!', createdAt: '2026-05-04T10:30:00Z', read: false, actionUrl: '/profile' },
  { id: 'n2', type: 'streak', title: '¡Racha de 8 días!', message: 'Llevas 8 días consecutivos entrenando. ¡No lo detengas!', createdAt: '2026-05-04T08:00:00Z', read: false },
  { id: 'n3', type: 'challenge', title: 'Reto en progreso', message: 'Llevas 8/20 entrenamientos del Reto de Mayo. ¡Vas bien!', createdAt: '2026-05-03T09:00:00Z', read: true, actionUrl: '/dashboard' },
  { id: 'n4', type: 'recommendation', title: 'Entrenamiento recomendado', message: 'Basado en tu historial, prueba "Core Stability Pro" hoy.', createdAt: '2026-05-02T07:00:00Z', read: true, actionUrl: '/workouts/5' },
  { id: 'n5', type: 'system', title: 'Nuevo plan disponible', message: 'El plan "Elite Strength 8 Semanas" ya está disponible para miembros VIP.', createdAt: '2026-05-01T12:00:00Z', read: true, actionUrl: '/training-plans' },
]

export function generateActivityDays(): ActivityDay[] {
  const days: ActivityDay[] = []
  const today = new Date()
  for (let i = 179; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const rand = Math.random()
    let count = 0
    if (!isWeekend) {
      if (rand > 0.35) count = rand > 0.7 ? 2 : 1
    } else {
      if (rand > 0.6) count = 1
    }
    days.push({ date: date.toISOString().split('T')[0], count })
  }
  return days
}

// ── Exercise Library ──────────────────────────────────────────────────────────

export const mockExerciseLibrary: ExerciseLibraryItem[] = [
  // ── FUERZA ──
  {
    id: 'ex-1',
    name: 'Sentadilla con Barra',
    category: 'Fuerza',
    primaryMuscle: 'Cuádriceps',
    muscleGroups: ['quads', 'glutes', 'core'],
    difficulty: 'intermediate',
    equipment: ['Barra', 'Rack'],
    description: 'El ejercicio rey del tren inferior. Desarrolla fuerza y masa muscular en cuádriceps y glúteos mientras trabaja el core como estabilizador.',
    steps: [
      'Coloca la barra sobre los trapecios, no en el cuello',
      'Pies a la anchura de hombros, punteras ligeramente hacia fuera',
      'Inspira, braza el core y desciende controlando las rodillas',
      'Baja hasta que los muslos estén paralelos al suelo o más abajo',
      'Empuja desde los talones para subir y espira al finalizar',
    ],
    tips: [
      'Mantén el pecho arriba en todo momento',
      'Las rodillas siguen la dirección de los pies',
      'Controla el descenso —no lo bajes libre',
    ],
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800',
  },
  {
    id: 'ex-2',
    name: 'Peso Muerto',
    category: 'Fuerza',
    primaryMuscle: 'Espalda baja',
    muscleGroups: ['back', 'hamstrings', 'glutes', 'core'],
    difficulty: 'advanced',
    equipment: ['Barra', 'Discos'],
    description: 'Ejercicio compuesto que recluta casi todos los músculos del cuerpo. Fundamental para desarrollar fuerza total y potencia de cadena posterior.',
    steps: [
      'Barra a la mitad del pie, agarre a la anchura de hombros',
      'Caderas arriba, espalda plana y pecho erguido antes de tirar',
      'Empuja el suelo e inicia el movimiento con las piernas',
      'Mantén la barra rozando el cuerpo durante todo el ascenso',
      'Bloquea caderas y rodillas arriba sin hiperextender',
    ],
    tips: [
      'Nunca redondees la zona lumbar',
      'La barra debe rozar casi las espinillas en el ascenso',
      'Respira hondo y crea presión abdominal antes de cada rep',
    ],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
  },
  {
    id: 'ex-3',
    name: 'Press de Banca',
    category: 'Fuerza',
    primaryMuscle: 'Pecho',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    difficulty: 'intermediate',
    equipment: ['Barra', 'Banco'],
    description: 'El movimiento de empuje horizontal más clásico. Desarrolla masa y fuerza en el pecho con participación activa de tríceps y deltoides anteriores.',
    steps: [
      'Agarre ligeramente más ancho que los hombros, pulgares enganchando la barra',
      'Pies en el suelo, glúteos y espalda superior apoyados en el banco',
      'Baja la barra de forma controlada hasta rozar el pecho',
      'Empuja hacia arriba y ligeramente hacia atrás hasta bloquear los codos',
      'Mantén los hombros retraídos y deprimidos durante todo el movimiento',
    ],
    tips: [
      'No rebotar la barra en el pecho',
      'Los codos a 45-75° del tronco, no en ángulo recto',
      'Arco lumbar natural, no exagerado',
    ],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  {
    id: 'ex-4',
    name: 'Press Militar',
    category: 'Fuerza',
    primaryMuscle: 'Hombros',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    difficulty: 'intermediate',
    equipment: ['Barra'],
    description: 'El press de hombros con barra desarrolla masa y fuerza en los deltoides. Trabaja el core como estabilizador durante el movimiento vertical.',
    steps: [
      'Barra a la altura de las clavículas, agarre a la anchura de hombros',
      'Core apretado y glúteos contraídos para no hiperlordosar la lumbar',
      'Empuja la barra en línea recta sobre la cabeza',
      'Al pasar la cabeza, mete el cuerpo bajo la barra',
      'Bloquea los codos arriba y baja de forma controlada',
    ],
    tips: [
      'No usar las piernas para impulsar (si no es push press)',
      'Mantén las muñecas neutras, no las flexiones',
      'El recorrido debe ser perfectamente vertical',
    ],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
  },
  {
    id: 'ex-5',
    name: 'Remo con Barra',
    category: 'Fuerza',
    primaryMuscle: 'Espalda',
    muscleGroups: ['back', 'biceps', 'core'],
    difficulty: 'intermediate',
    equipment: ['Barra'],
    description: 'Ejercicio de tracción horizontal que desarrolla la anchura y el grosor de la espalda. Imprescindible para el equilibrio muscular y la postura.',
    steps: [
      'Inclínate hacia adelante unos 45°, espalda plana y rodillas ligeramente flexionadas',
      'Agarra la barra con pronación, manos a la anchura de hombros',
      'Tira de la barra hacia el ombligo llevando los codos hacia atrás',
      'Aprieta los omóplatos en el punto de máxima contracción',
      'Baja lentamente hasta estirar completamente los brazos',
    ],
    tips: [
      'No usar impulso lumbar para subir la barra',
      'El codo lidera el movimiento, no la mano',
      'Mantén la cabeza en posición neutra',
    ],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  {
    id: 'ex-6',
    name: 'Curl de Bíceps',
    category: 'Fuerza',
    primaryMuscle: 'Bíceps',
    muscleGroups: ['biceps'],
    difficulty: 'beginner',
    equipment: ['Mancuernas'],
    description: 'Ejercicio de aislamiento para el bíceps braquial. Desarrolla el pico y el volumen del brazo de forma directa y controlada.',
    steps: [
      'De pie, mancuernas colgando a los lados con agarre neutro',
      'Codos pegados al cuerpo durante todo el movimiento',
      'Sube las mancuernas girando la muñeca hacia arriba (supinación)',
      'Aprieta el bíceps en la parte superior del recorrido',
      'Baja lentamente (3-4 segundos) para maximizar el estímulo',
    ],
    tips: [
      'No balancear el tronco para impulsar',
      'Controla siempre la bajada, no la dejes caer',
      'El codo no debe moverse hacia adelante al subir',
    ],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
  },
  {
    id: 'ex-7',
    name: 'Hip Thrust',
    category: 'Fuerza',
    primaryMuscle: 'Glúteos',
    muscleGroups: ['glutes', 'hamstrings', 'core'],
    difficulty: 'intermediate',
    equipment: ['Banco', 'Barra'],
    description: 'El ejercicio más efectivo para activar y desarrollar los glúteos. Recluta el glúteo mayor con mayor eficacia que cualquier variante de sentadilla.',
    steps: [
      'Apoya los omóplatos en el borde de un banco resistente',
      'Coloca la barra sobre las caderas con un pad para amortiguar',
      'Pies a la anchura de caderas, rodillas a 90° cuando las caderas estén arriba',
      'Empuja la barra hacia el techo apretando los glúteos con fuerza',
      'Mantén 1 segundo arriba y baja controlando hasta casi tocar el suelo',
    ],
    tips: [
      'Las rodillas no deben juntarse al subir',
      'Caderas completamente extendidas arriba, sin hiperlordosis',
      'Fija la mirada al frente, no hacia el techo',
    ],
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800',
  },
  {
    id: 'ex-8',
    name: 'Dominadas',
    category: 'Fuerza',
    primaryMuscle: 'Espalda',
    muscleGroups: ['back', 'biceps', 'core'],
    difficulty: 'intermediate',
    equipment: ['Barra de dominadas'],
    description: 'El ejercicio de tracción vertical por excelencia. Desarrolla el dorsal ancho y los bíceps usando el propio peso corporal.',
    steps: [
      'Agarre supino (chin-up) o prono (pull-up), manos a la anchura de hombros',
      'Cuelga con los brazos completamente extendidos y hombros activos',
      'Tira de los codos hacia las caderas llevando el pecho hacia la barra',
      'Sube hasta que la barbilla supere la barra',
      'Baja de forma controlada hasta la extensión completa',
    ],
    tips: [
      'Retrae los omóplatos antes de iniciar el jalón',
      'No usar impulso de cadera para subir',
      'El core debe estar activado en todo momento',
    ],
    image: 'https://images.unsplash.com/photo-1598971639058-a4040ba22bec?w=800',
  },
  {
    id: 'ex-9',
    name: 'Fondos en Paralelas',
    category: 'Fuerza',
    primaryMuscle: 'Pecho / Tríceps',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    difficulty: 'intermediate',
    equipment: ['Paralelas'],
    description: 'Ejercicio de empuje vertical que desarrolla pecho inferior y tríceps con el propio peso. La inclinación del tronco decide el foco muscular.',
    steps: [
      'Sube a las paralelas y bloquea los codos con el cuerpo recto',
      'Para más pecho: inclínate hacia adelante; para más tríceps: permanece vertical',
      'Baja controlando hasta que los hombros estén a la altura de los codos',
      'Empuja hasta bloquear sin hiperextender el codo',
      'Mantén el core activado para no balancearte',
    ],
    tips: [
      'No bajes más de 90° para proteger el hombro',
      'Progresión: asistido → peso corporal → lastrado',
      'Hombros hacia atrás y abajo durante todo el movimiento',
    ],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  {
    id: 'ex-10',
    name: 'Zancada con Mancuernas',
    category: 'Fuerza',
    primaryMuscle: 'Cuádriceps',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'beginner',
    equipment: ['Mancuernas'],
    description: 'Ejercicio unilateral que desarrolla fuerza y estabilidad en piernas y caderas. Corrige desequilibrios entre los dos lados del cuerpo de forma efectiva.',
    steps: [
      'De pie con las mancuernas colgando a los lados',
      'Da un paso largo hacia adelante con una pierna',
      'Baja la rodilla trasera hacia el suelo de forma controlada',
      'Mantén el tronco erguido y el peso sobre el talón delantero',
      'Empuja desde el pie delantero para volver a la posición inicial',
    ],
    tips: [
      'La rodilla delantera no sobrepase los dedos del pie',
      'Paso amplio para mayor activación de glúteos',
      'Mantén el torso recto, no te inclines hacia adelante',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  },

  // ── CORE ──
  {
    id: 'ex-11',
    name: 'Plancha',
    category: 'Core',
    primaryMuscle: 'Core',
    muscleGroups: ['core', 'shoulders'],
    difficulty: 'beginner',
    equipment: ['Ninguno'],
    description: 'Ejercicio isométrico fundamental para desarrollar la estabilidad del core y resistencia muscular. Base de cualquier programa de entrenamiento funcional.',
    steps: [
      'Apoya antebrazos y puntas de los pies en el suelo',
      'Cuerpo en línea recta de cabeza a talones, sin caer la cadera',
      'Activa el core como si fueras a recibir un golpe en el abdomen',
      'Mantén la posición respirando de forma controlada',
      'No dejes que las caderas suban ni bajen durante la serie',
    ],
    tips: [
      'Aprieta glúteos para evitar que la cadera caiga',
      'Mira al suelo, no hacia adelante',
      'Progresa aumentando el tiempo, no sacrificando la forma',
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
  },
  {
    id: 'ex-12',
    name: 'Dead Bug',
    category: 'Core',
    primaryMuscle: 'Core profundo',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    equipment: ['Ninguno'],
    description: 'Activa el transverso abdominal sin carga lumbar. Ideal para principiantes y para complementar cualquier programa de fuerza avanzado.',
    steps: [
      'Tumbado boca arriba, brazos perpendiculares al suelo y rodillas a 90°',
      'Presiona la zona lumbar firmemente contra el suelo durante todo el ejercicio',
      'Extiende simultáneamente el brazo derecho y la pierna izquierda',
      'Vuelve al centro sin que la lumbar se separe del suelo',
      'Alterna lados de forma lenta y controlada',
    ],
    tips: [
      'La lumbar NUNCA debe despegarse del suelo',
      'Exhala al extender, inhala al regresar',
      'Movimiento lento —la velocidad no importa aquí',
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
  },
  {
    id: 'ex-13',
    name: 'Crunch Inverso',
    category: 'Core',
    primaryMuscle: 'Abdomen inferior',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    equipment: ['Ninguno'],
    description: 'Variante del crunch que focaliza el trabajo en la parte inferior del recto abdominal, reduciendo la tensión en el cuello.',
    steps: [
      'Tumbado boca arriba, piernas levantadas y rodillas a 90°',
      'Manos bajo los glúteos para proteger la lumbar',
      'Lleva las rodillas hacia el pecho elevando ligeramente la cadera del suelo',
      'Contrae el abdomen en la parte superior del movimiento',
      'Baja lentamente sin que los pies toquen el suelo al final',
    ],
    tips: [
      'El movimiento viene del abdomen, no del impulso',
      'Exhala al subir las caderas',
      'No dejes caer las piernas en la bajada',
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
  },
  {
    id: 'ex-14',
    name: 'Russian Twist',
    category: 'Core',
    primaryMuscle: 'Oblicuos',
    muscleGroups: ['core'],
    difficulty: 'intermediate',
    equipment: ['Ninguno / Disco'],
    description: 'Ejercicio rotacional que desarrolla los oblicuos y mejora la estabilidad rotacional del tronco. Se puede progresar añadiendo peso externo.',
    steps: [
      'Sentado en el suelo con las rodillas flexionadas y pies ligeramente elevados',
      'Inclínate hacia atrás unos 45° manteniendo la espalda recta',
      'Manos juntas frente al pecho o sosteniendo un disco',
      'Gira el tronco de lado a lado tocando el suelo a cada lado',
      'Mantén el core contraído durante todo el movimiento',
    ],
    tips: [
      'El movimiento viene del tronco, no solo de los brazos',
      'Mantén los pies elevados para mayor dificultad',
      'Respira de forma controlada en cada rotación',
    ],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
  },
  {
    id: 'ex-15',
    name: 'Bird Dog',
    category: 'Core',
    primaryMuscle: 'Core / Espalda',
    muscleGroups: ['core', 'back'],
    difficulty: 'beginner',
    equipment: ['Ninguno'],
    description: 'Ejercicio de estabilidad que activa el core y los erectores espinales. Mejora el control lumbo-pélvico y la coordinación neuromuscular.',
    steps: [
      'A cuatro patas, rodillas bajo las caderas y muñecas bajo los hombros',
      'Extiende simultáneamente el brazo derecho y la pierna izquierda',
      'Mantén la posición 2-3 segundos apretando glúteo y core',
      'Vuelve al centro sin que las caderas roten',
      'Alterna lados de forma controlada',
    ],
    tips: [
      'No dejes caer la cadera hacia un lado al extender la pierna',
      'La cabeza en posición neutra, mirando al suelo',
      'Imagina que tienes un vaso de agua en la espalda',
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
  },

  // ── CARDIO ──
  {
    id: 'ex-16',
    name: 'Burpees',
    category: 'Cardio',
    primaryMuscle: 'Cuerpo completo',
    muscleGroups: ['chest', 'core', 'quads', 'glutes'],
    difficulty: 'advanced',
    equipment: ['Ninguno'],
    description: 'Ejercicio de cuerpo completo que combina fuerza y cardio. Quema calorías de forma eficiente y mejora la condición cardiovascular en poco tiempo.',
    steps: [
      'De pie, baja en sentadilla y apoya las manos en el suelo',
      'Salta o camina los pies hacia atrás hasta quedar en posición de plancha',
      'Realiza una flexión (opcional para nivel básico)',
      'Salta o camina los pies hacia las manos',
      'Salta hacia arriba con los brazos extendidos sobre la cabeza',
    ],
    tips: [
      'Mantén el core activado en la posición de plancha',
      'Aterriza suavemente con rodillas ligeramente flexionadas',
      'Controla el ritmo —mejor lento con buena técnica que rápido mal',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  },
  {
    id: 'ex-17',
    name: 'High Knees',
    category: 'Cardio',
    primaryMuscle: 'Cuádriceps / Core',
    muscleGroups: ['quads', 'core'],
    difficulty: 'beginner',
    equipment: ['Ninguno'],
    description: 'Ejercicio cardiovascular que eleva la frecuencia cardíaca rápidamente. Mejora la coordinación y trabaja el core de forma dinámica y funcional.',
    steps: [
      'De pie con los pies a la anchura de caderas',
      'Corre en el sitio elevando las rodillas hasta la altura de la cadera',
      'Los brazos se mueven de forma opuesta a las piernas',
      'Mantén el core apretado y el pecho erguido',
      'Pisa con la parte delantera del pie para mayor explosividad',
    ],
    tips: [
      'Las rodillas deben llegar al menos a la altura de las caderas',
      'Mantén un ritmo constante antes de acelerar',
      'Coordina la respiración con el movimiento',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  },
  {
    id: 'ex-18',
    name: 'Mountain Climbers',
    category: 'Cardio',
    primaryMuscle: 'Core / Hombros',
    muscleGroups: ['core', 'shoulders', 'quads'],
    difficulty: 'intermediate',
    equipment: ['Ninguno'],
    description: 'Combina la posición de plancha con movimiento dinámico de piernas. Activa core y hombros mientras eleva la frecuencia cardíaca de forma eficiente.',
    steps: [
      'Posición de plancha alta con brazos extendidos, manos bajo los hombros',
      'Lleva la rodilla derecha hacia el pecho de forma explosiva',
      'Vuelve al punto inicial y lleva la rodilla izquierda',
      'Alterna piernas rápidamente manteniendo las caderas bajas',
      'Mantén el core activado y no dejes que las caderas suban',
    ],
    tips: [
      'Caderas bajas y alineadas durante todo el movimiento',
      'Respira de forma continua, no aguantes la respiración',
      'Empieza lento para dominar la técnica antes de acelerar',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  },

  // ── PLIOMETRÍA ──
  {
    id: 'ex-19',
    name: 'Jump Squat',
    category: 'Pliometría',
    primaryMuscle: 'Cuádriceps / Glúteos',
    muscleGroups: ['quads', 'glutes', 'calves'],
    difficulty: 'intermediate',
    equipment: ['Ninguno'],
    description: 'Variante explosiva de la sentadilla que desarrolla potencia en el tren inferior. Mejora la capacidad de salto y la potencia muscular global.',
    steps: [
      'Pies a la anchura de hombros en posición de sentadilla',
      'Baja hasta que los muslos estén paralelos al suelo',
      'Desde el punto más bajo, empuja de forma explosiva hacia arriba',
      'Salta tan alto como puedas extendiendo completamente las caderas',
      'Aterriza suavemente con rodillas flexionadas para absorber el impacto',
    ],
    tips: [
      'Aterriza siempre con rodillas flexionadas —nunca rígidas',
      'El impulso viene de las caderas, no solo de las rodillas',
      'Reduce el volumen si notas impacto excesivo en las articulaciones',
    ],
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
  },
  {
    id: 'ex-20',
    name: 'Box Jump',
    category: 'Pliometría',
    primaryMuscle: 'Cuádriceps / Glúteos',
    muscleGroups: ['quads', 'glutes', 'calves'],
    difficulty: 'intermediate',
    equipment: ['Cajón pliométrico'],
    description: 'Ejercicio pliométrico que desarrolla la potencia explosiva del tren inferior. El cajón añade un objetivo concreto y mejora la coordinación en el salto.',
    steps: [
      'De pie frente al cajón a unos 30-40 cm de distancia',
      'Dobla ligeramente las rodillas y balancea los brazos hacia atrás',
      'Salta de forma explosiva llevando los brazos hacia arriba',
      'Aterriza sobre el cajón con ambos pies al mismo tiempo, rodillas flexionadas',
      'Baja controlado al suelo para la siguiente repetición',
    ],
    tips: [
      'Empieza con un cajón de altura moderada y progresa',
      'Aterriza en el centro del cajón, no en el borde',
      'Pausa completa entre repeticiones para máxima potencia',
    ],
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
  },
  {
    id: 'ex-21',
    name: 'Zancada con Salto',
    category: 'Pliometría',
    primaryMuscle: 'Cuádriceps / Glúteos',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'advanced',
    equipment: ['Ninguno'],
    description: 'Variante explosiva de la zancada que desarrolla potencia unilateral y coordinación. Muy efectiva para el acondicionamiento del tren inferior.',
    steps: [
      'Comienza en posición de zancada con la rodilla trasera cerca del suelo',
      'Salta de forma explosiva hacia arriba con fuerza',
      'En el aire, alterna la posición de las piernas',
      'Aterriza en zancada con la pierna opuesta adelante',
      'Amortigua el aterrizaje doblando las rodillas',
    ],
    tips: [
      'Mantén el tronco erguido durante el salto',
      'Aterriza suavemente para proteger las articulaciones',
      'Domina la zancada estática antes de hacer la versión con salto',
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  },

  // ── FUNCIONAL ──
  {
    id: 'ex-22',
    name: 'Kettlebell Swing',
    category: 'Funcional',
    primaryMuscle: 'Glúteos / Isquiotibiales',
    muscleGroups: ['glutes', 'hamstrings', 'core', 'shoulders'],
    difficulty: 'intermediate',
    equipment: ['Kettlebell'],
    description: 'Movimiento balístico que desarrolla potencia de cadera y fuerza funcional. Quema calorías de forma eficiente trabajando la cadena posterior al completo.',
    steps: [
      'De pie con pies a la anchura de hombros, kettlebell en el suelo entre los pies',
      'Agarra la kettlebell y llévala hacia atrás entre las piernas (hinge de cadera)',
      'Empuja las caderas hacia adelante de forma explosiva para balancear la kettlebell',
      'Deja que suba hasta la altura del pecho con los brazos relajados',
      'Controla el descenso y repite el movimiento de cadera de forma fluida',
    ],
    tips: [
      'Es un movimiento de cadera —no de sentadilla ni de hombros',
      'Aprieta los glúteos con fuerza en la extensión',
      'Los brazos solo guían —la potencia viene de las caderas',
    ],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  {
    id: 'ex-23',
    name: 'TRX Row',
    category: 'Funcional',
    primaryMuscle: 'Espalda / Bíceps',
    muscleGroups: ['back', 'biceps', 'core'],
    difficulty: 'beginner',
    equipment: ['TRX / Anillas'],
    description: 'Ejercicio de tracción con peso corporal usando TRX o anillas. Desarrolla espalda y bíceps con alta transferencia funcional y ajuste progresivo sencillo.',
    steps: [
      'Sujeta las asas del TRX e inclínate hacia atrás (mayor ángulo = más difícil)',
      'Cuerpo rígido y en línea recta, core activo',
      'Tira de las asas hacia el pecho llevando los codos hacia atrás',
      'Aprieta los omóplatos en el punto de máxima contracción',
      'Extiende los brazos lentamente para volver a la posición inicial',
    ],
    tips: [
      'Cuanto más horizontal el cuerpo, más difícil',
      'No dejes que la cadera caiga al bajar',
      'Los codos deben ir pegados al cuerpo, no abiertos',
    ],
    image: 'https://images.unsplash.com/photo-1598971639058-a4040ba22bec?w=800',
  },
  {
    id: 'ex-24',
    name: 'Sentadilla Búlgara',
    category: 'Funcional',
    primaryMuscle: 'Cuádriceps / Glúteos',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'intermediate',
    equipment: ['Banco', 'Mancuernas'],
    description: 'La mejor sentadilla unilateral para fuerza e hipertrofia. Corrige desequilibrios entre piernas y aumenta la activación de glúteos respecto a la sentadilla bilateral.',
    steps: [
      'Apoya el pie trasero en un banco a unos 40 cm de altura',
      'El pie delantero a suficiente distancia para hacer una zancada profunda',
      'Baja controlando la rodilla trasera hacia el suelo',
      'Mantén el tronco erguido y el peso sobre el talón delantero',
      'Empuja desde el pie delantero para subir y repite',
    ],
    tips: [
      'Empieza sin peso hasta dominar el equilibrio',
      'La distancia del pie delantero es clave —prueba hasta encontrar la óptima',
      'Si el cuádriceps se fatiga más que el glúteo, acerca más el pie delantero',
    ],
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800',
  },
]


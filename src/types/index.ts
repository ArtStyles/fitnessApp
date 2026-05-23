export type SubscriptionTier = 'basic' | 'premium' | 'vip'

export type AdminPermission =
  | 'users:view'    | 'users:edit'    | 'users:delete'
  | 'workouts:view' | 'workouts:create' | 'workouts:edit' | 'workouts:delete'
  | 'nutrition:view' | 'nutrition:create' | 'nutrition:edit' | 'nutrition:delete'

export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'improve_endurance' | 'stay_healthy' | 'increase_strength'
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'
export type Equipment = 'none' | 'dumbbells' | 'barbell' | 'gym' | 'resistance_bands' | 'pull_up_bar'

export interface OnboardingProfile {
  goal: FitnessGoal
  level: FitnessLevel
  equipment: Equipment[]
  daysPerWeek: number
  completed: boolean
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription: SubscriptionTier
  role: 'user' | 'admin'
  joinedAt: string
  onboarding?: OnboardingProfile
  stats: {
    workoutsCompleted: number
    streakDays: number
    totalMinutes: number
    currentStreak: number
    longestStreak: number
    points: number
    level: number
  }
}

export interface Exercise {
  id: string           // WorkoutExercise join-table id
  exerciseId?: string  // ExerciseLibrary id (needed for session logs)
  name: string
  sets: number
  reps: string
  rest: string
  restSeconds?: number // raw seconds (avoids parsing "60s")
  videoUrl?: string
  notes?: string
  muscleGroups?: MuscleGroup[]
}

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'core' | 'glutes' | 'quads' | 'hamstrings' | 'calves'

export interface Workout {
  id: string
  title: string
  description: string
  duration: string
  durationMinutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  tier: SubscriptionTier
  image: string
  exercises: Exercise[]
  completedBy: number
  equipment: Equipment[]
  muscleGroups: MuscleGroup[]
  trainerId?: string
}

export interface Trainer {
  id: string
  name: string
  avatar: string
  specialty: string
  bio: string
  workoutsCount: number
}

export interface TrainingPlanDay {
  day: number
  workoutId: string | null
  label: string
  isRest: boolean
}

export interface TrainingPlanWeek {
  week: number
  days: TrainingPlanDay[]
}

export interface TrainingPlan {
  id: string
  title: string
  description: string
  tier: SubscriptionTier
  durationWeeks: number
  daysPerWeek: number
  goal: FitnessGoal
  level: FitnessLevel
  image: string
  weeks: TrainingPlanWeek[]
  enrolledCount: number
  trainerId: string
}

export interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  image: string
  ingredients: string[]
  instructions: string[]
}

export interface MealPlan {
  id: string
  title: string
  description: string
  tier: SubscriptionTier
  calories: number
  meals: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal[]
  }
}

export interface ProgressEntry {
  id: string
  date: string
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  photo?: string
  notes?: string
}

export interface PricingPlan {
  tier: SubscriptionTier
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
}

// Gamification

export type BadgeCategory = 'consistency' | 'performance' | 'milestone' | 'special'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  unlockedAt?: string
  locked: boolean
  requirement: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  goal: number
  current: number
  unit: string
  endsAt: string
  reward: string
  tier: SubscriptionTier
  participants: number
}

export interface AppNotification {
  id: string
  type: 'achievement' | 'streak' | 'challenge' | 'recommendation' | 'system'
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
}

export interface WorkoutSession {
  workoutId: string
  startedAt: string
  currentExerciseIndex: number
  currentSet: number
  completedSets: Record<string, number>
  elapsedSeconds: number
  isResting: boolean
  restSecondsLeft: number
}

export interface ActivityDay {
  date: string
  count: number
}

// Enrollment

export interface EnrolledDayProgress {
  week: number
  day: number
  completedAt: string | null
}

export interface Enrollment {
  id: string
  userId: string
  planId: string
  enrolledAt: string
  currentWeek: number
  currentDay: number
  dayProgress: EnrolledDayProgress[]
  completedAt: string | null
}

// ── Exercise Library ──────────────────────────────────────────────────────────

export type ExerciseCategory = 'Fuerza' | 'Cardio' | 'Core' | 'Pliometría' | 'Funcional'

export interface ExerciseLibraryItem {
  id: string
  name: string
  category: ExerciseCategory
  primaryMuscle: string
  muscleGroups: MuscleGroup[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  equipment: string[]
  description: string
  steps: string[]
  tips: string[]
  image: string
  videoUrl?: string
}

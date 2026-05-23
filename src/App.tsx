import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GamificationProvider } from './context/GamificationContext'
import { EnrollmentProvider } from './context/EnrollmentContext'
import { Toaster } from 'sonner'
import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from './components/ui/error-boundary'

// Layouts (small, always needed — not lazy)
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Route Protection
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

// Public Pages
const LandingPage    = lazy(() => import('./pages/public/LandingPage'))
const LoginPage      = lazy(() => import('./pages/public/LoginPage'))
const RegisterPage   = lazy(() => import('./pages/public/RegisterPage'))
const PricingPage    = lazy(() => import('./pages/public/PricingPage'))
const FeaturesPage   = lazy(() => import('./pages/public/FeaturesPage'))
const AboutPage      = lazy(() => import('./pages/public/AboutPage'))
const OnboardingPage = lazy(() => import('./pages/public/OnboardingPage'))

// Dashboard Pages
const DashboardHome      = lazy(() => import('./pages/dashboard/DashboardHome'))
const WorkoutsPage       = lazy(() => import('./pages/dashboard/WorkoutsPage'))
const WorkoutDetailPage  = lazy(() => import('./pages/dashboard/WorkoutDetailPage'))
const WorkoutTrackerPage = lazy(() => import('./pages/dashboard/WorkoutTrackerPage'))
const WorkoutCompletePage= lazy(() => import('./pages/dashboard/WorkoutCompletePage'))
const NutritionPage      = lazy(() => import('./pages/dashboard/NutritionPage'))
const MealPlanDetailPage = lazy(() => import('./pages/dashboard/MealPlanDetailPage'))
const ProgressPage       = lazy(() => import('./pages/dashboard/ProgressPage'))
const ProfilePage        = lazy(() => import('./pages/dashboard/ProfilePage'))
const TrainingPlansPage  = lazy(() => import('./pages/dashboard/TrainingPlansPage'))
const EnrolledPlanPage   = lazy(() => import('./pages/dashboard/EnrolledPlanPage'))
const ExercisesPage      = lazy(() => import('./pages/dashboard/ExercisesPage'))

// Admin Pages
const AdminDashboard       = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminWorkouts        = lazy(() => import('./pages/admin/AdminWorkouts'))
const AdminTrainingPlans   = lazy(() => import('./pages/admin/AdminTrainingPlans'))
const AdminNutrition       = lazy(() => import('./pages/admin/AdminNutrition'))
const AdminUsers           = lazy(() => import('./pages/admin/AdminUsers'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <EnrollmentProvider>
      <GamificationProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'oklch(0.16 0.02 250)',
              border: '1px solid oklch(0.28 0.02 250)',
              color: 'oklch(0.98 0 0)',
            },
          }}
        />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes (with navbar + footer) */}
              <Route element={<PublicLayout />}>
                <Route path="/"          element={<LandingPage />} />
                <Route path="/pricing"   element={<PricingPage />} />
                <Route path="/features"  element={<FeaturesPage />} />
                <Route path="/about"     element={<AboutPage />} />
              </Route>

              {/* Auth Routes (sin navbar ni footer) */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Onboarding (protected but outside dashboard layout) */}
              <Route path="/onboarding" element={
                <ProtectedRoute><Suspense fallback={<PageLoader />}><OnboardingPage /></Suspense></ProtectedRoute>
              } />

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard"              element={<ErrorBoundary><DashboardHome /></ErrorBoundary>} />
                <Route path="/workouts"               element={<ErrorBoundary><WorkoutsPage /></ErrorBoundary>} />
                <Route path="/exercises"              element={<ErrorBoundary><ExercisesPage /></ErrorBoundary>} />
                <Route path="/workouts/:id"           element={<ErrorBoundary><WorkoutDetailPage /></ErrorBoundary>} />
                <Route path="/workouts/:id/track"     element={<ErrorBoundary><WorkoutTrackerPage /></ErrorBoundary>} />
                <Route path="/workouts/:id/complete"  element={<ErrorBoundary><WorkoutCompletePage /></ErrorBoundary>} />
                <Route path="/training-plans"          element={<ErrorBoundary><TrainingPlansPage /></ErrorBoundary>} />
                <Route path="/training-plans/:planId" element={<ErrorBoundary><EnrolledPlanPage /></ErrorBoundary>} />
                <Route path="/nutrition"              element={<ErrorBoundary><NutritionPage /></ErrorBoundary>} />
                <Route path="/nutrition/:id"          element={<ErrorBoundary><MealPlanDetailPage /></ErrorBoundary>} />
                <Route path="/progress"               element={<ErrorBoundary><ProgressPage /></ErrorBoundary>} />
                <Route path="/profile"                element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route path="/admin"            element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                <Route path="/admin/workouts"         element={<ErrorBoundary><AdminWorkouts /></ErrorBoundary>} />
                <Route path="/admin/training-plans"   element={<ErrorBoundary><AdminTrainingPlans /></ErrorBoundary>} />
                <Route path="/admin/nutrition"  element={<ErrorBoundary><AdminNutrition /></ErrorBoundary>} />
                <Route path="/admin/users"      element={<ErrorBoundary><AdminUsers /></ErrorBoundary>} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </GamificationProvider>
      </EnrollmentProvider>
    </AuthProvider>
  )
}

export default App

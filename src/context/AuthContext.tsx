import {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react'
import type { User, SubscriptionTier, AdminPermission, OnboardingProfile } from '@/src/types'
import {
  apiLogin, apiRegister, apiLogout, apiGetMe, apiSaveOnboarding,
} from '@/src/services/auth.service'
import { tokenStore } from '@/src/lib/api'
import { toast } from 'sonner'

interface AuthContextType {
  user:             User | null
  isAuthenticated:  boolean
  isAdmin:          boolean
  isLoading:        boolean
  login:            (email: string, password: string) => Promise<boolean>
  register:         (name: string, email: string, password: string, tier: SubscriptionTier) => Promise<boolean>
  logout:           () => void
  hasAccess:        (requiredTier: SubscriptionTier) => boolean
  hasPermission:    (permission: AdminPermission) => boolean
  saveOnboarding:   (profile: OnboardingProfile) => Promise<void>
  refreshUser:      () => Promise<void>
  needsOnboarding:  boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const tierLevels: Record<SubscriptionTier, number> = { basic: 1, premium: 2, vip: 3 }

const adminPermissions: AdminPermission[] = [
  'users:view', 'users:edit', 'users:delete',
  'workouts:view', 'workouts:create', 'workouts:edit', 'workouts:delete',
  'nutrition:view', 'nutrition:create', 'nutrition:edit', 'nutrition:delete',
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialized = useRef(false)

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const hasToken = !!tokenStore.get()

    if (!hasToken) {
      setIsLoading(false)
      return
    }

    apiGetMe()
      .then(setUser)
      .catch(() => {
        tokenStore.clear()
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // ── Listen for forced logout from 401 interceptor ────────────────────────
  useEffect(() => {
    const handle = () => { setUser(null); tokenStore.clear() }
    window.addEventListener('auth:logout', handle)
    return () => window.removeEventListener('auth:logout', handle)
  }, [])

  // ── Actions ──────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const u = await apiLogin(email, password)
      setUser(u)
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Credenciales incorrectas'
      toast.error(msg)
      return false
    }
  }, [])

  const register = useCallback(async (
    name: string, email: string, password: string, _tier: SubscriptionTier,
  ): Promise<boolean> => {
    try {
      const u = await apiRegister(name, email, password)
      setUser(u)
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Error al crear la cuenta'
      toast.error(msg)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const u = await apiGetMe()
      setUser(u)
    } catch { /* ignore */ }
  }, [])

  const hasAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    if (!user) return false
    return tierLevels[user.subscription] >= tierLevels[requiredTier]
  }, [user])

  const hasPermission = useCallback((permission: AdminPermission): boolean => {
    if (!user || user.role !== 'admin') return false
    return adminPermissions.includes(permission)
  }, [user])

  const saveOnboarding = useCallback(async (profile: OnboardingProfile) => {
    await apiSaveOnboarding(profile)
    setUser(prev => prev ? { ...prev, onboarding: { ...profile, completed: true } } : prev)
  }, [])

  const needsOnboarding = !!user && !user.onboarding?.completed

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin:         user?.role === 'admin',
      isLoading,
      login,
      register,
      logout,
      hasAccess,
      hasPermission,
      saveOnboarding,
      refreshUser,
      needsOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react'
import type { Badge, Challenge, AppNotification } from '@/src/types'
import {
  fetchGamification, fetchNotifications,
  markNotificationsRead as apiMarkRead,
} from '@/src/services/gamification.service'
import { useAuth } from './AuthContext'

// ── Level table (client-side display only) ────────────────────────────────────

export type UserLevel = {
  level: number; title: string; minPoints: number; maxPoints: number
}

const LEVELS: UserLevel[] = [
  { level: 1,  title: 'Novato',        minPoints: 0,     maxPoints: 499   },
  { level: 2,  title: 'Aprendiz',      minPoints: 500,   maxPoints: 1499  },
  { level: 3,  title: 'Activo',        minPoints: 1500,  maxPoints: 2999  },
  { level: 4,  title: 'Comprometido',  minPoints: 3000,  maxPoints: 4999  },
  { level: 5,  title: 'Dedicado',      minPoints: 5000,  maxPoints: 7999  },
  { level: 6,  title: 'Atleta',        minPoints: 8000,  maxPoints: 11999 },
  { level: 7,  title: 'Élite',         minPoints: 12000, maxPoints: 17999 },
  { level: 8,  title: 'Campeón',       minPoints: 18000, maxPoints: 25999 },
  { level: 9,  title: 'Maestro',       minPoints: 26000, maxPoints: 36999 },
  { level: 10, title: 'Leyenda',       minPoints: 37000, maxPoints: Infinity },
]

export function getLevelInfo(points: number): UserLevel {
  return LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) ?? LEVELS[0]
}

// ── Context type ──────────────────────────────────────────────────────────────

interface GamificationContextType {
  badges:               Badge[]
  challenges:           Challenge[]
  notifications:        AppNotification[]
  unreadCount:          number
  pendingBadge:         Badge | null
  isLoading:            boolean
  markNotificationsRead: () => void
  dismissBadge:         () => void
  getLevelInfo:         (points: number) => UserLevel
  refetch:              () => void
}

const GamificationContext = createContext<GamificationContextType | null>(null)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  const [badges,        setBadges]        = useState<Badge[]>([])
  const [challenges,    setChallenges]    = useState<Challenge[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [pendingBadge,  setPendingBadge]  = useState<Badge | null>(null)
  const [isLoading,     setIsLoading]     = useState(false)

  const load = useCallback(async () => {
    if (!isAuthenticated) return
    setIsLoading(true)
    try {
      const [gami, notifs] = await Promise.all([
        fetchGamification(),
        fetchNotifications(),
      ])
      setBadges(gami.badges)
      setChallenges(gami.challenges)
      setNotifications(notifs)
    } catch { /* ignore if backend is offline */ }
    finally { setIsLoading(false) }
  }, [isAuthenticated])

  useEffect(() => { load() }, [load])

  const unreadCount = notifications.filter(n => !n.read).length

  const markNotificationsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try { await apiMarkRead() } catch { /* ignore */ }
  }, [])

  const dismissBadge = useCallback(() => setPendingBadge(null), [])

  return (
    <GamificationContext.Provider value={{
      badges,
      challenges,
      notifications,
      unreadCount,
      pendingBadge,
      isLoading,
      markNotificationsRead,
      dismissBadge,
      getLevelInfo,
      refetch: load,
    }}>
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const ctx = useContext(GamificationContext)
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider')
  return ctx
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Trophy, Flame, Target, Lightbulb, Info } from 'lucide-react'
import { useGamification } from '@/src/context/GamificationContext'
import { Button } from '@/components/ui/button'
import type { AppNotification } from '@/src/types'

const typeIcons = {
  achievement: Trophy,
  streak: Flame,
  challenge: Target,
  recommendation: Lightbulb,
  system: Info,
}

const typeColors = {
  achievement: 'text-yellow-400',
  streak: 'text-orange-400',
  challenge: 'text-blue-400',
  recommendation: 'text-green-400',
  system: 'text-muted-foreground',
}

function NotificationItem({ notification }: { notification: AppNotification }) {
  const Icon = typeIcons[notification.type]
  const color = typeColors[notification.type]
  const timeAgo = getTimeAgo(notification.createdAt)

  return (
    <div className={`flex gap-3 p-3 rounded-lg transition-colors ${notification.read ? 'opacity-60' : 'bg-primary/5'}`}>
      <div className={`mt-0.5 flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" aria-label="No leída" />
      )}
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markNotificationsRead } = useGamification()

  const handleOpen = () => {
    setOpen(true)
    markNotificationsRead()
  }

  return (
    <div className="relative">
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl bg-card border border-border shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold">Notificaciones</h3>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Cerrar">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No tienes notificaciones
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {notifications.map(n => (
                      <NotificationItem key={n.id} notification={n} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

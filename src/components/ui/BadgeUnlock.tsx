import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Badge } from '@/src/types'
import { Button } from '@/components/ui/button'

interface BadgeUnlockProps {
  badge: Badge | null
  onDismiss: () => void
}

export function BadgeUnlock({ badge, onDismiss }: BadgeUnlockProps) {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.5, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative flex flex-col items-center gap-6 p-10 rounded-3xl bg-card border border-border shadow-2xl max-w-sm mx-4 text-center"
          >
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="text-8xl"
              aria-hidden="true"
            >
              {badge.icon}
            </motion.div>

            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                ¡Badge Desbloqueado!
              </p>
              <h2 className="text-2xl font-bold mb-2">{badge.name}</h2>
              <p className="text-muted-foreground text-sm">{badge.description}</p>
            </div>

            <Button onClick={onDismiss} className="w-full">
              ¡Genial!
            </Button>
          </motion.div>

          {/* Confetti dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['oklch(0.75 0.18 45)', 'oklch(0.70 0.15 180)', 'oklch(0.65 0.2 300)'][i % 3],
                left: `${10 + (i * 7) % 80}%`,
                top: `${10 + (i * 11) % 80}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-20, -60] }}
              transition={{ delay: i * 0.05, duration: 1.2 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

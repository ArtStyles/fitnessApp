import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Crown, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { SubscriptionTier } from '@/src/types'

interface PaywallModalProps {
  open: boolean
  onClose: () => void
  requiredTier: SubscriptionTier
  featureName: string
  featureDescription?: string
}

const tierConfig = {
  premium: {
    icon: Zap,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Premium',
    price: '$39/mes',
    perks: [
      'Entrenamientos avanzados completos',
      'Programas estructurados de 6 semanas',
      'Análisis detallado de progreso',
      'Soporte prioritario',
    ],
  },
  vip: {
    icon: Crown,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    label: 'VIP',
    price: '$79/mes',
    perks: [
      'Todo lo del plan Premium',
      'Consultas 1-a-1 con el entrenador',
      'Programa Elite de 8 semanas',
      'Soporte 24/7',
    ],
  },
  basic: {
    icon: Lock,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    label: 'Básico',
    price: '$19/mes',
    perks: [],
  },
}

export function PaywallModal({ open, onClose, requiredTier, featureName, featureDescription }: PaywallModalProps) {
  const config = tierConfig[requiredTier] ?? tierConfig.premium
  const Icon = config.icon

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`p-6 ${config.bgColor} relative`}>
              <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
              <div className={`w-14 h-14 rounded-2xl ${config.bgColor} border border-border flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 ${config.color}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Función exclusiva {config.label}</p>
              <h2 className="text-xl font-bold">{featureName}</h2>
              {featureDescription && (
                <p className="text-sm text-muted-foreground mt-1">{featureDescription}</p>
              )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Con el plan {config.label} obtienes:</p>
                <ul className="space-y-2">
                  {config.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 space-y-3">
                <Button className="w-full" asChild onClick={onClose}>
                  <Link to={`/pricing?plan=${requiredTier}`}>
                    Actualizar a {config.label} — {config.price}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full" onClick={onClose}>
                  Quizás más tarde
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

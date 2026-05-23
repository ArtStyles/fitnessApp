import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { PricingPlan } from '@/src/types'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface PricingCardProps {
  plan: PricingPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`relative rounded-2xl p-6 ${
        plan.popular
          ? 'bg-gradient-to-b from-primary/20 to-card border-2 border-primary glow-primary'
          : 'bg-card border border-border'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Más Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/mes</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              plan.popular ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}>
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={`w-full ${
          plan.popular
            ? 'bg-primary hover:bg-primary/90'
            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
        }`}
      >
        <Link to={`/register?plan=${plan.tier}`}>
          Comenzar Ahora
        </Link>
      </Button>
    </motion.div>
  )
}

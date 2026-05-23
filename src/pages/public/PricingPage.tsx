import { motion } from 'framer-motion'
import { Check, HelpCircle } from 'lucide-react'
import PricingCard from '@/src/components/ui/PricingCard'
import { mockPricingPlans } from '@/src/data/mockData'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Puedo cambiar de plan después?',
    answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento desde tu perfil. Los cambios se aplicarán en tu próximo ciclo de facturación.'
  },
  {
    question: 'Hay un período de prueba?',
    answer: 'Ofrecemos 7 días de prueba gratuita en todos nuestros planes para que puedas experimentar todas las funciones antes de comprometerte.'
  },
  {
    question: 'Qué métodos de pago aceptan?',
    answer: 'Aceptamos todas las tarjetas de crédito y débito principales, así como PayPal y transferencias bancarias en algunos países.'
  },
  {
    question: 'Puedo cancelar en cualquier momento?',
    answer: 'Absolutamente. No hay contratos a largo plazo. Puedes cancelar tu suscripción en cualquier momento y seguirás teniendo acceso hasta el final del período pagado.'
  },
  {
    question: 'Los entrenamientos son aptos para principiantes?',
    answer: 'Sí, tenemos entrenamientos para todos los niveles. Nuestro sistema adapta las recomendaciones según tu nivel de experiencia y objetivos.'
  },
  {
    question: 'Incluye soporte nutricional?',
    answer: 'Todos los planes incluyen planes de nutrición. Los planes Premium y VIP incluyen personalización adicional y, en el caso VIP, consultas con nutricionistas.'
  }
]

const comparisonFeatures = [
  { feature: 'Entrenamientos básicos', basic: true, premium: true, vip: true },
  { feature: 'Planes de nutrición', basic: true, premium: true, vip: true },
  { feature: 'Seguimiento de progreso', basic: true, premium: true, vip: true },
  { feature: 'Acceso a la comunidad', basic: true, premium: true, vip: true },
  { feature: 'Entrenamientos avanzados', basic: false, premium: true, vip: true },
  { feature: 'Videos en HD', basic: false, premium: true, vip: true },
  { feature: 'Nutrición personalizada', basic: false, premium: true, vip: true },
  { feature: 'Soporte prioritario', basic: false, premium: true, vip: true },
  { feature: 'Programa Elite', basic: false, premium: false, vip: true },
  { feature: 'Consultas 1-a-1', basic: false, premium: false, vip: true },
  { feature: 'Plan con chef', basic: false, premium: false, vip: true },
  { feature: 'Grupo privado VIP', basic: false, premium: false, vip: true },
]

export default function PricingPage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              Precios transparentes
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Invierte en tu{' '}
              <span className="text-gradient">mejor versión</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Elige el plan que mejor se adapte a tus objetivos. 
              Sin costos ocultos, cancela cuando quieras.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockPricingPlans.map((plan, index) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingCard plan={plan} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Comparación de planes</h2>
            <p className="text-muted-foreground">
              Mira exactamente lo que incluye cada plan
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4">Característica</th>
                  <th className="text-center py-4 px-4">Básico</th>
                  <th className="text-center py-4 px-4">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                      Premium
                    </span>
                  </th>
                  <th className="text-center py-4 px-4">VIP</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {row.basic ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      {row.premium ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.vip ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Preguntas frecuentes</h2>
            <p className="text-muted-foreground">
              Respuestas a las preguntas más comunes
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}

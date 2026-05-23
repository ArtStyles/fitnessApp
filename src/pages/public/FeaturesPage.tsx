import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Dumbbell, Utensils, TrendingUp, BookOpen, Trophy, Bell,
  ArrowRight, CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ── Data ──────────────────────────────────────────────────────────────────────

const allFeatures = [
  {
    n: '01', icon: Dumbbell, color: 'text-primary',
    title: 'Entrenamientos Inteligentes',
    sub: '+200 rutinas certificadas',
    desc: 'Sigue series, repeticiones y descansos en tiempo real. Filtra por objetivo, nivel y equipo disponible. Progresión de carga automática.',
    items: ['Tracker en tiempo real', 'Temporizador automático', 'Progresión de carga', 'Historial de sesiones'],
  },
  {
    n: '02', icon: BookOpen, color: 'text-accent',
    title: 'Planes Estructurados',
    sub: '4 a 12 semanas con periodización',
    desc: 'Bloques de volumen, intensidad y deload diseñados por expertos. Tu avance, visible día a día, semana a semana.',
    items: ['Periodización científica', 'Semanas de deload', 'Progreso diario', 'Múltiples objetivos'],
  },
  {
    n: '03', icon: Utensils, color: 'text-green-400',
    title: 'Nutrición Guiada',
    sub: 'Macros calculados para ti',
    desc: 'Planes con calorías ajustadas a tu peso, objetivo y actividad. Recetas reales y lista de compras integrada.',
    items: ['Cálculo de macros personalizado', 'Recetas con ingredientes reales', 'Seguimiento de calorías', 'Planes por objetivo'],
  },
  {
    n: '04', icon: TrendingUp, color: 'text-blue-400',
    title: 'Seguimiento de Progreso',
    sub: 'Métricas que importan',
    desc: 'Peso, medidas, fotos y gráficas en un solo lugar. Heatmap de consistencia y comparación semanal para ver cuánto avanzas.',
    items: ['Gráficas de evolución', 'Heatmap de consistencia', 'Comparación semanal', 'Galería de fotos'],
  },
  {
    n: '05', icon: Trophy, color: 'text-yellow-400',
    title: 'Sistema de Gamificación',
    sub: '12 niveles · +10 badges',
    desc: 'Gana puntos con cada sesión, sube de nivel y desbloquea badges. Desafíos mensuales que convierten el esfuerzo en hábito.',
    items: ['12 niveles de progresión', '+10 badges desbloqueables', 'Desafíos con recompensas', 'Rachas de consistencia'],
  },
  {
    n: '06', icon: Bell, color: 'text-purple-400',
    title: 'Alertas y Notificaciones',
    sub: 'Siempre al día',
    desc: 'Avisos de logros, recordatorios de entrenamiento y novedades. Nunca pierdas el impulso cuando más lo necesitas.',
    items: ['Alertas de logros', 'Recordatorios de sesión', 'Novedades de la plataforma', 'Centro de notificaciones'],
  },
]

const marqueeItems = [
  'Acceso instantáneo', 'Datos seguros', 'Disponible 24/7',
  'Analytics avanzado', 'Planificador semanal', 'Objetivos personalizados',
  'Streak tracker', 'Recomendaciones IA', 'Métricas de salud',
]

const spotlights = [
  {
    title: 'Entrena con datos reales,\nno con suposiciones',
    desc: 'El tracker en tiempo real registra cada serie y te avisa cuándo descansar. La progresión de carga se ajusta automáticamente semana a semana para que nunca te estanques.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    accent: 'text-primary',
    items: ['Series y reps en vivo', 'Temporizador de descanso automático', 'Progresión de carga inteligente'],
  },
  {
    title: 'Nutrición que funciona\nen la vida real',
    desc: 'Sin dietas de choque ni alimentos imposibles. Los planes de nutrición se adaptan a tus macros, tus gustos y tu rutina diaria con recetas para personas reales.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200',
    accent: 'text-green-400',
    items: ['Macros calculados a tu medida', 'Recetas con ingredientes reales', 'Lista de compras integrada'],
  },
  {
    title: 'Cada punto te acerca\na tu mejor versión',
    desc: 'La gamificación aplica la ciencia del comportamiento al fitness: puntos, niveles y desafíos que transforman el esfuerzo en hábito sin que te des cuenta.',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200',
    accent: 'text-yellow-400',
    items: ['12 niveles de progresión', '+10 badges desbloqueables', 'Desafíos mensuales con premios'],
  },
]

// ── Small marquee strip ────────────────────────────────────────────────────────
function Marquee() {
  return (
    <div className="border-y border-border bg-primary/5 py-4 overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="text-sm font-medium text-muted-foreground flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[72vh] flex items-end pb-20 pt-40 overflow-hidden">
        {/* Bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px]" />

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-6"
            >
              Plataforma de entrenamiento inteligente
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tighter mb-10"
            >
              TODO LO QUE
              <br />
              <span className="text-gradient">NECESITAS</span>
              <br />
              <span className="text-muted-foreground font-light italic">para transformarte.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-10 pt-8 border-t border-border/30"
            >
              {[
                { val: '6', label: 'módulos' },
                { val: '200+', label: 'rutinas' },
                { val: '50K+', label: 'usuarios' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-black">{s.val}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 glow-primary h-12 px-7 rounded-full font-semibold hidden md:inline-flex ml-auto"
              >
                <Link to="/register">
                  Empezar gratis <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── FEATURE ROWS — numbered list, no cards ── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4">Funcionalidades</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Seis módulos.<br />
              <span className="text-muted-foreground font-normal">Un solo lugar.</span>
            </h2>
          </div>

          <div className="divide-y divide-border">
            {allFeatures.map((f, i) => (
              <motion.div
                key={f.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr_1fr] gap-6 md:gap-12 py-8 md:py-10 hover:pl-2 transition-all duration-300 cursor-default"
              >
                {/* Number */}
                <span className={`text-5xl font-black leading-none ${f.color} opacity-20 group-hover:opacity-50 transition-opacity select-none pt-1`}>
                  {f.n}
                </span>

                {/* Title + sub */}
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <f.icon className={`w-5 h-5 ${f.color} shrink-0`} />
                    <h3 className="text-xl md:text-2xl font-black group-hover:text-primary transition-colors">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest ml-8 mb-3">{f.sub}</p>
                  {/* Mobile desc */}
                  <p className="text-muted-foreground text-sm leading-relaxed ml-8 md:hidden">{f.desc}</p>
                </div>

                {/* Desc + bullets (desktop) */}
                <div className="hidden md:block">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {f.items.map(item => (
                      <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT — full-bleed photo alternating sections ── */}
      {spotlights.map((s, i) => (
        <motion.section
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[75vh] flex items-center overflow-hidden border-t border-border"
        >
          {/* Photo — fills one half on desktop */}
          <div className={`absolute inset-y-0 ${i % 2 === 0 ? 'right-0' : 'left-0'} w-full lg:w-1/2`}>
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            {/* Gradient blend toward text side */}
            <div
              className={`absolute inset-0 ${
                i % 2 === 0
                  ? 'bg-gradient-to-r from-background via-background/30 to-transparent'
                  : 'bg-gradient-to-l from-background via-background/30 to-transparent'
              }`}
            />
            {/* Top + bottom fades */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
            {/* Mobile: darken heavily */}
            <div className="absolute inset-0 bg-background/75 lg:hidden" />
          </div>

          {/* Text content */}
          <div className="relative z-10 container mx-auto px-6 lg:px-12 py-24">
            <div className={`max-w-lg ${i % 2 !== 0 ? 'lg:ml-auto' : ''}`}>
              <p className={`text-xs font-semibold tracking-[0.25em] uppercase mb-6 ${s.accent}`}>
                Funcionalidad destacada
              </p>
              <h2 className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tight mb-6 whitespace-pre-line">
                {s.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {s.desc}
              </p>
              <ul className="space-y-3 mb-10">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${s.accent}`} />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-primary hover:bg-primary/90 glow-primary rounded-full h-11 px-6 font-semibold">
                <Link to="/register">
                  Probarlo gratis <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      ))}

      {/* ── FINAL CTA ── */}
      <section className="relative py-44 overflow-hidden border-t border-border">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/82" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-8">
              EMPIEZA<br />
              <span className="text-gradient">HOY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
              Plan básico gratuito. Sin tarjeta de crédito. Cancela cuando quieras.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow-primary h-12 px-8 rounded-full font-semibold">
                <Link to="/register">
                  Crear cuenta gratis <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full border-border/60 font-semibold">
                <Link to="/pricing">Ver precios</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Sin tarjeta · Acceso inmediato · Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

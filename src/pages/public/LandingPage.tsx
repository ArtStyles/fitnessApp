import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useState, ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Dumbbell, Trophy, Flame, TrendingUp, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockPricingPlans, mockWorkouts, mockTrainers } from '@/src/data/mockData'
import PricingCard from '@/src/components/ui/PricingCard'

// ── Ease curve (cinematic) ───────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const

// ── Clip-reveal: text slides up from a hidden container ─────────────────────
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '105%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ── Fade reveal ──────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Arc background (circular decorative lines) ───────────────────────────────
function ArcBg({ dark = false }: { dark?: boolean }) {
  const color = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {[220, 370, 520, 670, 820].map(r => (
        <circle key={r} cx="500" cy="500" r={r} fill="none" stroke={color} strokeWidth="1" />
      ))}
    </svg>
  )
}

// ── Floating wrapper ─────────────────────────────────────────────────────────
function Float({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Stacked images card ──────────────────────────────────────────────────────
function StackedImages({ srcs }: { srcs: string[] }) {
  return (
    <div className="relative w-40 h-40">
      {srcs.map((src, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
          style={{
            rotate: i === 0 ? -8 : i === 1 ? 4 : 0,
            translateX: i === 0 ? -12 : i === 1 ? 10 : 0,
            translateY: i === 0 ? 10 : i === 1 ? -6 : 0,
            zIndex: srcs.length - i,
          }}
          whileHover={{ rotate: 0, translateX: 0, translateY: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  )
}

// ── Scrolling marquee strip ──────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  '⚡ ENTRENA INTELIGENTE',
  '🔥 MÁS DE 200 RUTINAS',
  '🏆 50K USUARIOS ACTIVOS',
  '💪 PLANES PROFESIONALES',
  '🥗 NUTRICIÓN GUIADA',
  '📈 RESULTADOS REALES',
]

function MarqueeStrip({ dark = false }: { dark?: boolean }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className={`overflow-hidden py-3 ${dark ? 'bg-white/5 border-y border-white/10' : 'bg-black/5 border-y border-black/10'}`}>
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`text-xs font-bold tracking-[0.2em] uppercase font-display-condensed ${dark ? 'text-white/40' : 'text-black/40'}`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Numbered tab navigation ──────────────────────────────────────────────────
function NumberedTabs({
  items,
  active,
  onChange,
}: {
  items: string[]
  active: number
  onChange: (i: number) => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-12">
      {items.map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`text-xs font-bold tracking-widest transition-colors font-display-condensed ${
            active === i ? 'text-black' : 'text-black/25 hover:text-black/50'
          }`}
        >
          {String(i + 1).padStart(2, '0')}
        </button>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      label: 'Tracker',
      title: 'TRACKER EN\nTIEMPO REAL',
      desc: 'Sigue series, repeticiones y descansos automáticos. Más de 200 rutinas filtradas por objetivo, nivel y equipo disponible.',
      color: 'text-primary',
      imgs: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      ],
    },
    {
      label: 'Nutrición',
      title: 'PLANES DE\nALIMENTACIÓN',
      desc: 'Macros calculados con precisión y recetas reales adaptadas a tu objetivo. Cada comida cuenta.',
      color: 'text-green-500',
      imgs: [
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      ],
    },
    {
      label: 'Progreso',
      title: 'MÉTRICAS\nREALES',
      desc: 'Gráficas semanales, heatmap de consistencia y comparación de fuerza. Tu evolución siempre visible.',
      color: 'text-blue-500',
      imgs: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      ],
    },
    {
      label: 'Gamificación',
      title: 'SUBE\nDE NIVEL',
      desc: 'Puntos, badges y desafíos semanales que te mantienen constante. El gym se convierte en un juego.',
      color: 'text-yellow-500',
      imgs: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400',
      ],
    },
    {
      label: 'Programas',
      title: 'PLANES\n4–12 SEMANAS',
      desc: 'Periodización profesional semana a semana. Diseñados por expertos para llevarte al siguiente nivel.',
      color: 'text-accent',
      imgs: [
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
        'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400',
      ],
    },
  ]

  const feat = features[activeFeature]

  return (
    <div className="overflow-x-hidden bg-background">

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Full dark, layered typography + athlete photo
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-black overflow-hidden flex flex-col"
      >
        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-20 flex gap-3 px-8 pt-28 pb-0"
        >
          {['FUERZA', 'CARDIO', 'NUTRICIÓN'].map(tag => (
            <span
              key={tag}
              className="text-xs font-bold tracking-widest border border-white/30 rounded-full px-4 py-1.5 text-white/70 font-display-condensed"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Horizontal names row */}
        <div className="relative z-20 flex items-center justify-between px-8 mt-4">
          <div className="flex gap-8">
            {['FUERZA', 'POTENCIA'].map(n => (
              <motion.span
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm font-black tracking-[0.2em] text-white/30 font-display-condensed"
              >
                {n}
              </motion.span>
            ))}
          </div>
          <div className="flex gap-8">
            {['CONSTANCIA', 'EVOLUCIÓN'].map(n => (
              <motion.span
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm font-black tracking-[0.2em] text-white/30 font-display-condensed"
              >
                {n}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Layered title + photo ── */}
        <div className="relative flex-1 flex items-center justify-center">

          {/* Massive background title — BEHIND the photo */}
          <motion.div
            style={{ y: textY, opacity }}
            className="absolute inset-x-0 flex flex-col items-center justify-center pointer-events-none select-none z-10"
          >
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                className="font-display-condensed font-black text-white leading-none tracking-tighter text-center"
                style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', lineHeight: 0.85 }}
              >
                ENTRENA
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.18 }}
                className="font-display-condensed font-black leading-none tracking-tighter text-center"
                style={{
                  fontSize: 'clamp(6rem, 18vw, 18rem)',
                  lineHeight: 0.85,
                  WebkitTextStroke: '2px rgba(255,255,255,0.6)',
                  color: 'transparent',
                }}
              >
                INTELI
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.26 }}
                className="font-display-condensed font-black text-white leading-none tracking-tighter text-center"
                style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', lineHeight: 0.85 }}
              >
                GENTE
              </motion.h1>
            </div>
          </motion.div>

          {/* Athlete photo — IN FRONT of the text */}
          <motion.div
            style={{ y: imgY }}
            className="relative z-20 h-[75vh] max-h-[700px] flex items-end justify-center pointer-events-none"
          >
            <img
              src="/owner.png"
              alt=""
              className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Bottom CTA row */}
        <motion.div
          style={{ opacity }}
          className="relative z-20 flex items-center justify-between px-8 pb-8 gap-4"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/40 text-sm max-w-xs leading-relaxed"
          >
            Planes personalizados, nutrición guiada y seguimiento en tiempo real.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm tracking-widest uppercase px-7 py-3.5 rounded-full hover:bg-primary/90 transition-colors font-display-condensed"
            >
              EMPIEZA GRATIS <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Marquee strip */}
        <div className="relative z-20">
          <MarqueeStrip dark />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SPLIT — Dark top / White bottom with floating app card
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative">

        {/* Dark half */}
        <div className="bg-black h-48 relative">
          <ArcBg dark />
        </div>

        {/* White half */}
        <div className="bg-white relative min-h-[360px]">
          <ArcBg />
        </div>

        {/* Floating card crossing the boundary */}
        <div className="absolute inset-x-0 top-0 flex justify-center items-start" style={{ marginTop: '-10px' }}>
          <Float>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="bg-card rounded-3xl shadow-2xl shadow-black/40 w-72 overflow-hidden border border-white/10"
            >
              {/* Card header */}
              <div className="bg-black p-5 pb-4">
                <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1 font-display-condensed">SESIÓN ACTIVA</p>
                <p className="text-white font-black text-2xl font-display-condensed">CHEST & TRICEPS</p>
                <div className="flex gap-2 mt-3">
                  {['Pecho', 'Tríceps', 'Hombros'].map(m => (
                    <span key={m} className="text-[10px] bg-white/10 text-white/60 px-2 py-1 rounded-full font-display-condensed">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              {/* Progress */}
              <div className="p-5 space-y-3">
                {[
                  { name: 'Press Banca', sets: 4, done: 3 },
                  { name: 'Fondos', sets: 3, done: 3 },
                  { name: 'Extensiones', sets: 3, done: 1 },
                ].map(ex => (
                  <div key={ex.name} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">{ex.name}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: ex.sets }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full ${i < ex.done ? 'bg-primary' : 'bg-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <div className="px-5 pb-5">
                <div className="bg-primary rounded-2xl py-3 text-center">
                  <span className="text-primary-foreground font-black text-sm tracking-widest font-display-condensed">
                    SIGUIENTE EJERCICIO →
                  </span>
                </div>
              </div>
            </motion.div>
          </Float>
        </div>

        {/* Text below */}
        <div className="absolute bottom-0 inset-x-0 pb-12 bg-white">
          <div className="container mx-auto px-8 flex items-end justify-between">
            <Reveal delay={0.1}>
              <p className="font-display-condensed font-black text-black text-7xl md:text-9xl leading-none tracking-tighter">
                DISEÑADO
              </p>
            </Reveal>
            <div className="text-right max-w-xs pb-2">
              <FadeIn delay={0.3}>
                <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2 font-display-condensed">
                  POR PROFESIONALES :
                </p>
                <p className="text-xs text-black/50 uppercase leading-relaxed tracking-wide font-display-condensed">
                  Cada plan fue creado por entrenadores certificados con años de experiencia transformando cuerpos y vidas.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES — White, numbered tabs, stacked images
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white relative overflow-hidden py-24">
        <ArcBg />
        <div className="container mx-auto px-8 relative z-10">

          <NumberedTabs
            items={features}
            active={activeFeature}
            onChange={setActiveFeature}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start"
            >
              {/* Left — stacked images + text */}
              <div className="space-y-6">
                <FadeIn>
                  <p className={`text-xs font-bold tracking-widest uppercase font-display-condensed ${feat.color}`}>
                    FITFORGE :
                  </p>
                  <p className="text-xs text-black/50 uppercase leading-relaxed tracking-wide font-display-condensed mt-2">
                    {feat.desc}
                  </p>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <StackedImages srcs={feat.imgs} />
                </FadeIn>
              </div>

              {/* Center — big title */}
              <div className="flex flex-col items-center justify-center text-center py-8">
                <Reveal>
                  <h2
                    className="font-display-condensed font-black text-black leading-none tracking-tighter whitespace-pre-line"
                    style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                  >
                    {feat.title}
                  </h2>
                </Reveal>
                <FadeIn delay={0.2} className="mt-8 flex gap-4">
                  <button
                    onClick={() => setActiveFeature(i => Math.max(0, i - 1))}
                    disabled={activeFeature === 0}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-20"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setActiveFeature(i => Math.min(features.length - 1, i + 1))}
                    disabled={activeFeature === features.length - 1}
                    className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-20"
                  >
                    →
                  </button>
                </FadeIn>
              </div>

              {/* Right — stacked images + link */}
              <div className="space-y-6 flex flex-col items-end">
                <FadeIn delay={0.15}>
                  <p className="text-xs font-bold tracking-widest uppercase text-right font-display-condensed text-black/30">
                    PRÓXIMAMENTE :
                  </p>
                  <p className="text-xs text-black/40 uppercase leading-relaxed tracking-wide font-display-condensed mt-2 text-right max-w-xs">
                    Más funcionalidades diseñadas para atletas serios que buscan resultados medibles.
                  </p>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <StackedImages srcs={[feat.imgs[1], feat.imgs[0]]} />
                </FadeIn>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Dark, numbered steps, floating stats card
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-black relative overflow-hidden py-28">
        <ArcBg dark />
        <div className="container mx-auto px-8 relative z-10">

          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Steps */}
            <div className="space-y-0">
              <FadeIn className="mb-16">
                <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-4 font-display-condensed">
                  CÓMO FUNCIONA
                </p>
                <Reveal>
                  <h2
                    className="font-display-condensed font-black text-white leading-none tracking-tighter"
                    style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
                  >
                    TRES PASOS.
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2
                    className="font-display-condensed font-black text-white/20 leading-none tracking-tighter"
                    style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
                  >
                    UN CAMBIO.
                  </h2>
                </Reveal>
              </FadeIn>

              {[
                { n: '01', title: 'Define tu objetivo', desc: 'Cuéntanos tu meta. Nuestro onboarding analiza tu nivel, equipo y tiempo.', icon: TrendingUp },
                { n: '02', title: 'Elige tu programa', desc: 'Planes de 4 a 12 semanas con periodización profesional.', icon: Dumbbell },
                { n: '03', title: 'Entrena y evoluciona', desc: 'Sigue cada sesión en tiempo real y sube de nivel cada semana.', icon: Flame },
              ].map((step, i) => (
                <FadeIn key={step.n} delay={i * 0.12}>
                  <div className="flex gap-6 py-7 border-b border-white/8 group cursor-default">
                    <span className="font-display-condensed font-black text-4xl text-white/10 group-hover:text-primary/40 transition-colors leading-none w-14 shrink-0 pt-1">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-display-condensed font-black text-white text-xl tracking-tight group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-white/35 text-sm mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Floating stats card */}
            <div className="flex justify-center">
              <Float delay={0.5}>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="bg-white rounded-3xl p-8 w-80 shadow-2xl shadow-black/50"
                >
                  <p className="text-xs font-bold tracking-widest uppercase text-black/30 mb-6 font-display-condensed">
                    TU PROGRESO
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { val: '50K+', label: 'Usuarios' },
                      { val: '200+', label: 'Rutinas' },
                      { val: '4.9★', label: 'Valoración' },
                      { val: '95%',  label: 'Satisfacción' },
                    ].map(s => (
                      <div key={s.label} className="bg-black/4 rounded-2xl p-4">
                        <p className="font-display-condensed font-black text-2xl text-black">{s.val}</p>
                        <p className="text-xs text-black/40 uppercase tracking-widest font-display-condensed mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {['Press Banca — 80kg', 'Sentadilla — 100kg', 'Peso Muerto — 120kg'].map((lift, i) => (
                      <div key={lift} className="flex items-center gap-3">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${[75, 90, 100][i]}%` }} />
                        <span className="text-[10px] text-black/40 shrink-0 font-display-condensed">{lift.split('—')[1]}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/register"
                    className="mt-6 w-full bg-black text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-2xl flex items-center justify-center gap-2 font-display-condensed hover:bg-primary transition-colors"
                  >
                    EMPIEZA AHORA <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </Float>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WORKOUTS — White, horizontal scroll
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 relative overflow-hidden">
        <ArcBg />
        <div className="container mx-auto px-8 relative z-10 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <FadeIn>
                <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-3 font-display-condensed">
                  ENTRENAMIENTOS
                </p>
              </FadeIn>
              <Reveal>
                <h2
                  className="font-display-condensed font-black text-black leading-none tracking-tighter"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                >
                  EMPIEZA HOY.
                </h2>
              </Reveal>
            </div>
            <FadeIn delay={0.2}>
              <Link
                to="/register"
                className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-black/40 hover:text-black transition-colors font-display-condensed"
              >
                VER TODOS <ChevronRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto px-8 pb-4 snap-x snap-mandatory container mx-auto">
          {mockWorkouts.slice(0, 4).map((workout, i) => (
            <FadeIn key={workout.id} delay={i * 0.08} className="shrink-0 w-72 snap-start">
              <div className="rounded-3xl overflow-hidden bg-black group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  {workout.imageUrl && (
                    <img
                      src={workout.imageUrl}
                      alt={workout.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase font-display-condensed">
                      {workout.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display-condensed font-black text-white text-xl tracking-tight">
                    {workout.title.toUpperCase()}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-white/30 uppercase tracking-widest font-display-condensed">
                      {workout.durationMinutes} MIN · {workout.difficulty}
                    </span>
                    <Link
                      to="/register"
                      className="text-[10px] font-black text-primary tracking-widest uppercase font-display-condensed"
                    >
                      EMPEZAR →
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING — Dark
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-black py-28 relative overflow-hidden">
        <ArcBg dark />
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-4 font-display-condensed">
                PRECIOS
              </p>
            </FadeIn>
            <Reveal>
              <h2
                className="font-display-condensed font-black text-white leading-none tracking-tighter"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
              >
                ELIGE TU PLAN.
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPricingPlans.map((plan, i) => (
              <FadeIn key={plan.tier} delay={i * 0.1}>
                <PricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CLOSING CTA — White cinematic
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white relative overflow-hidden py-32">
        <ArcBg />
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <FadeIn>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-black/30 mb-6 font-display-condensed">
              EN EL GYM
            </p>
          </FadeIn>
          <Reveal>
            <h2
              className="font-display-condensed font-black text-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(5rem, 16vw, 14rem)' }}
            >
              FITFORGE
            </h2>
          </Reveal>

          <div className="flex gap-6 mt-4 mb-12">
            <FadeIn delay={0.1}>
              <span className="text-sm font-bold text-black/20 tracking-widest font-display-condensed">50K+ USUARIOS</span>
            </FadeIn>
            <FadeIn delay={0.2}>
              <span className="text-sm font-bold text-black/20 tracking-widest font-display-condensed">2026</span>
            </FadeIn>
          </div>

          {/* Floating athlete image */}
          <Float>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl shadow-black/20 mb-12"
            >
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
                alt="FitForge"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </Float>

          <FadeIn delay={0.1}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-black text-white font-black text-sm tracking-widest uppercase px-10 py-4 rounded-full hover:bg-primary transition-colors font-display-condensed"
            >
              EMPIEZA GRATIS <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <MarqueeStrip />

    </div>
  )
}

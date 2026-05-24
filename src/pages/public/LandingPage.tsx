import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useLayoutEffect } from 'react'
import {
  ArrowRight, ArrowUpRight, Dumbbell, TrendingUp,
  Flame, Trophy, Play, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockPricingPlans, mockWorkouts, mockTrainers } from '@/src/data/mockData'
import PricingCard from '@/src/components/ui/PricingCard'
import HeroScene from '@/src/components/3d/HeroScene'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Marquee strip ─────────────────────────────────────────────────────────────
const marqueeItems = [
  'Entrenamiento inteligente',
  'Nutrición guiada',
  'Seguimiento de progreso',
  'Gamificación',
  'Planes estructurados',
  'Resultados reales',
  'Más de 200 rutinas',
  '50K usuarios activos',
]

function Marquee() {
  return (
    <div className="relative overflow-hidden py-4 border-y border-border bg-primary/5">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
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

// ── Magnetic button effect ────────────────────────────────────────────────────
function MagneticLink({ children, to }: { children: React.ReactNode; to: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} className="inline-block">
      <motion.div style={{ x: springX, y: springY }}>
        <Link to={to}>{children}</Link>
      </motion.div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY   = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const featuredWorkouts = mockWorkouts.slice(0, 3)

  // ── GSAP animations ────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Parallax on decorative ghost numbers / bg spans
      gsap.utils.toArray<HTMLElement>('.gsap-parallax').forEach(el => {
        gsap.to(el, {
          yPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })

      // 2. 3-D reveal on section headers (rotateX from top)
      gsap.utils.toArray<HTMLElement>('.gsap-reveal-3d').forEach(el => {
        gsap.from(el, {
          opacity: 0,
          rotateX: 38,
          y: 50,
          transformPerspective: 900,
          transformOrigin: 'top center',
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })

      // 3. Animated number counters
      gsap.utils.toArray<HTMLElement>('.gsap-counter').forEach(el => {
        const to     = parseFloat(el.dataset.to    ?? '0')
        const suffix = el.dataset.suffix ?? ''
        const dec    = parseInt(el.dataset.dec   ?? '0')
        const obj    = { val: 0 }
        gsap.to(obj, {
          val: to,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate() {
            el.textContent = obj.val.toFixed(dec) + suffix
          },
        })
      })

    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-end">

        {/* ── CINEMATIC BACKGROUND ── */}
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          {/* Base dark bg */}
          <div className="absolute inset-0 bg-background" />

          {/* ── 3D SCENE — above dark bg, below photo & gradients ── */}
          <HeroScene />

          {/* Owner photo — covers right 58% of screen */}
          <div className="absolute inset-y-0 right-0 w-[62%] lg:w-[58%]" style={{ zIndex: 2 }}>
            <img
              src="/owner.png"
              alt=""
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>

          {/* Gradients — above photo and 3D scene to blend everything */}
          <div className="absolute inset-0 bg-gradient-to-r from-background from-[36%] via-background/80 via-[52%] to-transparent" style={{ zIndex: 3 }} />
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-background via-background/65 to-transparent" style={{ zIndex: 3 }} />
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-background/90 to-transparent" style={{ zIndex: 3 }} />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" style={{ zIndex: 3 }} />
          <div className="absolute top-1/4 left-[42%] w-[280px] h-[500px] bg-primary/12 rounded-full blur-[90px] pointer-events-none" style={{ zIndex: 3 }} />
          <div className="absolute bottom-1/3 left-[35%] w-[200px] h-[300px] bg-accent/10 rounded-full blur-[70px] pointer-events-none" style={{ zIndex: 3 }} />
        </motion.div>

        {/* ── TEXT CONTENT ── */}
        <motion.div style={{ y: textY, opacity }} className="relative z-10 w-full pb-20 pt-40">
          <div className="container mx-auto px-6 lg:px-14">
            <div className="max-w-lg">

              {/* Pre-heading */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary font-semibold text-xs tracking-[0.25em] uppercase mb-6"
              >
                Plataforma de entrenamiento inteligente
              </motion.p>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-tighter mb-10"
              >
                ENTRENA
                <br />
                <span className="text-gradient">INTELI</span>
                <span className="text-stroke">GENTE</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="text-muted-foreground text-lg leading-relaxed max-w-sm mb-8"
              >
                Planes personalizados, nutrición guiada y seguimiento en tiempo real para alcanzar tu mejor versión.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow-primary h-12 px-7 text-base font-semibold rounded-full">
                  <Link to="/register">
                    Empezar gratis <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-7 rounded-full border-border/60 font-semibold">
                  <Link to="/features">
                    <Play className="w-4 h-4 mr-2" /> Ver características
                  </Link>
                </Button>
              </motion.div>

              {/* Stats strip — GSAP counters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap gap-8 pt-8 border-t border-border/30"
              >
                {[
                  { to: 50,  suffix: 'K+', dec: 0, label: 'usuarios'      },
                  { to: 200, suffix: '+',  dec: 0, label: 'rutinas'        },
                  { to: 4.9, suffix: '★',  dec: 1, label: 'valoración'     },
                  { to: 95,  suffix: '%',  dec: 0, label: 'satisfacción'   },
                ].map(s => (
                  <div key={s.label}>
                    <p
                      className="gsap-counter text-2xl font-black text-foreground"
                      data-to={s.to}
                      data-suffix={s.suffix}
                      data-dec={s.dec}
                    >
                      {s.to}{s.suffix}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* ── FLOATING GLASS CARD — bottom-right corner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 right-6 lg:right-12 z-20 hidden lg:block"
        >
          <div className="glass rounded-2xl p-5 max-w-[220px] shadow-xl shadow-black/30">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <Trophy className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold leading-none">FitForge</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Top Coach 2024</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "Cada rep cuenta. La constancia es el único secreto."
            </p>
          </div>
        </motion.div>

      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── HOW IT WORKS — large numbered steps ───────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        {/* Ghost number in bg */}
        <span className="gsap-parallax absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] font-black text-border/20 leading-none select-none pointer-events-none">
          01
        </span>

        <div className="container mx-auto px-4">
          <div className="gsap-reveal-3d mb-20">
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3">Cómo funciona</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Tres pasos.<br />
              <span className="text-muted-foreground font-normal">Un cambio de vida.</span>
            </h2>
          </div>

          <div className="space-y-0 divide-y divide-border">
            {[
              {
                n: '01',
                title: 'Define tu objetivo',
                desc: 'Cuéntanos tu meta. Nuestro onboarding analiza tu nivel, equipo disponible y tiempo, y lo personaliza todo para ti.',
                icon: TrendingUp,
              },
              {
                n: '02',
                title: 'Elige tu programa',
                desc: 'Selecciona un plan estructurado de 4 a 12 semanas con periodización profesional diseñado para tu objetivo concreto.',
                icon: Dumbbell,
              },
              {
                n: '03',
                title: 'Entrena y evoluciona',
                desc: 'Sigue cada sesión en tiempo real, registra tu progreso y sube de nivel. La gamificación te mantiene motivado cada día.',
                icon: Flame,
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center gap-6 py-10 hover:pl-4 transition-all duration-300"
              >
                <span className="text-6xl md:text-8xl font-black text-border group-hover:text-primary/40 transition-colors leading-none w-32 shrink-0">
                  {step.n}
                </span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground max-w-lg">{step.desc}</p>
                </div>
                <step.icon className="w-10 h-10 text-border group-hover:text-primary transition-colors shrink-0 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — asymmetric bento ───────────────────────────────────── */}
      <section className="py-32 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="gsap-reveal-3d">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3">Funcionalidades</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Todo lo que<br />necesitas.
              </h2>
            </div>
            <Link
              to="/features"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              Ver todas las funciones
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Bento grid — asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto gap-4">

            {/* Big left — Workout tracker */}
            <div className="md:col-span-7 feature-card-border-wrap" style={{ animationDelay: '0s' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[22px] overflow-hidden min-h-[380px] bg-card bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex flex-col justify-between group w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Dumbbell className="w-10 h-10 text-primary mb-auto" />
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">Entrenamientos</p>
                <h3 className="text-3xl font-black mb-3">Tracker en tiempo real</h3>
                <p className="text-muted-foreground max-w-sm">
                  Sigue series, repeticiones y descansos automáticos. Más de 200 rutinas filtradas por objetivo, nivel y equipo disponible.
                </p>
              </div>
              {/* Floating preview element */}
              <div className="absolute bottom-8 right-8 hidden md:block">
                <div className="bg-background/80 backdrop-blur border border-border rounded-2xl p-4 w-44">
                  <p className="text-xs text-muted-foreground mb-2">Progreso actual</p>
                  <div className="space-y-1.5">
                    {['Series', 'Repeticiones', 'Descanso'].map((l, i) => (
                      <div key={l} className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${[85, 100, 60][i]}%` }} />
                        <span className="text-xs text-muted-foreground shrink-0">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            </div>

            {/* Right top — Nutrition */}
            <div className="md:col-span-5 feature-card-border-wrap" style={{ animationDelay: '1s' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-[22px] overflow-hidden min-h-[180px] relative group w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800"
                alt="Nutrición"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-1">Nutrición</p>
                <h3 className="text-2xl font-black">Planes de alimentación</h3>
                <p className="text-sm text-muted-foreground mt-1">Macros calculados y recetas reales para tu objetivo</p>
              </div>
            </motion.div>
            </div>

            {/* Bottom left — Progress */}
            <div className="md:col-span-4 feature-card-border-wrap" style={{ animationDelay: '2s' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-[22px] overflow-hidden min-h-[200px] relative group w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                alt="Progreso"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Progreso</p>
                <h3 className="text-xl font-black">Métricas reales</h3>
                <p className="text-sm text-muted-foreground mt-1">Gráficas, heatmap y comparación semanal</p>
              </div>
            </motion.div>
            </div>

            {/* Bottom middle — Gamification */}
            <div className="md:col-span-4 feature-card-border-wrap" style={{ animationDelay: '3s' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-[22px] bg-card bg-gradient-to-br from-yellow-500/20 to-accent/10 min-h-[200px] p-7 flex flex-col justify-between group w-full"
            >
              <Trophy className="w-9 h-9 text-yellow-400" />
              <div>
                <p className="text-xs text-yellow-400 font-semibold uppercase tracking-widest mb-2">Gamificación</p>
                <h3 className="text-xl font-black mb-1">Sube de nivel</h3>
                <p className="text-sm text-muted-foreground">Puntos, badges y desafíos que te mantienen constante</p>
              </div>
            </motion.div>
            </div>

            {/* Bottom right — Plans */}
            <div className="md:col-span-4 feature-card-border-wrap" style={{ animationDelay: '4s' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="rounded-[22px] bg-card bg-gradient-to-br from-accent/20 to-accent/5 min-h-[200px] p-7 flex flex-col justify-between group w-full"
            >
              <div className="flex gap-1">
                {[4, 5, 6, 7, 8].map(w => (
                  <div
                    key={w}
                    className="flex-1 rounded-sm bg-accent/30 group-hover:bg-accent/50 transition-colors"
                    style={{ height: `${w * 6}px`, alignSelf: 'flex-end' }}
                  />
                ))}
              </div>
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-2">Programas</p>
                <h3 className="text-xl font-black mb-1">Planes 4–12 semanas</h3>
                <p className="text-sm text-muted-foreground">Periodización profesional semana a semana</p>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKOUT SHOWCASE — horizontal scroll magazine ──────────────────── */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-4 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3">Entrenamientos</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Empieza hoy.
              </h2>
            </div>
            <Link to="/register" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              Ver todos
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Overflow scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible px-4 container mx-auto pb-4 snap-x snap-mandatory">
          {featuredWorkouts.map((workout, i) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative shrink-0 w-72 md:w-auto snap-start rounded-3xl overflow-hidden h-96 cursor-pointer"
            >
              <img
                src={workout.image}
                alt={workout.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-2">{workout.category}</p>
                <h3 className="font-black text-xl mb-1 leading-tight">{workout.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{workout.duration} · {workout.exercises.length} ejercicios</span>
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRAINERS — portrait magazine style ────────────────────────────── */}
      <section className="py-32 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-3">Equipo</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Los mejores<br />
                <span className="text-muted-foreground font-normal">a tu lado.</span>
              </h2>
            </div>
            <Link to="/about" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
              Conocer el equipo
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Portrait grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {mockTrainers.map((trainer, i) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">{trainer.specialty}</p>
                  <h3 className="text-2xl font-black">{trainer.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {trainer.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4">Precios</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Elige tu plan.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Empieza gratis, escala cuando estés listo. Sin permanencia, sin letra pequeña.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockPricingPlans.map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <PricingCard plan={plan} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — quote-forward ──────────────────────────────────── */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4">Testimonios</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Ellos ya lo<br />
              <span className="text-muted-foreground font-normal">lograron.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-3xl overflow-hidden">
            {[
              {
                name: 'María García',
                role: 'Perdió 15 kg en 4 meses',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                quote: 'FitForge me dio la estructura que nunca tuve. El tracker y los puntos me mantienen enganchada cada día.',
                stat: '−15 kg',
              },
              {
                name: 'Carlos López',
                role: 'Ganó 8 kg de músculo',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                quote: 'Los planes de entrenamiento son de otro nivel. La periodización y el seguimiento de cargas hacen toda la diferencia.',
                stat: '+8 kg músculo',
              },
              {
                name: 'Ana Martínez',
                role: 'Maratonista amateur',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
                quote: 'Mejoré mi resistencia un 40% en 3 meses con el plan de cardio. Las métricas de progreso son increíbles.',
                stat: '+40% resistencia',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 md:p-10 flex flex-col gap-6"
              >
                {/* Large stat */}
                <p className="text-5xl font-black text-primary">{t.stat}</p>

                {/* Quote */}
                <p className="text-lg leading-relaxed text-muted-foreground flex-1">
                  "{t.quote}"
                </p>

                {/* Person */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — split full-bleed ──────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>

        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-8">
              TU MEJOR<br />
              <span className="text-gradient">VERSIÓN</span><br />
              TE ESPERA
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md leading-relaxed">
              Únete a más de 50.000 personas que ya entrenan inteligente.
              Sin excusas. Sin esperas.
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticLink to="/register">
                <span className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 glow-primary transition-colors">
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </span>
              </MagneticLink>
              <MagneticLink to="/pricing">
                <span className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-bold text-base hover:bg-secondary transition-colors">
                  Ver planes
                </span>
              </MagneticLink>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Sin tarjeta de crédito · Acceso inmediato · Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

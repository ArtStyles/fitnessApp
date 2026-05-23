import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Target, Heart, Zap, Users,
  Instagram, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockTrainers } from '@/src/data/mockData'

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: '50K+', label: 'Usuarios activos' },
  { value: '200+', label: 'Entrenamientos' },
  { value: '95%',  label: 'Satisfacción' },
  { value: '4.9★', label: 'Valoración media' },
]

const milestones = [
  {
    year: '2021',
    title: 'Fundación',
    desc: 'Tres entrenadores y una visión clara: democratizar el fitness de calidad para todo el mundo.',
  },
  {
    year: '2022',
    title: 'Lanzamiento',
    desc: 'Abrimos la plataforma al público con más de 100 rutinas y 3 planes de nutrición completos.',
  },
  {
    year: '2023',
    title: '10K usuarios',
    desc: 'Alcanzamos diez mil usuarios activos y expandimos el equipo de entrenadores a 12 especialistas.',
  },
  {
    year: '2024',
    title: '50K+ usuarios',
    desc: 'Hoy somos una comunidad de más de 50.000 personas transformando sus vidas cada día.',
  },
]

const values = [
  {
    icon: Target,
    color: 'text-primary',
    title: 'Resultados reales',
    desc: 'Cada decisión que tomamos está orientada a que tus números cambien. Nada de promesas vacías, solo metodología comprobada y avalada por la ciencia.',
  },
  {
    icon: Heart,
    color: 'text-red-400',
    title: 'Bienestar integral',
    desc: 'El fitness es más que el gimnasio. Trabajamos cuerpo, mente y hábitos para construir un estilo de vida sostenible a largo plazo.',
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    title: 'Tecnología al servicio',
    desc: 'Usamos datos, gamificación y personalización inteligente para que tu experiencia sea única y efectiva desde el primer día.',
  },
  {
    icon: Users,
    color: 'text-accent',
    title: 'Comunidad primero',
    desc: 'El cambio es más fácil en compañía. Nuestros usuarios se motivan mutuamente para no rendirse nunca cuando más lo necesitan.',
  },
]

const trainerSocials: Record<string, { ig?: string }> = {
  'trainer-1': { ig: '@alexmartinez_fit' },
  'trainer-2': { ig: '@sofiareyes_hiit' },
  'trainer-3': { ig: '@diegotorres_nutricion' },
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-end pb-20 pt-40 overflow-hidden">
        {/* Bg atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-accent/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />

        {/* Decorative large text in background */}
        <span className="absolute right-0 bottom-10 text-[22vw] font-black text-border/8 leading-none select-none pointer-events-none tracking-tight">
          FIT
        </span>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          >
            Nuestra historia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(3rem,7.5vw,7rem)] font-black leading-[0.9] tracking-tighter mb-10 max-w-5xl"
          >
            CREAMOS FITFORGE<br />
            PARA QUE{' '}
            <span className="text-gradient">NADIE</span><br />
            SE RINDA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg leading-relaxed max-w-md"
          >
            Somos entrenadores, nutricionistas y tecnólogos que creen que todos
            merecen acceso a una guía de calidad, sin importar su punto de partida.
          </motion.p>
        </div>
      </section>

      {/* ── STATS — large numbers, no cards ── */}
      <div className="border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="py-10 px-6 md:px-10"
              >
                <p className="text-4xl md:text-5xl font-black text-primary mb-2">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MISSION + TIMELINE ── */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 items-start">

            {/* Left: blockquote mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-8">Misión</p>

              <blockquote className="text-3xl md:text-[2.6rem] font-black leading-[1.1] tracking-tight mb-8">
                "El fitness de calidad
                no debería ser
                <span className="text-gradient"> un lujo."</span>
              </blockquote>

              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                FitForge nació para romper esa barrera. Ponemos la mejor guía fitness
                —metodología, nutrición y seguimiento— al alcance de todos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Combinamos ciencia del deporte con tecnología moderna para una
                experiencia que se adapta a ti, no al revés.
              </p>

              <Button asChild className="bg-primary hover:bg-primary/90 glow-primary rounded-full h-11 px-6 font-semibold">
                <Link to="/register">
                  Únete ahora <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Right: timeline as border rows */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-8">Historia</p>

              <div className="divide-y divide-border">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-8 py-8 group hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-4xl md:text-5xl font-black text-border group-hover:text-primary/30 transition-colors leading-none shrink-0 w-20 pt-1">
                      {m.year}
                    </span>
                    <div>
                      <h3 className="font-black text-xl mb-2 group-hover:text-primary transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES — border rows, no cards ── */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">Valores</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Lo que nos<br />
              <span className="text-muted-foreground font-normal">define.</span>
            </h2>
          </div>

          <div className="divide-y divide-border">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group grid grid-cols-[40px_1fr] md:grid-cols-[56px_260px_1fr] gap-6 md:gap-10 py-8 md:py-10 hover:pl-2 transition-all duration-300 cursor-default"
              >
                {/* Icon */}
                <v.icon className={`w-6 h-6 ${v.color} mt-1 shrink-0 group-hover:scale-110 transition-transform`} />

                {/* Value name */}
                <h3 className="text-xl md:text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                  {v.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm col-span-2 md:col-span-1 pl-12 md:pl-0">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM — editorial portrait style (same as landing) ── */}
      <section className="py-32 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">Equipo</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                Los mejores<br />
                <span className="text-muted-foreground font-normal">a tu lado.</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Entrenadores certificados con años de experiencia, comprometidos con tu resultado real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {mockTrainers.map((trainer, i) => {
              const socials = trainerSocials[trainer.id] ?? {}
              return (
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

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
                      {trainer.specialty}
                    </p>
                    <h3 className="text-2xl font-black">{trainer.name}</h3>

                    {/* Bio slides up on hover */}
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {trainer.bio}
                    </p>

                    {/* Social */}
                    {socials.ig && (
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Instagram className="w-3.5 h-3.5" />
                          {socials.ig}
                        </span>
                      </div>
                    )}

                    {/* Workouts count */}
                    <div className="mt-4 pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{trainer.workoutsCount}</span> entrenamientos creados
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — full-bleed ── */}
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
              ES TU<br />
              <span className="text-gradient">MOMENTO.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
              Miles de personas ya confiaron en nosotros para cambiar sus vidas.
              Ahora es tu turno.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow-primary h-12 px-8 rounded-full font-semibold">
                <Link to="/register">
                  Empezar ahora <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full border-border/60 font-semibold">
                <Link to="/features">Ver características</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

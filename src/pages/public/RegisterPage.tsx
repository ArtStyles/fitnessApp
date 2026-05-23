import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '@/src/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { SubscriptionTier } from '@/src/types'
import { mockPricingPlans } from '@/src/data/mockData'

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

function validateName(v: string): string | undefined {
  if (!v.trim()) return 'El nombre es obligatorio'
  if (v.trim().length < 2) return 'Mínimo 2 caracteres'
}

function validateEmail(v: string): string | undefined {
  if (!v) return 'El correo es obligatorio'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ingresa un correo válido'
}

function validatePassword(v: string): string | undefined {
  if (!v) return 'La contraseña es obligatoria'
  if (v.length < 8) return 'Mínimo 8 caracteres'
}

function getPasswordStrength(v: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!v) return { level: 0, label: '' }
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  if (score <= 1) return { level: 1, label: 'Débil' }
  if (score === 2) return { level: 2, label: 'Media' }
  return { level: 3, label: 'Fuerte' }
}

const strengthColors = ['', 'bg-destructive', 'bg-yellow-500', 'bg-green-500']
const strengthTextColors = ['', 'text-destructive', 'text-yellow-500', 'text-green-500']

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const initialPlan = (searchParams.get('plan') as SubscriptionTier) || 'basic'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(initialPlan)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = (field: keyof FormErrors, value: string): FormErrors => {
    const next = { ...errors }
    const validators = { name: validateName, email: validateEmail, password: validatePassword }
    const err = validators[field](value)
    if (err) next[field] = err
    else delete next[field]
    return next
  }

  const handleBlur = (field: keyof FormErrors, value: string) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(validate(field, value))
  }

  const handleChange = (field: keyof FormErrors, value: string) => {
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    if (touched[field]) setErrors(validate(field, value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true })
    const errs: FormErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    }
    const hasErrors = Object.values(errs).some(Boolean)
    if (hasErrors) { setErrors(errs); return }

    setIsLoading(true)
    try {
      const success = await register(name, email, password, selectedPlan)
      if (success) {
        toast.success('Cuenta creada exitosamente!')
        navigate('/dashboard')
      } else {
        toast.error('Error al crear la cuenta')
      }
    } catch {
      toast.error('Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200"
          alt="Gimnasio de fitness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Por qué unirte a FitForge?</h3>
            <ul className="space-y-3">
              {[
                'Entrenamientos diseñados por profesionales',
                'Planes de nutrición personalizados',
                'Comunidad activa y motivadora',
                'Seguimiento detallado de tu progreso'
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center" aria-hidden="true">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
            <p className="text-muted-foreground">Comienza tu transformación hoy mismo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  className={`pl-10 ${errors.name && touched.name ? 'border-destructive' : ''}`}
                  aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                  aria-invalid={!!(errors.name && touched.name)}
                />
              </div>
              {errors.name && touched.name && (
                <p id="name-error" className="text-xs text-destructive" role="alert">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  className={`pl-10 ${errors.email && touched.email ? 'border-destructive' : ''}`}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                  aria-invalid={!!(errors.email && touched.email)}
                />
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="text-xs text-destructive" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 caracteres"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  className={`pl-10 pr-10 ${errors.password && touched.password ? 'border-destructive' : ''}`}
                  aria-describedby="password-strength"
                  aria-invalid={!!(errors.password && touched.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" aria-hidden="true" />
                    : <Eye className="w-5 h-5" aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-xs text-destructive" role="alert">{errors.password}</p>
              )}
              {password && !errors.password && (
                <div id="password-strength" className="space-y-1" aria-live="polite">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.level ? strengthColors[passwordStrength.level] : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${strengthTextColors[passwordStrength.level]}`}>
                    Contraseña {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Plan Selection */}
            <div className="space-y-3">
              <Label>Selecciona tu plan</Label>
              <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Plan de suscripción">
                {mockPricingPlans.map((plan) => (
                  <button
                    key={plan.tier}
                    type="button"
                    role="radio"
                    aria-checked={selectedPlan === plan.tier}
                    onClick={() => setSelectedPlan(plan.tier)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      selectedPlan === plan.tier
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold text-sm">{plan.name}</p>
                    <p className="text-lg font-bold">${plan.price}</p>
                    <p className="text-xs text-muted-foreground">/mes</p>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Al crear una cuenta, aceptas nuestros{' '}
            <Link to="/terms" className="text-primary hover:underline">Términos de Servicio</Link>
            {' '}y{' '}
            <Link to="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

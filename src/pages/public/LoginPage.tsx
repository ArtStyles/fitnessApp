import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '@/src/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface FormErrors {
  email?: string
  password?: string
}

function validateEmail(email: string): string | undefined {
  if (!email) return 'El correo es obligatorio'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo válido'
}

function validatePassword(password: string): string | undefined {
  if (!password) return 'La contraseña es obligatoria'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = (field: 'email' | 'password', value: string): FormErrors => {
    const next = { ...errors }
    if (field === 'email') {
      const err = validateEmail(value)
      if (err) next.email = err
      else delete next.email
    }
    if (field === 'password') {
      const err = validatePassword(value)
      if (err) next.password = err
      else delete next.password
    }
    return next
  }

  const handleBlur = (field: 'email' | 'password', value: string) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(validate(field, value))
  }

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    if (touched[field]) setErrors(validate(field, value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr })
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Bienvenido de vuelta!')
        navigate('/dashboard')
      } else {
        toast.error('Credenciales inválidas')
      }
    } catch {
      toast.error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Logo — back to home */}
        <Link to="/" className="absolute top-6 left-8 flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-primary-foreground font-bold text-lg leading-none">F</span>
          </div>
          <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">FitForge</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Bienvenido de vuelta</h1>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  className={`pl-10 pr-10 ${errors.password && touched.password ? 'border-destructive' : ''}`}
                  aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
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
                <p id="password-error" className="text-xs text-destructive" role="alert">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              No tienes una cuenta?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Regístrate
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-xl bg-card border border-border">
            <p className="text-sm font-medium mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Usuario: <span className="text-foreground">user@fitforge.com</span></p>
              <p>Admin: <span className="text-foreground">admin@fitforge.com</span></p>
              <p>Contraseña: <span className="text-foreground">cualquiera</span></p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200"
          alt="Entrenamiento de fitness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <blockquote className="glass rounded-xl p-6">
            <p className="text-lg mb-4">
              {`"FitForge me ayudó a perder 20kg en 6 meses. La combinación de entrenamientos y nutrición es perfecta."`}
            </p>
            <footer className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Foto de Carlos López"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">Carlos López</p>
                <p className="text-sm text-muted-foreground">Miembro Premium</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

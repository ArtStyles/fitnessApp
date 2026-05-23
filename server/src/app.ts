import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import { errorMiddleware } from './middleware/error.middleware'

// Routes
import authRoutes from './modules/auth/auth.routes'
import usersRoutes from './modules/users/users.routes'
import exercisesRoutes from './modules/exercises/exercises.routes'
import workoutsRoutes from './modules/workouts/workouts.routes'
import trainingPlansRoutes from './modules/training-plans/training-plans.routes'
import nutritionRoutes from './modules/nutrition/nutrition.routes'
import progressRoutes from './modules/progress/progress.routes'
import gamificationRoutes from './modules/gamification/gamification.routes'
import notificationsRoutes from './modules/notifications/notifications.routes'

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  env.CORS_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean)

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin '${origin}' not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,   // cache preflight 24 h
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))   // handle all preflight requests

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true }))

// Parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression() as any)

// Logging
if (!env.isProd) app.use(morgan('dev'))
else app.use(morgan('combined'))

// Static files for uploads
app.use('/uploads', express.static(env.UPLOAD_DIR))

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/exercises', exercisesRoutes)
app.use('/api/v1/workouts', workoutsRoutes)
app.use('/api/v1/training-plans', trainingPlansRoutes)
app.use('/api/v1/nutrition', nutritionRoutes)
app.use('/api/v1/progress', progressRoutes)
app.use('/api/v1/gamification', gamificationRoutes)
app.use('/api/v1/notifications', notificationsRoutes)

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// Global error handler
app.use(errorMiddleware)

export default app

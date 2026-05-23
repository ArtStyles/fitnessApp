import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { registerSchema, loginSchema, onboardingSchema } from './auth.schema'
import * as ctrl from './auth.controller'

const router = Router()

router.post('/register', validate(registerSchema), asyncHandler(ctrl.register))
router.post('/login', validate(loginSchema), asyncHandler(ctrl.login))
router.post('/refresh', asyncHandler(ctrl.refresh))
router.post('/logout', asyncHandler(ctrl.logout))
router.get('/me', authenticate, asyncHandler(ctrl.getMe))
router.post('/onboarding', authenticate, validate(onboardingSchema), asyncHandler(ctrl.saveOnboarding))

export default router

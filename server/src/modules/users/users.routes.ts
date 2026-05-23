import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { requireAdmin } from '../../middleware/admin.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { updateProfileSchema, updateSubscriptionSchema } from './users.schema'
import * as ctrl from './users.controller'

const router = Router()

router.get('/me', authenticate, asyncHandler(ctrl.getMe))
router.patch('/me', authenticate, validate(updateProfileSchema), asyncHandler(ctrl.updateMe))
router.get('/me/stats', authenticate, asyncHandler(ctrl.getUserStats))

// Admin routes
router.get('/', authenticate, requireAdmin, asyncHandler(ctrl.listUsers))
router.get('/:id', authenticate, requireAdmin, asyncHandler(ctrl.getUserById))
router.patch('/:id/subscription', authenticate, requireAdmin, validate(updateSubscriptionSchema), asyncHandler(ctrl.updateSubscription))
router.delete('/:id', authenticate, requireAdmin, asyncHandler(ctrl.deleteUser))

export default router

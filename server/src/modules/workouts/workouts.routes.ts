import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { requireAdmin } from '../../middleware/admin.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { createWorkoutSchema, updateWorkoutSchema } from './workouts.schema'
import * as ctrl from './workouts.controller'

const router = Router()

router.get('/history', authenticate, asyncHandler(ctrl.getUserHistory))
router.get('/', authenticate, asyncHandler(ctrl.listWorkouts))
router.get('/:id', authenticate, asyncHandler(ctrl.getWorkoutById))
router.post('/', authenticate, requireAdmin, validate(createWorkoutSchema), asyncHandler(ctrl.createWorkout))
router.patch('/:id', authenticate, requireAdmin, validate(updateWorkoutSchema), asyncHandler(ctrl.updateWorkout))
router.delete('/:id', authenticate, requireAdmin, asyncHandler(ctrl.deleteWorkout))
router.post('/:id/sessions', authenticate, asyncHandler(ctrl.startSession))
router.patch('/sessions/:sessionId/complete', authenticate, asyncHandler(ctrl.completeSession))

export default router

import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { requireAdmin } from '../../middleware/admin.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { createExerciseSchema, updateExerciseSchema } from './exercises.schema'
import * as ctrl from './exercises.controller'

const router = Router()

router.get('/', asyncHandler(ctrl.listExercises))
router.get('/:id', asyncHandler(ctrl.getExerciseById))
router.post('/', authenticate, requireAdmin, validate(createExerciseSchema), asyncHandler(ctrl.createExercise))
router.patch('/:id', authenticate, requireAdmin, validate(updateExerciseSchema), asyncHandler(ctrl.updateExercise))
router.delete('/:id', authenticate, requireAdmin, asyncHandler(ctrl.deleteExercise))

export default router

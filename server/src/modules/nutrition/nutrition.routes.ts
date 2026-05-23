import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { requireAdmin } from '../../middleware/admin.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { createMealPlanSchema, updateMealPlanSchema } from './nutrition.schema'
import * as ctrl from './nutrition.controller'

const router = Router()

router.get('/', authenticate, asyncHandler(ctrl.listMealPlans))
router.get('/:id', authenticate, asyncHandler(ctrl.getMealPlanById))
router.post('/', authenticate, requireAdmin, validate(createMealPlanSchema), asyncHandler(ctrl.createMealPlan))
router.patch('/:id', authenticate, requireAdmin, validate(updateMealPlanSchema), asyncHandler(ctrl.updateMealPlan))
router.delete('/:id', authenticate, requireAdmin, asyncHandler(ctrl.deleteMealPlan))

export default router

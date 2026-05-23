import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { requireAdmin } from '../../middleware/admin.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { createPlanSchema, updatePlanSchema } from './training-plans.schema'
import * as ctrl from './training-plans.controller'

const router = Router()

router.get('/my-enrollments', authenticate, asyncHandler(ctrl.getMyEnrollments))
router.get('/active-enrollment', authenticate, asyncHandler(ctrl.getActiveEnrollment))
router.get('/', authenticate, asyncHandler(ctrl.listPlans))
router.get('/:id', authenticate, asyncHandler(ctrl.getPlanById))
router.post('/', authenticate, requireAdmin, validate(createPlanSchema), asyncHandler(ctrl.createPlan))
router.patch('/:id', authenticate, requireAdmin, validate(updatePlanSchema), asyncHandler(ctrl.updatePlan))
router.delete('/:id', authenticate, requireAdmin, asyncHandler(ctrl.deletePlan))

router.post('/:id/enroll', authenticate, asyncHandler(ctrl.enrollUser))
router.delete('/:id/enroll', authenticate, asyncHandler(ctrl.unenrollUser))
router.get('/:id/enrollment', authenticate, asyncHandler(ctrl.getEnrollment))
router.patch('/:id/enrollment/complete-day', authenticate, asyncHandler(ctrl.markDayComplete))

export default router

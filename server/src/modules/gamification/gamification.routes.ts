import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { requireAdmin } from '../../middleware/admin.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { createBadgeSchema, createChallengeSchema, updateChallengeSchema } from './gamification.schema'
import * as ctrl from './gamification.controller'

const router = Router()

router.get('/leaderboard', asyncHandler(ctrl.getLeaderboard))

router.get('/', authenticate, asyncHandler(ctrl.getUserGamification))
router.get('/badges', authenticate, asyncHandler(ctrl.listBadges))
router.get('/challenges', authenticate, asyncHandler(ctrl.listActiveChallenges))
router.post('/challenges/:id/join', authenticate, asyncHandler(ctrl.joinChallenge))

// Admin routes
router.post('/badges', authenticate, requireAdmin, validate(createBadgeSchema), asyncHandler(ctrl.createBadge))
router.post('/challenges', authenticate, requireAdmin, validate(createChallengeSchema), asyncHandler(ctrl.createChallenge))
router.patch('/challenges/:id', authenticate, requireAdmin, validate(updateChallengeSchema), asyncHandler(ctrl.updateChallenge))

export default router

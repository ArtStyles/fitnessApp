import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import * as ctrl from './notifications.controller'

const router = Router()

router.get('/', authenticate, asyncHandler(ctrl.getUserNotifications))
router.get('/unread-count', authenticate, asyncHandler(ctrl.getUnreadCount))
router.patch('/read-all', authenticate, asyncHandler(ctrl.markAllAsRead))
router.patch('/:id/read', authenticate, asyncHandler(ctrl.markAsRead))
router.delete('/:id', authenticate, asyncHandler(ctrl.deleteNotification))

export default router

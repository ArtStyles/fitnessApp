import { Response } from 'express'
import * as notificationsService from './notifications.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { notificationQuerySchema } from './notifications.schema'

export async function getUserNotifications(req: AuthRequest, res: Response) {
  const { page, limit, unreadOnly } = notificationQuerySchema.parse(req.query)
  const result = await notificationsService.getUserNotifications(req.user!.id, page, limit, unreadOnly)
  sendSuccess(res, result.notifications, 200, result.pagination)
}

export async function getUnreadCount(req: AuthRequest, res: Response) {
  const count = await notificationsService.getUnreadCount(req.user!.id)
  sendSuccess(res, { count })
}

export async function markAsRead(req: AuthRequest, res: Response) {
  const notification = await notificationsService.markAsRead(req.user!.id, req.params.id)
  sendSuccess(res, notification)
}

export async function markAllAsRead(req: AuthRequest, res: Response) {
  await notificationsService.markAllAsRead(req.user!.id)
  sendSuccess(res, { message: 'All notifications marked as read' })
}

export async function deleteNotification(req: AuthRequest, res: Response) {
  await notificationsService.deleteNotification(req.user!.id, req.params.id)
  sendSuccess(res, { message: 'Notification deleted' })
}

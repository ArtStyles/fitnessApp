import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'

export async function getUserNotifications(
  userId: string,
  page: number,
  limit: number,
  unreadOnly = false
) {
  const skip = (page - 1) * limit

  let query = supabase
    .from('Notification')
    .select('*', { count: 'exact' })
    .eq('userId', userId)
    .order('createdAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (unreadOnly) query = query.eq('isRead', false)

  const { data: notifications, count: total, error } = await query

  if (error) throw new AppError('Failed to fetch notifications', 500, 'DB_ERROR')

  return {
    notifications: notifications ?? [],
    pagination: { total: total ?? 0, page, limit, totalPages: Math.ceil((total ?? 0) / limit) },
  }
}

export async function getUnreadCount(userId: string) {
  const { count, error } = await supabase
    .from('Notification')
    .select('*', { count: 'exact', head: true })
    .eq('userId', userId)
    .eq('isRead', false)

  if (error) throw new AppError('Failed to get unread count', 500, 'DB_ERROR')
  return count ?? 0
}

export async function markAsRead(userId: string, notificationId: string) {
  const { data: notification } = await supabase
    .from('Notification')
    .select('id, userId')
    .eq('id', notificationId)
    .maybeSingle()

  if (!notification) throw new AppError('Notification not found', 404, 'NOT_FOUND')
  if (notification.userId !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN')

  const { data: updated, error } = await supabase
    .from('Notification')
    .update({ isRead: true })
    .eq('id', notificationId)
    .select('*')
    .single()

  if (error) throw new AppError('Failed to update notification', 500, 'DB_ERROR')
  return updated
}

export async function markAllAsRead(userId: string) {
  await supabase
    .from('Notification')
    .update({ isRead: true })
    .eq('userId', userId)
    .eq('isRead', false)
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string,
  data?: object
) {
  const { data: notification, error } = await supabase
    .from('Notification')
    .insert({
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      message,
      actionUrl: actionUrl ?? null,
      data: data ?? null,
    })
    .select('*')
    .single()

  if (error) throw new AppError('Failed to create notification', 500, 'DB_ERROR')
  return notification
}

export async function deleteNotification(userId: string, notificationId: string) {
  const { data: notification } = await supabase
    .from('Notification')
    .select('id, userId')
    .eq('id', notificationId)
    .maybeSingle()

  if (!notification) throw new AppError('Notification not found', 404, 'NOT_FOUND')
  if (notification.userId !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN')
  await supabase.from('Notification').delete().eq('id', notificationId)
}

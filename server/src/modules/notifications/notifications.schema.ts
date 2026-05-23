import { z } from 'zod'

export const notificationQuerySchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v) : 20)),
  unreadOnly: z.string().optional().transform(v => v === 'true'),
})

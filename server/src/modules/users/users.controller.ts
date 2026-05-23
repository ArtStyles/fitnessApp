import { Response } from 'express'
import * as usersService from './users.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'

export async function getMe(req: AuthRequest, res: Response) {
  const user = await usersService.getUserById(req.user!.id)
  sendSuccess(res, user)
}

export async function updateMe(req: AuthRequest, res: Response) {
  const user = await usersService.updateProfile(req.user!.id, req.body)
  sendSuccess(res, user)
}

export async function listUsers(req: AuthRequest, res: Response) {
  const { page = '1', limit = '20', search } = req.query as Record<string, string>
  const result = await usersService.listUsers(parseInt(page), parseInt(limit), search)
  sendSuccess(res, result.users, 200, result.pagination)
}

export async function getUserById(req: AuthRequest, res: Response) {
  const user = await usersService.getUserById(req.params.id)
  sendSuccess(res, user)
}

export async function updateSubscription(req: AuthRequest, res: Response) {
  const user = await usersService.updateSubscription(req.params.id, req.body)
  sendSuccess(res, user)
}

export async function deleteUser(req: AuthRequest, res: Response) {
  await usersService.deleteUser(req.params.id)
  sendSuccess(res, { message: 'User deleted successfully' })
}

export async function getUserStats(req: AuthRequest, res: Response) {
  const stats = await usersService.getUserStats(req.user!.id)
  sendSuccess(res, stats)
}

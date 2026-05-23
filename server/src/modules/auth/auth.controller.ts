import { Request, Response } from 'express'
import * as authService from './auth.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { AppError } from '../../shared/AppError'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body)
  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
  sendSuccess(
    res,
    { user: result.user, accessToken: result.accessToken },
    201
  )
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body)
  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
  sendSuccess(res, { user: result.user, accessToken: result.accessToken })
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken
  if (!token) throw new AppError('No refresh token provided', 401, 'UNAUTHORIZED')

  const result = await authService.refreshTokens(token)
  res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
  sendSuccess(res, { accessToken: result.accessToken })
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken
  if (token) await authService.logout(token)
  res.clearCookie('refreshToken', { path: '/' })
  sendSuccess(res, { message: 'Logged out successfully' })
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await authService.getMe(req.user!.id)
  sendSuccess(res, user)
}

export async function saveOnboarding(req: AuthRequest, res: Response) {
  const profile = await authService.saveOnboarding(req.user!.id, req.body)
  sendSuccess(res, profile)
}

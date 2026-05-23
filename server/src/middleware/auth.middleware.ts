import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../shared/AppError'
import { supabase } from '../config/database'

export interface AuthRequest extends Request {
  user?: { id: string; role: string; subscriptionTier: string }
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) throw new AppError('No token provided', 401, 'UNAUTHORIZED')

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as any

    const { data: user, error } = await supabase
      .from('User')
      .select('id, role, subscriptionTier')
      .eq('id', payload.sub)
      .single()

    if (error || !user) throw new AppError('User not found', 401, 'UNAUTHORIZED')

    req.user = { id: user.id, role: user.role, subscriptionTier: user.subscriptionTier }
    next()
  } catch (err) {
    if (err instanceof AppError) return next(err)
    next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'))
  }
}

import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'
import { AppError } from '../shared/AppError'

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') return next(new AppError('Admin access required', 403, 'FORBIDDEN'))
  next()
}

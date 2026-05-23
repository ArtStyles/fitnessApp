import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'
import { AppError } from '../shared/AppError'

const tierOrder = { basic: 0, premium: 1, vip: 2 }

export const requireSubscription = (minTier: 'basic' | 'premium' | 'vip') =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userTier = req.user?.subscriptionTier as keyof typeof tierOrder
    if (tierOrder[userTier] < tierOrder[minTier]) {
      return next(new AppError(`This content requires ${minTier} subscription or higher`, 403, 'SUBSCRIPTION_REQUIRED'))
    }
    next()
  }

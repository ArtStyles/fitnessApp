import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../shared/AppError'
import { env } from '../config/env'

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message, code: err.code })
    return
  }
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    })
    return
  }
  // Prisma unique constraint
  if ((err as any).code === 'P2002') {
    res.status(409).json({ success: false, message: 'Resource already exists' })
    return
  }
  // Prisma not found
  if ((err as any).code === 'P2025') {
    res.status(404).json({ success: false, message: 'Resource not found' })
    return
  }
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.isDev && { stack: err.stack }),
  })
}

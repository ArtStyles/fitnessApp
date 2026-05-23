import { Response } from 'express'

export const sendSuccess = (res: Response, data: unknown, statusCode = 200, meta?: object) => {
  res.status(statusCode).json({ success: true, data, ...(meta && { meta }) })
}

export const sendError = (res: Response, message: string, statusCode = 500, errors?: object) => {
  res.status(statusCode).json({ success: false, message, ...(errors ? { errors } : {}) })
}

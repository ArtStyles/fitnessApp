import { Response } from 'express'
import path from 'path'
import * as progressService from './progress.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { progressQuerySchema } from './progress.schema'
import { AppError } from '../../shared/AppError'

export async function getUserProgress(req: AuthRequest, res: Response) {
  const filters = progressQuerySchema.parse(req.query)
  const result = await progressService.getUserProgress(req.user!.id, filters)
  sendSuccess(res, result.entries, 200, result.pagination)
}

export async function createEntry(req: AuthRequest, res: Response) {
  const entry = await progressService.createEntry(req.user!.id, req.body)
  sendSuccess(res, entry, 201)
}

export async function updateEntry(req: AuthRequest, res: Response) {
  const entry = await progressService.updateEntry(req.user!.id, req.params.id, req.body)
  sendSuccess(res, entry)
}

export async function deleteEntry(req: AuthRequest, res: Response) {
  await progressService.deleteEntry(req.user!.id, req.params.id)
  sendSuccess(res, { message: 'Entry deleted successfully' })
}

export async function getProgressStats(req: AuthRequest, res: Response) {
  const stats = await progressService.getStats(req.user!.id)
  sendSuccess(res, stats)
}

export async function uploadPhoto(req: AuthRequest, res: Response) {
  if (!req.file) throw new AppError('No file uploaded', 400, 'NO_FILE')

  const photoUrl = `/uploads/${req.file.filename}`
  const entryId = req.body.entryId as string | undefined
  const photo = await progressService.uploadPhoto(req.user!.id, photoUrl, entryId)
  sendSuccess(res, photo, 201)
}

export async function getPhotos(req: AuthRequest, res: Response) {
  const photos = await progressService.getPhotos(req.user!.id)
  sendSuccess(res, photos)
}

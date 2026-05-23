import { Request, Response } from 'express'
import * as exercisesService from './exercises.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { exerciseQuerySchema } from './exercises.schema'

export async function listExercises(req: Request, res: Response) {
  const filters = exerciseQuerySchema.parse(req.query)
  const result = await exercisesService.listExercises(filters)
  sendSuccess(res, result.exercises, 200, result.pagination)
}

export async function getExerciseById(req: Request, res: Response) {
  const exercise = await exercisesService.getExerciseById(req.params.id)
  sendSuccess(res, exercise)
}

export async function createExercise(req: AuthRequest, res: Response) {
  const exercise = await exercisesService.createExercise(req.body, req.user!.id)
  sendSuccess(res, exercise, 201)
}

export async function updateExercise(req: AuthRequest, res: Response) {
  const exercise = await exercisesService.updateExercise(req.params.id, req.body)
  sendSuccess(res, exercise)
}

export async function deleteExercise(req: AuthRequest, res: Response) {
  await exercisesService.deleteExercise(req.params.id)
  sendSuccess(res, { message: 'Exercise deleted successfully' })
}

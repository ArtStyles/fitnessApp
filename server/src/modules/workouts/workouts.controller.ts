import { Response } from 'express'
import * as workoutsService from './workouts.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { workoutQuerySchema, completeWorkoutSchema } from './workouts.schema'

export async function listWorkouts(req: AuthRequest, res: Response) {
  const filters = workoutQuerySchema.parse(req.query)
  const result = await workoutsService.listWorkouts(req.user!.id, filters)
  sendSuccess(res, result.workouts, 200, result.pagination)
}

export async function getWorkoutById(req: AuthRequest, res: Response) {
  const workout = await workoutsService.getWorkoutById(req.params.id, req.user!.id)
  sendSuccess(res, workout)
}

export async function createWorkout(req: AuthRequest, res: Response) {
  const workout = await workoutsService.createWorkout(req.body, req.user!.id)
  sendSuccess(res, workout, 201)
}

export async function updateWorkout(req: AuthRequest, res: Response) {
  const workout = await workoutsService.updateWorkout(req.params.id, req.body)
  sendSuccess(res, workout)
}

export async function deleteWorkout(req: AuthRequest, res: Response) {
  await workoutsService.deleteWorkout(req.params.id)
  sendSuccess(res, { message: 'Workout deleted successfully' })
}

export async function startSession(req: AuthRequest, res: Response) {
  const session = await workoutsService.startSession(req.user!.id, req.params.id)
  sendSuccess(res, session, 201)
}

export async function completeSession(req: AuthRequest, res: Response) {
  const data = completeWorkoutSchema.parse(req.body)
  const session = await workoutsService.completeSession(req.user!.id, req.params.sessionId, data)
  sendSuccess(res, session)
}

export async function getUserHistory(req: AuthRequest, res: Response) {
  const page = parseInt((req.query.page as string) ?? '1')
  const limit = parseInt((req.query.limit as string) ?? '20')
  const result = await workoutsService.getUserHistory(req.user!.id, page, limit)
  sendSuccess(res, result.sessions, 200, result.pagination)
}

import { Response } from 'express'
import * as plansService from './training-plans.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { planQuerySchema, markDayCompleteSchema } from './training-plans.schema'

export async function listPlans(req: AuthRequest, res: Response) {
  const filters = planQuerySchema.parse(req.query)
  const result = await plansService.listPlans(req.user!.id, filters)
  sendSuccess(res, result.plans, 200, result.pagination)
}

export async function getPlanById(req: AuthRequest, res: Response) {
  const plan = await plansService.getPlanById(req.params.id, req.user!.id)
  sendSuccess(res, plan)
}

export async function createPlan(req: AuthRequest, res: Response) {
  const plan = await plansService.createPlan(req.body, req.user!.id)
  sendSuccess(res, plan, 201)
}

export async function updatePlan(req: AuthRequest, res: Response) {
  const plan = await plansService.updatePlan(req.params.id, req.body)
  sendSuccess(res, plan)
}

export async function deletePlan(req: AuthRequest, res: Response) {
  await plansService.deletePlan(req.params.id)
  sendSuccess(res, { message: 'Training plan deleted successfully' })
}

export async function enrollUser(req: AuthRequest, res: Response) {
  const enrollment = await plansService.enrollUser(req.user!.id, req.params.id)
  sendSuccess(res, enrollment, 201)
}

export async function unenrollUser(req: AuthRequest, res: Response) {
  await plansService.unenrollUser(req.user!.id, req.params.id)
  sendSuccess(res, { message: 'Unenrolled successfully' })
}

export async function getEnrollment(req: AuthRequest, res: Response) {
  const enrollment = await plansService.getEnrollment(req.user!.id, req.params.id)
  sendSuccess(res, enrollment)
}

export async function getMyEnrollments(req: AuthRequest, res: Response) {
  const enrollments = await plansService.getMyEnrollments(req.user!.id)
  sendSuccess(res, enrollments)
}

export async function getActiveEnrollment(req: AuthRequest, res: Response) {
  const enrollment = await plansService.getActiveEnrollment(req.user!.id)
  sendSuccess(res, enrollment)
}

export async function markDayComplete(req: AuthRequest, res: Response) {
  const data = markDayCompleteSchema.parse(req.body)
  const enrollment = await plansService.markDayComplete(req.user!.id, req.params.id, data)
  sendSuccess(res, enrollment)
}

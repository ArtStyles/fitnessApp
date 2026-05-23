import { Response } from 'express'
import * as nutritionService from './nutrition.service'
import { sendSuccess } from '../../shared/ApiResponse'
import { AuthRequest } from '../../middleware/auth.middleware'
import { nutritionQuerySchema } from './nutrition.schema'

export async function listMealPlans(req: AuthRequest, res: Response) {
  const filters = nutritionQuerySchema.parse(req.query)
  const result = await nutritionService.listMealPlans(req.user!.id, filters)
  sendSuccess(res, result.mealPlans, 200, result.pagination)
}

export async function getMealPlanById(req: AuthRequest, res: Response) {
  const mealPlan = await nutritionService.getMealPlanById(req.params.id, req.user!.id)
  sendSuccess(res, mealPlan)
}

export async function createMealPlan(req: AuthRequest, res: Response) {
  const mealPlan = await nutritionService.createMealPlan(req.body, req.user!.id)
  sendSuccess(res, mealPlan, 201)
}

export async function updateMealPlan(req: AuthRequest, res: Response) {
  const mealPlan = await nutritionService.updateMealPlan(req.params.id, req.body)
  sendSuccess(res, mealPlan)
}

export async function deleteMealPlan(req: AuthRequest, res: Response) {
  await nutritionService.deleteMealPlan(req.params.id)
  sendSuccess(res, { message: 'Meal plan deleted successfully' })
}

import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import { createMealPlanSchema, updateMealPlanSchema, nutritionQuerySchema } from './nutrition.schema'

const tierOrder: Record<string, number> = { basic: 0, premium: 1, vip: 2 }

function getAccessibleTiers(userTier: string): string[] {
  const level = tierOrder[userTier] ?? 0
  const tiers: string[] = ['basic']
  if (level >= 1) tiers.push('premium')
  if (level >= 2) tiers.push('vip')
  return tiers
}

export async function listMealPlans(userId: string, filters: z.infer<typeof nutritionQuerySchema>) {
  const { tier, search, page, limit } = filters
  const skip = (page - 1) * limit

  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  let query = supabase
    .from('MealPlan')
    .select(
      `*, meals:Meal(id, name, mealType, calories), mealCount:Meal(count)`,
      { count: 'exact' }
    )
    .in('tier', accessibleTiers)
    .order('createdAt', { ascending: false })
    .range(skip, skip + limit - 1)

  if (tier) query = query.eq('tier', tier)
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data: rawPlans, count: total, error } = await query

  if (error) throw new AppError('Failed to fetch meal plans', 500, 'DB_ERROR')

  const mealPlans = (rawPlans ?? []).map((p: any) => ({
    ...p,
    _count: { meals: p.mealCount?.[0]?.count ?? 0 },
    mealCount: undefined,
  }))

  return {
    mealPlans,
    pagination: { total: total ?? 0, page, limit, totalPages: Math.ceil((total ?? 0) / limit) },
  }
}

export async function getMealPlanById(id: string, userId: string) {
  const { data: userRow } = await supabase
    .from('User')
    .select('subscriptionTier')
    .eq('id', userId)
    .single()

  const accessibleTiers = getAccessibleTiers(userRow?.subscriptionTier ?? 'basic')

  const { data: mealPlan, error } = await supabase
    .from('MealPlan')
    .select(`*, meals:Meal(*), createdBy:User!MealPlan_createdById_fkey(id, name)`)
    .eq('id', id)
    .single()

  if (error || !mealPlan) throw new AppError('Meal plan not found', 404, 'NOT_FOUND')
  if (!accessibleTiers.includes(mealPlan.tier)) {
    throw new AppError(
      `This meal plan requires ${mealPlan.tier} subscription or higher`,
      403,
      'SUBSCRIPTION_REQUIRED'
    )
  }

  return mealPlan
}

export async function createMealPlan(data: z.infer<typeof createMealPlanSchema>, createdById: string) {
  const { meals, ...planData } = data
  const planId = crypto.randomUUID()
  const now = new Date().toISOString()

  const { error: planError } = await supabase.from('MealPlan').insert({
    id: planId,
    ...planData,
    createdById,
    updatedAt: now,
  })

  if (planError) throw new AppError('Failed to create meal plan', 500, 'DB_ERROR')

  if (meals.length > 0) {
    await supabase.from('Meal').insert(
      meals.map(meal => ({
        id: crypto.randomUUID(),
        mealPlanId: planId,
        ...meal,
      }))
    )
  }

  const { data: mealPlan } = await supabase
    .from('MealPlan')
    .select('*, meals:Meal(*)')
    .eq('id', planId)
    .single()

  return mealPlan
}

export async function updateMealPlan(id: string, data: z.infer<typeof updateMealPlanSchema>) {
  const { data: existing } = await supabase
    .from('MealPlan')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Meal plan not found', 404, 'NOT_FOUND')

  const { meals, ...planData } = data

  if (meals !== undefined) {
    // Delete existing meals and recreate (CASCADE would handle it but let's be explicit)
    await supabase.from('Meal').delete().eq('mealPlanId', id)

    if (meals.length > 0) {
      await supabase.from('Meal').insert(
        meals.map(meal => ({
          id: crypto.randomUUID(),
          mealPlanId: id,
          ...meal,
        }))
      )
    }
  }

  if (Object.keys(planData).length > 0) {
    await supabase
      .from('MealPlan')
      .update({ ...planData, updatedAt: new Date().toISOString() })
      .eq('id', id)
  }

  const { data: mealPlan } = await supabase
    .from('MealPlan')
    .select('*, meals:Meal(*)')
    .eq('id', id)
    .single()

  return mealPlan
}

export async function deleteMealPlan(id: string) {
  const { data: existing } = await supabase
    .from('MealPlan')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!existing) throw new AppError('Meal plan not found', 404, 'NOT_FOUND')
  await supabase.from('MealPlan').delete().eq('id', id)
}

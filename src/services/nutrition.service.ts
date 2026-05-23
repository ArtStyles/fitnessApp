import { get, getList, post, put, del } from '@/src/lib/api'
import type { MealPlan } from '@/src/types'

function normMeal(m: any) {
  return {
    id:           m.id,
    name:         m.name,
    calories:     m.calories,
    protein:      m.protein,
    carbs:        m.carbs,
    fats:         m.fats,
    image:        m.imageUrl ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    ingredients:  m.ingredients ?? [],
    instructions: m.instructions ?? [],
  }
}

function normPlan(d: any): MealPlan {
  const meals = d.meals ?? []
  const breakfast = meals.find((m: any) => m.mealType === 'breakfast')
  const lunch     = meals.find((m: any) => m.mealType === 'lunch')
  const dinner    = meals.find((m: any) => m.mealType === 'dinner')
  const snacks    = meals.filter((m: any) => m.mealType === 'snack')

  return {
    id:          d.id,
    title:       d.title,
    description: d.description,
    tier:        d.tier,
    calories:    d.calories,
    meals: {
      breakfast: breakfast ? normMeal(breakfast) : normMeal({ id: 'bf', name: 'Desayuno', calories: 0, protein: 0, carbs: 0, fats: 0, imageUrl: null, ingredients: [], instructions: [] }),
      lunch:     lunch     ? normMeal(lunch)     : normMeal({ id: 'lu', name: 'Almuerzo',  calories: 0, protein: 0, carbs: 0, fats: 0, imageUrl: null, ingredients: [], instructions: [] }),
      dinner:    dinner    ? normMeal(dinner)    : normMeal({ id: 'di', name: 'Cena',     calories: 0, protein: 0, carbs: 0, fats: 0, imageUrl: null, ingredients: [], instructions: [] }),
      snacks:    snacks.map(normMeal),
    },
  }
}

export async function fetchMealPlans(filters: Record<string, any> = {}) {
  const { items, meta } = await getList<any>('/nutrition', filters)
  return { plans: items.map(normPlan), pagination: meta }
}

export async function fetchMealPlan(id: string): Promise<MealPlan> {
  return normPlan(await get<any>(`/nutrition/${id}`))
}

export async function adminCreateMealPlan(data: any): Promise<MealPlan> {
  return normPlan(await post<any>('/nutrition', data))
}

export async function adminUpdateMealPlan(id: string, data: any): Promise<MealPlan> {
  return normPlan(await put<any>(`/nutrition/${id}`, data))
}

export async function adminDeleteMealPlan(id: string): Promise<void> {
  await del(`/nutrition/${id}`)
}

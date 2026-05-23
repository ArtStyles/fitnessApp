import { supabase } from '../../config/database'
import { AppError } from '../../shared/AppError'
import { z } from 'zod'
import { createEntrySchema, updateEntrySchema, progressQuerySchema } from './progress.schema'

export async function getUserProgress(userId: string, filters: z.infer<typeof progressQuerySchema>) {
  const { startDate, endDate, page, limit } = filters
  const skip = (page - 1) * limit

  let query = supabase
    .from('ProgressEntry')
    .select(
      `*, measurements:BodyMeasurement(*), photos:ProgressPhoto(*)`,
      { count: 'exact' }
    )
    .eq('userId', userId)
    .order('date', { ascending: false })
    .range(skip, skip + limit - 1)

  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)

  const { data: entries, count: total, error } = await query

  if (error) throw new AppError('Failed to fetch progress', 500, 'DB_ERROR')

  return {
    entries: entries ?? [],
    pagination: { total: total ?? 0, page, limit, totalPages: Math.ceil((total ?? 0) / limit) },
  }
}

export async function createEntry(userId: string, data: z.infer<typeof createEntrySchema>) {
  const { measurements, date, ...entryData } = data
  const entryId = crypto.randomUUID()

  const { error: entryError } = await supabase.from('ProgressEntry').insert({
    id: entryId,
    userId,
    date,
    ...entryData,
  })

  if (entryError) throw new AppError('Failed to create progress entry', 500, 'DB_ERROR')

  // Create measurements
  if (measurements) {
    const measurementEntries: { id: string; progressEntryId: string; type: string; valueCm: number }[] = []
    for (const [key, value] of Object.entries(measurements)) {
      if (value !== undefined && value !== null) {
        measurementEntries.push({
          id: crypto.randomUUID(),
          progressEntryId: entryId,
          type: key,
          valueCm: value as number,
        })
      }
    }
    if (measurementEntries.length > 0) {
      await supabase.from('BodyMeasurement').insert(measurementEntries)
    }
  }

  const { data: entry } = await supabase
    .from('ProgressEntry')
    .select('*, measurements:BodyMeasurement(*), photos:ProgressPhoto(*)')
    .eq('id', entryId)
    .single()

  return entry
}

export async function updateEntry(userId: string, entryId: string, data: z.infer<typeof updateEntrySchema>) {
  const { data: entry } = await supabase
    .from('ProgressEntry')
    .select('id, userId')
    .eq('id', entryId)
    .maybeSingle()

  if (!entry) throw new AppError('Progress entry not found', 404, 'NOT_FOUND')
  if (entry.userId !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN')

  const { measurements, date, ...entryData } = data

  if (measurements !== undefined) {
    // Delete existing measurements and recreate
    await supabase.from('BodyMeasurement').delete().eq('progressEntryId', entryId)

    const measurementEntries: { id: string; progressEntryId: string; type: string; valueCm: number }[] = []
    for (const [key, value] of Object.entries(measurements ?? {})) {
      if (value !== undefined && value !== null) {
        measurementEntries.push({
          id: crypto.randomUUID(),
          progressEntryId: entryId,
          type: key,
          valueCm: value as number,
        })
      }
    }
    if (measurementEntries.length > 0) {
      await supabase.from('BodyMeasurement').insert(measurementEntries)
    }
  }

  await supabase
    .from('ProgressEntry')
    .update({ ...entryData, ...(date && { date }) })
    .eq('id', entryId)

  const { data: updated } = await supabase
    .from('ProgressEntry')
    .select('*, measurements:BodyMeasurement(*), photos:ProgressPhoto(*)')
    .eq('id', entryId)
    .single()

  return updated
}

export async function deleteEntry(userId: string, entryId: string) {
  const { data: entry } = await supabase
    .from('ProgressEntry')
    .select('id, userId')
    .eq('id', entryId)
    .maybeSingle()

  if (!entry) throw new AppError('Progress entry not found', 404, 'NOT_FOUND')
  if (entry.userId !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN')
  await supabase.from('ProgressEntry').delete().eq('id', entryId)
}

export async function uploadPhoto(userId: string, photoUrl: string, entryId?: string) {
  if (entryId) {
    const { data: entry } = await supabase
      .from('ProgressEntry')
      .select('id, userId')
      .eq('id', entryId)
      .maybeSingle()

    if (!entry) throw new AppError('Progress entry not found', 404, 'NOT_FOUND')
    if (entry.userId !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN')
  }

  const { data: photo, error } = await supabase
    .from('ProgressPhoto')
    .insert({
      id: crypto.randomUUID(),
      userId,
      photoUrl,
      progressEntryId: entryId ?? null,
    })
    .select('*')
    .single()

  if (error) throw new AppError('Failed to upload photo', 500, 'DB_ERROR')
  return photo
}

export async function getPhotos(userId: string) {
  const { data: photos, error } = await supabase
    .from('ProgressPhoto')
    .select('*, progressEntry:ProgressEntry(id, date, weightKg)')
    .eq('userId', userId)
    .order('takenAt', { ascending: false })

  if (error) throw new AppError('Failed to fetch photos', 500, 'DB_ERROR')
  return photos ?? []
}

export async function getStats(userId: string) {
  const [{ data: stats }, { data: firstEntry }, { data: latestEntry }] = await Promise.all([
    supabase.from('UserStats').select('*').eq('userId', userId).maybeSingle(),
    supabase
      .from('ProgressEntry')
      .select('date, weightKg')
      .eq('userId', userId)
      .not('weightKg', 'is', null)
      .order('date', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('ProgressEntry')
      .select('date, weightKg')
      .eq('userId', userId)
      .not('weightKg', 'is', null)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const weightChange =
    firstEntry?.weightKg && latestEntry?.weightKg
      ? latestEntry.weightKg - firstEntry.weightKg
      : null

  return {
    workoutsCompleted: stats?.workoutsCompleted ?? 0,
    totalMinutes: stats?.totalMinutes ?? 0,
    currentStreak: stats?.currentStreak ?? 0,
    longestStreak: stats?.longestStreak ?? 0,
    points: stats?.points ?? 0,
    level: stats?.level ?? 1,
    startingWeight: firstEntry?.weightKg ?? null,
    currentWeight: latestEntry?.weightKg ?? null,
    weightChange,
    lastWorkoutDate: stats?.lastWorkoutDate ?? null,
  }
}

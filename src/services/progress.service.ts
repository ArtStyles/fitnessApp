import { get, post, del } from '@/src/lib/api'
import type { ProgressEntry } from '@/src/types'

function norm(d: any): ProgressEntry {
  const meas: Record<string, number> = {}
  ;(d.measurements ?? []).forEach((m: any) => { meas[m.type] = m.valueCm })

  return {
    id:         d.id,
    date:       d.date,
    weight:     d.weightKg    ?? undefined,
    bodyFat:    d.bodyFatPct  ?? undefined,
    measurements: Object.keys(meas).length ? meas : undefined,
    notes:      d.notes       ?? undefined,
  }
}

export async function fetchProgress(): Promise<ProgressEntry[]> {
  const raw = await get<any>('/progress')
  // backend returns the array directly in data
  const list = Array.isArray(raw) ? raw : (raw.entries ?? [])
  return list.map(norm)
}

export interface ProgressInput {
  date:           string
  weightKg?:      number
  bodyFatPct?:    number
  notes?:         string
  measurements?:  { type: string; valueCm: number }[]
}

export async function createProgressEntry(data: ProgressInput): Promise<ProgressEntry> {
  return norm(await post<any>('/progress', data))
}

export async function deleteProgressEntry(id: string): Promise<void> {
  await del(`/progress/${id}`)
}

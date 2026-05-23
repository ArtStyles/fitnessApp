import type { ActivityDay } from '@/src/types'

interface ConsistencyHeatmapProps {
  days: ActivityDay[]
}

const DAYS_LABEL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function getColor(count: number) {
  if (count === 0) return 'bg-secondary'
  if (count === 1) return 'bg-primary/40'
  return 'bg-primary'
}

export function ConsistencyHeatmap({ days }: ConsistencyHeatmapProps) {
  // Pad so the grid starts on the right weekday
  const firstDay = days[0] ? new Date(days[0].date + 'T00:00:00').getDay() : 0
  const padded: (ActivityDay | null)[] = [...Array(firstDay).fill(null), ...days]

  const weeks: (ActivityDay | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  const totalActive = days.filter(d => d.count > 0).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Últimos 6 meses</span>
        <span className="font-medium">{totalActive} días activos</span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-fit">
          {/* Day labels column */}
          <div className="flex flex-col gap-1 pt-5">
            {DAYS_LABEL.map(d => (
              <div key={d} className="h-3 w-6 text-[10px] text-muted-foreground flex items-center">
                {['Lun', 'Mié', 'Vie'].includes(d) ? d : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {/* Month label on top of first week of month */}
              <div className="h-4 text-[10px] text-muted-foreground">
                {week[0] && new Date(week[0].date + 'T00:00:00').getDate() <= 7
                  ? new Date(week[0].date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' })
                  : ''}
              </div>
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day ? `${day.date}: ${day.count} entrenamiento(s)` : ''}
                  className={`w-3 h-3 rounded-sm transition-colors ${day ? getColor(day.count) : 'bg-transparent'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Menos</span>
        <div className="flex gap-1">
          {['bg-secondary', 'bg-primary/40', 'bg-primary'].map(c => (
            <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
        </div>
        <span>Más</span>
      </div>
    </div>
  )
}

import { Loader2, AlertTriangle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AsyncStateProps {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: React.ReactNode
}

export function AsyncState({
  loading,
  error,
  empty,
  emptyMessage = 'No hay datos disponibles',
  onRetry,
  children,
}: AsyncStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center p-6">
        <AlertTriangle className="w-10 h-10 text-destructive" />
        <p className="text-muted-foreground text-sm">{error}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center p-6">
        <Inbox className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}

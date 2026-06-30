import { lazy, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

// Lazy-load the Leaflet map so it (and Leaflet itself) stay out of the initial
// bundle. A skeleton mirrors the map's footprint to avoid layout shift.
const WeatherMap = lazy(() => import('./WeatherMap'))

function MapFallback() {
  return (
    <div className="grid h-full w-full place-items-center bg-muted">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export function MapCard({ className, rounded = true, height = 'h-[320px]' }) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-0',
        rounded ? 'rounded-lg' : 'rounded-none border-0',
        height,
        className
      )}
    >
      <Suspense fallback={<MapFallback />}>
        <WeatherMap className="h-full w-full" />
      </Suspense>
    </Card>
  )
}

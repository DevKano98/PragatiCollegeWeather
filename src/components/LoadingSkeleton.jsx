import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Full-page shimmer that mirrors the Home layout so there's no layout shift
// when real data arrives.
export function HomeSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-20 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-28 w-28 rounded-2xl" />
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="mb-3 h-4 w-20" />
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hourly */}
      <Card>
        <CardContent className="p-5">
          <Skeleton className="mb-4 h-4 w-28" />
          <div className="flex gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-16 shrink-0 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily */}
      <Card>
        <CardContent className="space-y-3 p-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

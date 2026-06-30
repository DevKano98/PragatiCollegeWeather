import { cn } from '@/utils/cn'

// Shimmer skeleton block. Uses an overlay sweep instead of pulse so it reads
// as a premium loading state and mirrors real layout (no layout shift).
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/60 to-transparent" />
    </div>
  )
}

export { Skeleton }

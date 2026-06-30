import { motion } from 'framer-motion'
import {
  CloudOff,
  WifiOff,
  SearchX,
  MapPinOff,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Friendly empty/error states. `variant` picks the icon + copy; pass `onRetry`
// to show a Retry button, or `action` for a custom CTA.
const VARIANTS = {
  offline: {
    Icon: WifiOff,
    title: "You're offline",
    desc: 'Check your connection and try again.',
  },
  network: {
    Icon: CloudOff,
    title: 'Network error',
    desc: "We couldn't reach the weather service.",
  },
  api: {
    Icon: AlertTriangle,
    title: 'Something went wrong',
    desc: "We couldn't load the weather just now.",
  },
  notfound: {
    Icon: SearchX,
    title: 'No matches',
    desc: 'Try a different city name.',
  },
  denied: {
    Icon: MapPinOff,
    title: 'Location unavailable',
    desc: 'Search for a city to see its weather.',
  },
  empty: {
    Icon: SearchX,
    title: 'Nothing here yet',
    desc: '',
  },
}

export function StateView({
  variant = 'api',
  title,
  desc,
  onRetry,
  action,
  className = '',
}) {
  const v = VARIANTS[variant] || VARIANTS.api
  const Icon = v.Icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold">{title || v.title}</h3>
      {(desc || v.desc) && (
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {desc || v.desc}
        </p>
      )}
      {onRetry && (
        <Button onClick={onRetry} className="mt-5" size="sm">
          Try again
        </Button>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/utils/cn'

// A single metric tile: icon, label, big value, optional sub-line.
export function WeatherMetricCard({ Icon, label, value, sub, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Card
        className={cn(
          'h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift'
        )}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          {Icon && <Icon className="h-4 w-4" />}
          <span className="text-xs font-medium uppercase tracking-wide">
            {label}
          </span>
        </div>
        <p className="tabnum mt-3 text-2xl font-semibold tracking-tight">
          {value}
        </p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </Card>
    </motion.div>
  )
}

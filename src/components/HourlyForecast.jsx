import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeatherIcon } from './WeatherIcon'
import { useWeather } from '@/context/WeatherContext'
import { useSettings } from '@/hooks/useSettings'
import { getNextHours } from '@/utils/forecast'
import { formatHour } from '@/utils/datetime'
import { formatTemp, formatPercent, formatWind } from '@/utils/format'

// Next 24h horizontal scroller. Scrolls INTERNALLY — the card has min-w-0 and
// the track uses overflow-x-auto so it never widens the page on mobile.
export function HourlyForecast() {
  const { bundle } = useWeather()
  const { settings } = useSettings()

  const hours = useMemo(
    () => getNextHours(bundle?.hourly, 24),
    [bundle?.hourly]
  )

  if (!hours.length) return null
  const tz = bundle.timezone

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Hourly · Next 24 hours</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-4">
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {hours.map((h, i) => (
            <motion.div
              key={h.dt}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.5) }}
              className="flex w-[72px] shrink-0 flex-col items-center gap-2 rounded-xl border border-border bg-background/40 px-2 py-3"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {i === 0 ? 'Now' : formatHour(h.dt, tz)}
              </span>
              <WeatherIcon icon={h.icon} className="h-7 w-7" />
              <span className="tabnum text-base font-semibold">
                {formatTemp(h.temp, settings.tempUnit)}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-sky-500">
                <Droplets className="h-3 w-3" />
                <span className="tabnum">{formatPercent(h.pop ?? 0)}</span>
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Wind className="h-3 w-3" />
                <span className="tabnum">
                  {formatWind(h.windSpeed, settings.windUnit)}
                </span>
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { useMemo } from 'react'
import { Droplets, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeatherIcon } from './WeatherIcon'
import { useWeather } from '@/context/WeatherContext'
import { useSettings } from '@/hooks/useSettings'
import { getDailyTempRange, rangeBarMetrics } from '@/utils/forecast'
import { formatTemp, formatPercent, formatWind } from '@/utils/format'
import { formatWeekday } from '@/utils/datetime'

// 7-day forecast. Each row carries a temperature-range bar drawn on a single
// shared scale (min/max across the whole week) so rows are visually comparable.
export function WeeklyForecast() {
  const { bundle } = useWeather()
  const { settings } = useSettings()

  const daily = bundle?.daily || []
  const range = useMemo(() => getDailyTempRange(daily), [daily])

  if (!daily.length) return null
  const tz = bundle.timezone

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {daily.map((d, i) => {
          const bar = rangeBarMetrics(d, range.min, range.max)
          return (
            <div
              key={d.dt}
              className="grid grid-cols-[2.6rem_1.75rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted sm:grid-cols-[3.5rem_2rem_5.5rem_1fr_auto]"
            >
              <span className="text-sm font-medium">
                {i === 0 ? 'Today' : formatWeekday(d.dt, tz)}
              </span>

              <WeatherIcon icon={d.icon} className="h-5 w-5" />

              {/* Humidity / wind — hidden on the narrowest layout. */}
              <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-sky-500" />
                  <span className="tabnum">{formatPercent(d.pop ?? 0)}</span>
                </span>
              </div>

              {/* Shared-scale range bar */}
              <div className="flex items-center gap-2">
                <span className="tabnum w-8 text-right text-sm text-muted-foreground">
                  {formatTemp(d.tempMin, settings.tempUnit)}
                </span>
                <div className="relative h-1.5 flex-1 rounded-full bg-muted">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                  />
                </div>
                <span className="tabnum w-8 text-sm font-medium">
                  {formatTemp(d.tempMax, settings.tempUnit)}
                </span>
              </div>

              {/* Wind on the far right (wide layouts only). */}
              <span className="hidden items-center gap-1 text-xs text-muted-foreground lg:flex">
                <Wind className="h-3 w-3" />
                <span className="tabnum">
                  {formatWind(d.windMax, settings.windUnit)}
                </span>
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

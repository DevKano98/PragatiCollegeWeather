import { motion } from 'framer-motion'
import { Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeather } from '@/context/WeatherContext'
import { AQI_LEVELS, POLLUTANTS } from '@/constants'
import { cn } from '@/utils/cn'

// Air-quality summary: a 1–5 band gauge + the six key pollutants.
export function AQICard() {
  const { bundle } = useWeather()
  const air = bundle?.air

  if (!air || air.aqi == null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            Air quality data unavailable for this location.
          </p>
        </CardContent>
      </Card>
    )
  }

  const level = AQI_LEVELS[air.aqi]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'grid h-14 w-14 shrink-0 place-items-center rounded-full text-xl font-bold text-white tabnum',
              level.bg
            )}
          >
            {air.aqi}
          </div>
          <div className="min-w-0">
            <p className={cn('text-lg font-semibold', level.color)}>
              {level.label}
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="h-3.5 w-3.5" />
              US AQI <span className="tabnum">{Math.round(air.usAqi)}</span>
            </p>
          </div>
        </div>

        {/* Band scale */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((b) => (
            <motion.div
              key={b}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: b === air.aqi ? 1 : 0.3 }}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                AQI_LEVELS[b].bg
              )}
            />
          ))}
        </div>

        {/* Pollutants */}
        <div className="grid grid-cols-3 gap-3">
          {POLLUTANTS.map((p) => (
            <div key={p.key} className="rounded-lg bg-muted/60 p-2.5">
              <p className="text-xs text-muted-foreground">{p.label}</p>
              <p className="tabnum text-sm font-semibold">
                {air[p.key] != null ? Math.round(air[p.key]) : '—'}
              </p>
              <p className="text-[10px] text-muted-foreground">{p.unit}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

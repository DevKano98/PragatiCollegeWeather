import { useMemo } from 'react'
import {
  Droplets,
  Gauge,
  Eye,
  Wind,
  Cloud,
  Sun,
  Thermometer,
  Compass,
} from 'lucide-react'
import { WeatherMetricCard } from './WeatherMetricCard'
import { useWeather } from '@/context/WeatherContext'
import { useSettings } from '@/hooks/useSettings'
import {
  formatTemp,
  formatPercent,
  formatPressure,
  formatVisibility,
  formatWind,
  windDirection,
  formatUV,
  uvLabel,
} from '@/utils/format'

// Grid of secondary current-condition metrics.
export function WeatherMetrics() {
  const { bundle } = useWeather()
  const { settings } = useSettings()

  const metrics = useMemo(() => {
    if (!bundle) return []
    const c = bundle.current
    return [
      {
        Icon: Thermometer,
        label: 'Feels Like',
        value: formatTemp(c.feelsLike, settings.tempUnit),
      },
      {
        Icon: Droplets,
        label: 'Humidity',
        value: formatPercent(c.humidity),
      },
      {
        Icon: Wind,
        label: 'Wind',
        value: formatWind(c.windSpeed, settings.windUnit),
        sub: windDirection(c.windDeg)
          ? `${windDirection(c.windDeg)} · ${Math.round(c.windDeg)}°`
          : undefined,
      },
      {
        Icon: Compass,
        label: 'Direction',
        value: windDirection(c.windDeg) || '—',
        sub: c.windDeg != null ? `${Math.round(c.windDeg)}°` : undefined,
      },
      {
        Icon: Gauge,
        label: 'Pressure',
        value: formatPressure(c.pressure),
      },
      {
        Icon: Eye,
        label: 'Visibility',
        value: formatVisibility(c.visibility),
      },
      {
        Icon: Cloud,
        label: 'Cloud Cover',
        value: formatPercent(c.cloudCover),
      },
      {
        Icon: Sun,
        label: 'UV Index',
        value: formatUV(c.uv),
        sub: uvLabel(c.uv),
      },
    ]
  }, [bundle, settings])

  if (!metrics.length) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <WeatherMetricCard key={m.label} index={i} {...m} />
      ))}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CurrentWeatherCard } from '@/components/CurrentWeatherCard'
import { WeatherMetrics } from '@/components/WeatherMetrics'
import { HourlyForecast } from '@/components/HourlyForecast'
import { WeeklyForecast } from '@/components/WeeklyForecast'
import { AQICard } from '@/components/AQICard'
import { MapCard } from '@/components/MapCard'
import { HomeSkeleton } from '@/components/LoadingSkeleton'
import { StateView } from '@/components/StateView'
import { Button } from '@/components/ui/button'
import { useWeather } from '@/context/WeatherContext'

export default function Home() {
  const { status, bundle, error, refresh } = useWeather()
  const navigate = useNavigate()

  // First load (no data yet) → full shimmer skeleton, no spinner.
  if (status === 'loading' && !bundle) return <HomeSkeleton />

  if (status === 'error' && !bundle) {
    return <StateView variant={error || 'api'} onRetry={refresh} />
  }

  if (!bundle) return <HomeSkeleton />

  return (
    <div className="space-y-6">
      <CurrentWeatherCard />

      <WeatherMetrics />

      <HourlyForecast />

      {/* Daily takes the wide column; AQI + mini map stack beside it.
          Explicit base column (grid-cols-1) prevents mobile overflow. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <WeeklyForecast />
        </div>
        <div className="min-w-0 space-y-6">
          <AQICard />
          <div className="relative">
            <MapCard height="h-[260px]" />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/map')}
              className="absolute bottom-3 right-3 z-[500] shadow-soft"
            >
              Full map
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

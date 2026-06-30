import { MapPin } from 'lucide-react'
import { MapCard } from '@/components/MapCard'
import { AQICard } from '@/components/AQICard'
import { WeatherIcon } from '@/components/WeatherIcon'
import { Card, CardContent } from '@/components/ui/card'
import { useWeather } from '@/context/WeatherContext'
import { useSettings } from '@/hooks/useSettings'
import { formatTemp, placeLabel } from '@/utils/format'

export default function MapView() {
  const { location, bundle } = useWeather()
  const { settings } = useSettings()
  const current = bundle?.current

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Map</h1>
        <p className="text-sm text-muted-foreground">
          Tap anywhere on the map to load that location's weather.
        </p>
      </div>

      {/* Explicit base column → no mobile overflow. Map dominates on desktop. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <MapCard height="h-[420px] sm:h-[560px]" />
        </div>

        <div className="min-w-0 space-y-6">
          {current && location && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="min-w-0 truncate">
                    {placeLabel(location)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="tabnum text-5xl font-bold tracking-tighter">
                      {formatTemp(current.temp, settings.tempUnit)}
                    </p>
                    <p className="mt-1 text-sm capitalize text-muted-foreground">
                      {current.description}
                    </p>
                  </div>
                  <WeatherIcon
                    icon={current.icon}
                    className="h-20 w-20"
                    strokeWidth={1.5}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          <AQICard />
        </div>
      </div>
    </div>
  )
}

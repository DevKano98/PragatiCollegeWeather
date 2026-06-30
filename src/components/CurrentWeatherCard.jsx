import { motion } from 'framer-motion'
import {
  Star,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Sunrise,
  Sunset,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { WeatherIcon } from './WeatherIcon'
import { useWeather } from '@/context/WeatherContext'
import { useSettings } from '@/hooks/useSettings'
import { useFavorites } from '@/hooks/useFavorites'
import { formatTemp, placeLabel } from '@/utils/format'
import { formatLongDate, formatTime } from '@/utils/datetime'
import { cn } from '@/utils/cn'

export function CurrentWeatherCard() {
  const { location, bundle, refresh, status } = useWeather()
  const { settings } = useSettings()
  const { isFavorite, toggle } = useFavorites()

  if (!bundle || !location) return null
  const { current, daily, timezone } = bundle
  const today = daily?.[0]
  const fav = isFavorite(location)
  const unit = settings.tempUnit

  return (
    <Card className="overflow-hidden">
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: place, temp, condition */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="min-w-0 truncate font-medium text-foreground">
                {placeLabel(location)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatLongDate(current.dt, timezone)} ·{' '}
              {formatTime(current.dt, timezone)}
            </p>

            <div className="mt-5 flex items-end gap-2">
              <span className="tabnum text-7xl font-bold leading-none tracking-tighter sm:text-8xl">
                {formatTemp(current.temp, unit, false)}
              </span>
              <span className="mb-2 text-2xl font-medium text-muted-foreground">
                °{unit.toUpperCase()}
              </span>
            </div>

            <p className="mt-2 text-lg font-medium capitalize">
              {current.description}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Feels like {formatTemp(current.feelsLike, unit)}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <ArrowUp className="h-4 w-4 text-rose-500" />
                <span className="tabnum font-medium text-foreground">
                  {formatTemp(today?.tempMax, unit)}
                </span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <ArrowDown className="h-4 w-4 text-sky-500" />
                <span className="tabnum font-medium text-foreground">
                  {formatTemp(today?.tempMin, unit)}
                </span>
              </span>
              {today && (
                <>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Sunrise className="h-4 w-4 text-amber-500" />
                    <span className="tabnum">
                      {formatTime(today.sunrise, timezone)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Sunset className="h-4 w-4 text-orange-500" />
                    <span className="tabnum">
                      {formatTime(today.sunset, timezone)}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: big icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="shrink-0 self-start lg:self-center"
          >
            <WeatherIcon
              icon={current.icon}
              className="h-28 w-28 sm:h-36 sm:w-36"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        {/* Actions */}
        <div className="absolute right-5 top-5 flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={refresh}
                aria-label="Refresh"
              >
                <RefreshCw
                  className={cn(
                    'h-4 w-4',
                    status === 'loading' && 'animate-spin'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggle(location)}
                aria-label={fav ? 'Remove favorite' : 'Add favorite'}
              >
                <Star
                  className={cn(
                    'h-4 w-4 transition-colors',
                    fav && 'fill-amber-400 text-amber-400'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {fav ? 'Remove favorite' : 'Add to favorites'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}

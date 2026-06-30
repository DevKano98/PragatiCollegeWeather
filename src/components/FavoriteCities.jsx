import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WeatherIcon } from './WeatherIcon'
import { StateView } from './StateView'
import { useWeather } from '@/context/WeatherContext'
import { useFavorites, locationKey } from '@/hooks/useFavorites'
import { useSettings } from '@/hooks/useSettings'
import { getCurrentWeather } from '@/services/weather'
import { formatTemp } from '@/utils/format'

// One favorite card — fetches its own current weather snapshot.
function FavoriteCard({ loc, index }) {
  const navigate = useNavigate()
  const { selectLocation } = useWeather()
  const { remove } = useFavorites()
  const { settings } = useSettings()
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getCurrentWeather(loc.lat, loc.lon)
      .then((c) => alive && setCurrent(c))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [loc.lat, loc.lon])

  function open() {
    selectLocation(loc)
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Card className="group relative cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
        <button
          onClick={open}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold">{loc.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {[loc.admin1, loc.country].filter(Boolean).join(', ')}
            </p>
            {current && (
              <p className="mt-2 text-sm capitalize text-muted-foreground">
                {current.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : current ? (
              <>
                <WeatherIcon icon={current.icon} className="h-9 w-9" />
                <span className="tabnum mt-1 text-2xl font-bold">
                  {formatTemp(current.temp, settings.tempUnit)}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            remove(loc)
          }}
          className="absolute right-3 top-3 rounded-md p-1 text-amber-400 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
          aria-label="Remove favorite"
        >
          <Star className="h-4 w-4 fill-amber-400" />
        </button>
      </Card>
    </motion.div>
  )
}

export function FavoriteCities() {
  const { favorites } = useFavorites()

  if (!favorites.length) {
    return (
      <StateView
        variant="empty"
        title="No favorites yet"
        desc="Search for a city and tap the star to save it here for quick access."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((loc, i) => (
        <FavoriteCard key={locationKey(loc)} loc={loc} index={i} />
      ))}
    </div>
  )
}

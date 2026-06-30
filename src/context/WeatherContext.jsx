import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getWeatherBundle, reverseGeocode } from '@/services/weather'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGeolocation } from '@/hooks/useGeolocation'
import { STORAGE_KEYS, DEFAULT_LOCATION } from '@/constants'

/*
  The ONE piece of genuinely shared state: the active location + its weather
  bundle. Context is justified here because every route and the navbar read it.

  Stale-response guard: each load increments a monotonic request id; a resolved
  fetch only commits if its id still matches the latest one.
*/

const WeatherContext = createContext(null)

export function WeatherProvider({ children }) {
  const [location, setLocation] = useLocalStorage(
    STORAGE_KEYS.location,
    null // null on first ever visit → boot sequence decides
  )
  const [bundle, setBundle] = useState(null)
  const [status, setStatus] = useState('idle') // idle|loading|success|error
  const [error, setError] = useState(null)
  const { locate, locating } = useGeolocation()

  const requestId = useRef(0)
  const bootedRef = useRef(false)

  // Core loader — fetches the bundle for a location, guarding against stale
  // responses overwriting newer ones.
  const load = useCallback(
    async (loc) => {
      if (!loc) return
      const id = ++requestId.current
      setStatus('loading')
      setError(null)
      try {
        const data = await getWeatherBundle(loc.lat, loc.lon)
        if (id !== requestId.current) return // a newer request superseded us
        setBundle(data)
        setStatus('success')
      } catch (e) {
        if (id !== requestId.current) return
        setError(
          !navigator.onLine
            ? 'offline'
            : e?.message?.includes('Network')
              ? 'network'
              : 'api'
        )
        setStatus('error')
      }
    },
    []
  )

  // Public: switch to a known location object (from search / favorites / map).
  const selectLocation = useCallback(
    (loc) => {
      setLocation(loc)
      load(loc)
    },
    [setLocation, load]
  )

  // Public: pick a raw lat/lon (from the map) → reverse geocode → select.
  const selectCoords = useCallback(
    async (lat, lon) => {
      const loc = await reverseGeocode(lat, lon)
      setLocation(loc)
      load(loc)
    },
    [setLocation, load]
  )

  // Public: use the device's current position.
  const useCurrentLocation = useCallback(async () => {
    const { lat, lon } = await locate()
    const loc = await reverseGeocode(lat, lon)
    setLocation(loc)
    load(loc)
    return loc
  }, [locate, setLocation, load])

  const refresh = useCallback(() => {
    if (location) load(location)
  }, [location, load])

  // ── Boot sequence: remembered location → geolocation → Mumbai default ──────
  useEffect(() => {
    if (bootedRef.current) return
    bootedRef.current = true

    async function boot() {
      if (location) {
        load(location)
        return
      }
      try {
        const { lat, lon } = await locate()
        const loc = await reverseGeocode(lat, lon)
        setLocation(loc)
        load(loc)
      } catch {
        // Geolocation denied / unsupported → fall back to Mumbai.
        setLocation(DEFAULT_LOCATION)
        load(DEFAULT_LOCATION)
      }
    }
    boot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    location,
    bundle,
    status,
    error,
    locating,
    selectLocation,
    selectCoords,
    useCurrentLocation,
    refresh,
  }

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  )
}

export function useWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider')
  return ctx
}

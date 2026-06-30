import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '@/constants'

// Stable key for a location regardless of object identity.
export function locationKey(loc) {
  return `${loc.lat.toFixed(3)},${loc.lon.toFixed(3)}`
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, [])

  const isFavorite = useCallback(
    (loc) => loc && favorites.some((f) => locationKey(f) === locationKey(loc)),
    [favorites]
  )

  const add = useCallback(
    (loc) => {
      setFavorites((prev) =>
        prev.some((f) => locationKey(f) === locationKey(loc))
          ? prev
          : [...prev, loc]
      )
    },
    [setFavorites]
  )

  const remove = useCallback(
    (loc) => {
      setFavorites((prev) =>
        prev.filter((f) => locationKey(f) !== locationKey(loc))
      )
    },
    [setFavorites]
  )

  const toggle = useCallback(
    (loc) => {
      setFavorites((prev) =>
        prev.some((f) => locationKey(f) === locationKey(loc))
          ? prev.filter((f) => locationKey(f) !== locationKey(loc))
          : [...prev, loc]
      )
    },
    [setFavorites]
  )

  return { favorites, isFavorite, add, remove, toggle }
}

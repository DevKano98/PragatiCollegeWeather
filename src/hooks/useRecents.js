import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '@/constants'
import { locationKey } from './useFavorites'

const MAX_RECENTS = 6

// Recently searched locations, most-recent first.
export function useRecents() {
  const [recents, setRecents] = useLocalStorage(STORAGE_KEYS.recents, [])

  const addRecent = useCallback(
    (loc) => {
      setRecents((prev) => {
        const filtered = prev.filter(
          (r) => locationKey(r) !== locationKey(loc)
        )
        return [loc, ...filtered].slice(0, MAX_RECENTS)
      })
    },
    [setRecents]
  )

  const clearRecents = useCallback(() => setRecents([]), [setRecents])

  return { recents, addRecent, clearRecents }
}

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/constants'

// Display units (temperature + wind), persisted.
export function useSettings() {
  const [settings, setSettings] = useLocalStorage(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  )

  const update = useCallback(
    (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings]
  )

  return { settings, update }
}

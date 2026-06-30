import { useCallback, useEffect, useState } from 'react'

// Persisted state synced to localStorage, with cross-tab updates.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          /* quota / disabled — ignore */
        }
        return resolved
      })
    },
    [key]
  )

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === key && e.newValue != null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, set]
}

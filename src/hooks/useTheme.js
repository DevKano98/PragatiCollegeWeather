import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '@/constants'

// theme = 'light' | 'dark' | 'system'. Applies the resolved class to <html>
// and listens to OS changes when set to 'system'. The initial class is set by
// the inline script in index.html to avoid a flash; this keeps it in sync.
export function useTheme() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, 'system')

  const apply = useCallback((value) => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const isDark = value === 'dark' || (value === 'system' && prefersDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    apply(theme)
  }, [theme, apply])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => apply('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, apply])

  return { theme, setTheme }
}

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, MapPin, Clock, X } from 'lucide-react'
import { searchCities } from '@/services/weather'
import { useDebounce } from '@/hooks/useDebounce'
import { useRecents } from '@/hooks/useRecents'
import { useWeather } from '@/context/WeatherContext'
import { placeLabel } from '@/utils/format'
import { cn } from '@/utils/cn'

/*
  Debounced autocomplete with keyboard nav (↑/↓/Enter/Esc), recent searches,
  and click-outside to close. Selecting a result updates the shared location.
*/
export function SearchBar({ className, autoFocus = false }) {
  const { selectLocation } = useWeather()
  const { recents, addRecent } = useRecents()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const debounced = useDebounce(query, 350)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const reqRef = useRef(0)

  // Fetch suggestions for the debounced query (guard against stale results).
  useEffect(() => {
    const q = debounced.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    const id = ++reqRef.current
    setLoading(true)
    searchCities(q)
      .then((r) => {
        if (id === reqRef.current) {
          setResults(r)
          setActive(-1)
        }
      })
      .catch(() => id === reqRef.current && setResults([]))
      .finally(() => id === reqRef.current && setLoading(false))
  }, [debounced])

  // Click outside closes the panel.
  useEffect(() => {
    function onClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const showRecents = query.trim().length < 2 && recents.length > 0
  const list = showRecents ? recents : results

  function choose(loc) {
    selectLocation(loc)
    addRecent(loc)
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.blur()
  }

  function onKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, list.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (active >= 0 && list[active]) {
        e.preventDefault()
        choose(list[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search city…"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {open && (showRecents || query.trim().length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lift"
          >
            {showRecents && (
              <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
                Recent
              </div>
            )}
            {list.length === 0 && !loading && !showRecents && (
              <div className="px-2.5 py-6 text-center text-sm text-muted-foreground">
                No cities found
              </div>
            )}
            {list.map((loc, i) => (
              <button
                key={`${loc.lat},${loc.lon}-${i}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(loc)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  active === i ? 'bg-muted' : 'hover:bg-muted'
                )}
              >
                {showRecents ? (
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 truncate">{placeLabel(loc)}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

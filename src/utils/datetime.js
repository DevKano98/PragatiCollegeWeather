import { format as fnsFormat } from 'date-fns'

/*
  Open-Meteo (with timeformat=unixtime) returns UTC seconds plus a separate
  utc_offset_seconds for the location. To display the LOCATION's local time —
  not the browser's — we add the offset to the UTC timestamp and then format
  the UTC parts of the resulting Date. This deliberately avoids the browser
  re-applying its own timezone offset.

  All functions here take `dt` in seconds (UTC) and `offset` in seconds.
*/

// Build a Date whose UTC fields equal the location's local wall-clock time.
function shifted(dt, offset = 0) {
  return new Date((dt + offset) * 1000)
}

// e.g. "14:30" or "2:30 PM" depending on hour12.
export function formatTime(dt, offset = 0, hour12 = false) {
  const d = shifted(dt, offset)
  let h = d.getUTCHours()
  const m = d.getUTCMinutes().toString().padStart(2, '0')
  if (hour12) {
    const period = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m} ${period}`
  }
  return `${h.toString().padStart(2, '0')}:${m}`
}

// e.g. "2 PM" — compact hour label for the hourly strip.
export function formatHour(dt, offset = 0) {
  const d = shifted(dt, offset)
  let h = d.getUTCHours()
  const period = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h} ${period}`
}

// e.g. "Mon" — short weekday for the daily forecast.
export function formatWeekday(dt, offset = 0) {
  return fnsFormat(shifted(dt, offset), 'EEE')
}

// e.g. "Monday, Jun 30" — full header date.
export function formatLongDate(dt, offset = 0) {
  return fnsFormat(shifted(dt, offset), 'EEEE, MMM d')
}

// Compare a timestamp's local day to "today" in the same timezone.
export function isSameLocalDay(a, b, offset = 0) {
  return (
    fnsFormat(shifted(a, offset), 'yyyy-MM-dd') ===
    fnsFormat(shifted(b, offset), 'yyyy-MM-dd')
  )
}

// Current UTC seconds (used to find the "now" slice of the hourly array).
export function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

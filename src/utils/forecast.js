import { nowSeconds } from './datetime'

/*
  Pure derivations over the normalized weather bundle. Kept here so components
  can wrap them in useMemo and stay dumb.
*/

// Next N hours starting at (or just before) "now". Returns array of hour slices.
export function getNextHours(hourly, count = 24) {
  if (!hourly?.length) return []
  const now = nowSeconds()
  let startIndex = hourly.findIndex((h) => h.dt >= now)
  if (startIndex === -1) startIndex = 0
  // Step back one so the current hour is included.
  startIndex = Math.max(0, startIndex - 1)
  return hourly.slice(startIndex, startIndex + count)
}

// Min/max across the daily array — used for the shared temperature-range bar.
export function getDailyTempRange(daily) {
  if (!daily?.length) return { min: 0, max: 0 }
  let min = Infinity
  let max = -Infinity
  for (const d of daily) {
    if (d.tempMin < min) min = d.tempMin
    if (d.tempMax > max) max = d.tempMax
  }
  return { min, max }
}

// Position + width (as 0–100 percentages) of a day's range on the shared scale.
export function rangeBarMetrics(day, globalMin, globalMax) {
  const span = globalMax - globalMin || 1
  const left = ((day.tempMin - globalMin) / span) * 100
  const width = ((day.tempMax - day.tempMin) / span) * 100
  return { left, width: Math.max(width, 6) } // keep a visible minimum width
}

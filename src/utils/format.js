// Unit conversion + display formatting. The API is always requested in metric
// (°C, m/s); we convert to the user's chosen display units here, in the UI
// layer only — never in the service.

export function formatTemp(celsius, unit = 'c', withDegree = true) {
  if (celsius == null || Number.isNaN(celsius)) return '—'
  const value = unit === 'f' ? celsius * 1.8 + 32 : celsius
  const rounded = Math.round(value)
  return withDegree ? `${rounded}°` : `${rounded}`
}

export function tempUnitLabel(unit = 'c') {
  return unit === 'f' ? '°F' : '°C'
}

// API gives wind in m/s.
export function formatWind(ms, unit = 'kmh') {
  if (ms == null || Number.isNaN(ms)) return '—'
  if (unit === 'mph') return `${Math.round(ms * 2.236936)} mph`
  return `${Math.round(ms * 3.6)} km/h`
}

export function windUnitLabel(unit = 'kmh') {
  return unit === 'mph' ? 'mph' : 'km/h'
}

// Compass direction from degrees.
const COMPASS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
]
export function windDirection(deg) {
  if (deg == null || Number.isNaN(deg)) return ''
  return COMPASS[Math.round(deg / 22.5) % 16]
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return `${Math.round(value)}%`
}

export function formatPressure(hpa) {
  if (hpa == null || Number.isNaN(hpa)) return '—'
  return `${Math.round(hpa)} hPa`
}

// API gives visibility in metres.
export function formatVisibility(metres) {
  if (metres == null || Number.isNaN(metres)) return '—'
  const km = metres / 1000
  return km >= 10 ? '10+ km' : `${km.toFixed(1)} km`
}

export function formatUV(uv) {
  if (uv == null || Number.isNaN(uv)) return '—'
  return Math.round(uv).toString()
}

export function uvLabel(uv) {
  if (uv == null) return ''
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

// Pretty "City, Region, Country" without empty fragments.
export function placeLabel(loc) {
  if (!loc) return ''
  return [loc.name, loc.admin1, loc.country].filter(Boolean).join(', ')
}

export function shortPlaceLabel(loc) {
  if (!loc) return ''
  return [loc.name, loc.country].filter(Boolean).join(', ')
}

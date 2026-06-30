// Central place for storage keys, defaults, and lookup tables.

export const STORAGE_KEYS = {
  theme: 'weathersphere:theme',
  settings: 'weathersphere:settings',
  favorites: 'weathersphere:favorites',
  recents: 'weathersphere:recents',
  location: 'weathersphere:location',
}

// Mumbai — sensible, populous default when geolocation is unavailable.
export const DEFAULT_LOCATION = {
  name: 'Mumbai',
  country: 'India',
  countryCode: 'IN',
  admin1: 'Maharashtra',
  lat: 19.076,
  lon: 72.8777,
}

export const DEFAULT_SETTINGS = {
  tempUnit: 'c', // 'c' | 'f'
  windUnit: 'kmh', // 'kmh' | 'mph'
}

export const NAV_LINKS = [
  { to: '/', label: 'Today', icon: 'Home' },
  { to: '/map', label: 'Map', icon: 'Map' },
  { to: '/favorites', label: 'Favorites', icon: 'Star' },
  { to: '/settings', label: 'Settings', icon: 'Settings' },
]

// AQI 1–5 bands (we map Open-Meteo's 0–500 US AQI into these).
export const AQI_LEVELS = {
  1: { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-500' },
  2: { label: 'Fair', color: 'text-lime-500', bg: 'bg-lime-500' },
  3: { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500' },
  4: { label: 'Poor', color: 'text-orange-500', bg: 'bg-orange-500' },
  5: { label: 'Very Poor', color: 'text-rose-500', bg: 'bg-rose-500' },
}

// Pollutant metadata for the AQI card. Keys match the normalized bundle.
export const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³' },
  { key: 'o3', label: 'O₃', unit: 'µg/m³' },
  { key: 'no2', label: 'NO₂', unit: 'µg/m³' },
  { key: 'so2', label: 'SO₂', unit: 'µg/m³' },
  { key: 'co', label: 'CO', unit: 'µg/m³' },
]

export const GITHUB_URL = 'https://github.com'

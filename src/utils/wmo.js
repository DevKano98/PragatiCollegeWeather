/*
  WMO weather-code (0–99) mapping.

  Open-Meteo returns WMO codes. We translate each into a stable internal triple
  { id, icon, description } where:
    - `id` mirrors OpenWeather condition-code ranges so a single downstream
      icon/tint mapping works regardless of provider:
        2xx thunderstorm · 3xx drizzle · 5xx rain · 6xx snow ·
        7xx atmosphere · 800 clear · 80x clouds
    - `icon` is an OpenWeather-style code ending in `d`/`n` (day/night) so the
      icon layer can pick day vs night art.
*/

// Base table keyed by WMO code → { id, icon (day variant), description }.
const WMO = {
  0: { id: 800, icon: '01', description: 'Clear sky' },
  1: { id: 801, icon: '02', description: 'Mainly clear' },
  2: { id: 802, icon: '03', description: 'Partly cloudy' },
  3: { id: 804, icon: '04', description: 'Overcast' },
  45: { id: 741, icon: '50', description: 'Fog' },
  48: { id: 741, icon: '50', description: 'Depositing rime fog' },
  51: { id: 300, icon: '09', description: 'Light drizzle' },
  53: { id: 301, icon: '09', description: 'Moderate drizzle' },
  55: { id: 302, icon: '09', description: 'Dense drizzle' },
  56: { id: 300, icon: '09', description: 'Light freezing drizzle' },
  57: { id: 302, icon: '09', description: 'Dense freezing drizzle' },
  61: { id: 500, icon: '10', description: 'Slight rain' },
  63: { id: 501, icon: '10', description: 'Moderate rain' },
  65: { id: 502, icon: '10', description: 'Heavy rain' },
  66: { id: 511, icon: '13', description: 'Light freezing rain' },
  67: { id: 511, icon: '13', description: 'Heavy freezing rain' },
  71: { id: 600, icon: '13', description: 'Slight snow' },
  73: { id: 601, icon: '13', description: 'Moderate snow' },
  75: { id: 602, icon: '13', description: 'Heavy snow' },
  77: { id: 600, icon: '13', description: 'Snow grains' },
  80: { id: 520, icon: '09', description: 'Slight rain showers' },
  81: { id: 521, icon: '09', description: 'Moderate rain showers' },
  82: { id: 522, icon: '09', description: 'Violent rain showers' },
  85: { id: 620, icon: '13', description: 'Slight snow showers' },
  86: { id: 622, icon: '13', description: 'Heavy snow showers' },
  95: { id: 200, icon: '11', description: 'Thunderstorm' },
  96: { id: 201, icon: '11', description: 'Thunderstorm with slight hail' },
  99: { id: 202, icon: '11', description: 'Thunderstorm with heavy hail' },
}

const FALLBACK = { id: 800, icon: '01', description: 'Clear sky' }

// Resolve a WMO code into the internal triple, attaching the day/night suffix.
export function mapWeatherCode(code, isDay = true) {
  const base = WMO[code] || FALLBACK
  return {
    id: base.id,
    icon: `${base.icon}${isDay ? 'd' : 'n'}`,
    description: base.description,
  }
}

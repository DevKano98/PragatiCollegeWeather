import axios from 'axios'
import { mapWeatherCode } from '@/utils/wmo'
import { STORAGE_KEYS } from '@/constants'

/*
  Provider-agnostic weather service.

  ALL network code lives here. Every response is normalized into a stable
  internal shape so components never see provider-specific fields. Swapping
  providers later means rewriting only this file.

  Provider: Open-Meteo (no API key, no signup).
*/

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

const http = axios.create({ timeout: 12000 })

// ── Caching: in-memory + sessionStorage, 10-minute TTL ──────────────────────
const TTL = 10 * 60 * 1000
const memory = new Map()

function cacheGet(key) {
  const hit = memory.get(key)
  if (hit && Date.now() - hit.t < TTL) return hit.v
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEYS.location}:cache:${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Date.now() - parsed.t < TTL) {
        memory.set(key, parsed)
        return parsed.v
      }
    }
  } catch {
    /* sessionStorage unavailable — fine */
  }
  return null
}

function cacheSet(key, value) {
  const entry = { t: Date.now(), v: value }
  memory.set(key, entry)
  try {
    sessionStorage.setItem(
      `${STORAGE_KEYS.location}:cache:${key}`,
      JSON.stringify(entry)
    )
  } catch {
    /* quota / disabled — ignore */
  }
}

// ── City search (geocoding) ─────────────────────────────────────────────────
export async function searchCities(query) {
  const q = query?.trim()
  if (!q || q.length < 2) return []
  const { data } = await http.get(GEOCODE_URL, {
    params: { name: q, count: 8, language: 'en', format: 'json' },
  })
  if (!data?.results) return []
  return data.results.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    countryCode: r.country_code,
    admin1: r.admin1,
    lat: r.latitude,
    lon: r.longitude,
  }))
}

// ── Reverse geocoding (Open-Meteo has none → BigDataCloud) ───────────────────
export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await http.get(REVERSE_URL, {
      params: { latitude: lat, longitude: lon, localityLanguage: 'en' },
    })
    return {
      name:
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        'Selected location',
      country: data.countryName,
      countryCode: data.countryCode,
      admin1: data.principalSubdivision,
      lat,
      lon,
    }
  } catch {
    // Never block the app on reverse-geocode failure.
    return {
      name: 'Selected location',
      country: '',
      countryCode: '',
      admin1: '',
      lat,
      lon,
    }
  }
}

// ── Normalizers ─────────────────────────────────────────────────────────────
function normalizeForecast(data) {
  const offset = data.utc_offset_seconds ?? 0
  const c = data.current
  const isDayNow = c.is_day === 1

  const current = {
    dt: c.time,
    temp: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    pressure: c.pressure_msl,
    cloudCover: c.cloud_cover,
    windSpeed: c.wind_speed_10m,
    windDeg: c.wind_direction_10m,
    isDay: isDayNow,
    code: c.weather_code,
    ...mapWeatherCode(c.weather_code, isDayNow),
  }

  const h = data.hourly
  const hourly = (h?.time || []).map((t, i) => {
    // Day/night per hour is approximated from the daily sunrise/sunset below
    // when needed; for the strip the current is-day flag is good enough.
    return {
      dt: t,
      temp: h.temperature_2m[i],
      humidity: h.relative_humidity_2m[i],
      code: h.weather_code[i],
      pop: h.precipitation_probability?.[i],
      windSpeed: h.wind_speed_10m[i],
      visibility: h.visibility?.[i],
      uv: h.uv_index?.[i],
      ...mapWeatherCode(h.weather_code[i], true),
    }
  })

  const d = data.daily
  const daily = (d?.time || []).map((t, i) => ({
    dt: t,
    code: d.weather_code[i],
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    pop: d.precipitation_probability_max?.[i],
    windMax: d.wind_speed_10m_max?.[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    uvMax: d.uv_index_max?.[i],
    ...mapWeatherCode(d.weather_code[i], true),
  }))

  // Attach today's sunrise/sunset + UV to current for the hero card.
  if (daily[0]) {
    current.sunrise = daily[0].sunrise
    current.sunset = daily[0].sunset
    current.uv = daily[0].uvMax
  }
  // Prefer the live hourly UV closest to now if present.
  current.visibility = hourly[0]?.visibility ?? null

  return { timezone: offset, timezoneName: data.timezone, current, hourly, daily }
}

// US AQI (0–500) → 1–5 band used by the UI.
function aqiBand(usAqi) {
  if (usAqi == null) return null
  if (usAqi <= 50) return 1
  if (usAqi <= 100) return 2
  if (usAqi <= 150) return 3
  if (usAqi <= 200) return 4
  return 5
}

function normalizeAir(data) {
  if (!data?.current) return null
  const c = data.current
  return {
    aqi: aqiBand(c.us_aqi),
    usAqi: c.us_aqi,
    pm2_5: c.pm2_5,
    pm10: c.pm10,
    co: c.carbon_monoxide,
    no2: c.nitrogen_dioxide,
    o3: c.ozone,
    so2: c.sulphur_dioxide,
  }
}

// ── Individual fetchers (each cached) ────────────────────────────────────────
export async function getForecast(lat, lon) {
  const key = `fc:${lat.toFixed(3)},${lon.toFixed(3)}`
  const cached = cacheGet(key)
  if (cached) return cached

  const { data } = await http.get(FORECAST_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      timezone: 'auto',
      timeformat: 'unixtime',
      wind_speed_unit: 'ms',
      forecast_days: 7,
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
      hourly:
        'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m,visibility,uv_index',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max',
    },
  })
  const normalized = normalizeForecast(data)
  cacheSet(key, normalized)
  return normalized
}

// Current weather only (used by favorite cards). Reuses the forecast cache.
export async function getCurrentWeather(lat, lon) {
  const fc = await getForecast(lat, lon)
  return fc.current
}

export async function getAirQuality(lat, lon) {
  const key = `air:${lat.toFixed(3)},${lon.toFixed(3)}`
  const cached = cacheGet(key)
  if (cached) return cached

  const { data } = await http.get(AIR_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      timezone: 'auto',
      current:
        'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
    },
  })
  const normalized = normalizeAir(data)
  cacheSet(key, normalized)
  return normalized
}

// ── Bundle: exactly TWO requests in parallel; air failure is non-fatal ───────
export async function getWeatherBundle(lat, lon) {
  const [forecast, air] = await Promise.all([
    getForecast(lat, lon),
    getAirQuality(lat, lon).catch(() => null),
  ])
  return { ...forecast, air }
}

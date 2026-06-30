import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  Cloudy,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from 'lucide-react'

/*
  Single source of truth for icon + tint, keyed off the OpenWeather-style
  `icon` code (e.g. "10d") produced by wmo.js. Lucide only — no image assets.
  Each entry: { Icon, tint } where tint is a Tailwind text-color class.
*/

const MAP = {
  '01d': { Icon: Sun, tint: 'text-amber-500' },
  '01n': { Icon: Moon, tint: 'text-indigo-300' },
  '02d': { Icon: CloudSun, tint: 'text-amber-500' },
  '02n': { Icon: CloudMoon, tint: 'text-indigo-300' },
  '03d': { Icon: Cloud, tint: 'text-slate-400' },
  '03n': { Icon: Cloud, tint: 'text-slate-400' },
  '04d': { Icon: Cloudy, tint: 'text-slate-400' },
  '04n': { Icon: Cloudy, tint: 'text-slate-400' },
  '09d': { Icon: CloudDrizzle, tint: 'text-sky-500' },
  '09n': { Icon: CloudDrizzle, tint: 'text-sky-500' },
  '10d': { Icon: CloudRain, tint: 'text-sky-500' },
  '10n': { Icon: CloudRain, tint: 'text-sky-500' },
  '11d': { Icon: CloudLightning, tint: 'text-violet-500' },
  '11n': { Icon: CloudLightning, tint: 'text-violet-500' },
  '13d': { Icon: CloudSnow, tint: 'text-cyan-400' },
  '13n': { Icon: CloudSnow, tint: 'text-cyan-400' },
  '50d': { Icon: CloudFog, tint: 'text-slate-400' },
  '50n': { Icon: CloudFog, tint: 'text-slate-400' },
}

const FALLBACK = { Icon: Sun, tint: 'text-amber-500' }

export function resolveIcon(iconCode) {
  return MAP[iconCode] || FALLBACK
}

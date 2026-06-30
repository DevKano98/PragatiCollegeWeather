# WeatherSphere

A premium, handcrafted weather app — current conditions, hourly and 7-day
forecasts, air quality, and an interactive map. Built to feel like a real
product, not a tutorial.

**No API key. No signup. No backend.** Clone, install, run.

```bash
npm install
npm run dev
```

That's it — real data loads immediately for your location (or Mumbai as a
fallback). `npm run build` produces a static bundle that deploys to
Vercel/Netlify unmodified.

## Why no API key?

WeatherSphere uses [Open-Meteo](https://open-meteo.com), a free, key-less
weather API. This deliberately avoids the most common failure of weather-app
builds: freshly-issued OpenWeather keys return `401` for hours, wasting setup
time. Everything here works on first run.

## Data sources (all free, key-less)

| Concern            | Endpoint                                                          |
| ------------------ | ---------------------------------------------------------------- |
| Forecast + current | `api.open-meteo.com/v1/forecast`                                 |
| Air quality        | `air-quality-api.open-meteo.com/v1/air-quality`                  |
| City search        | `geocoding-api.open-meteo.com/v1/search`                         |
| Reverse geocoding  | `api.bigdatacloud.net/data/reverse-geocode-client`               |
| Map tiles          | OpenStreetMap                                                    |

All network code lives in `src/services/weather.js` and normalizes every
response into a stable internal shape, so the UI never sees provider-specific
fields. Swapping providers means editing only that one file.

## Features

- **Today** — hero current card, metrics grid, 24h hourly strip, 7-day
  forecast, air quality, and a mini map.
- **Map** — full interactive map; click anywhere to load that location's
  weather (reverse-geocoded), with a styled temperature-badge marker and
  animated recenter.
- **Favorites** — save cities; each card fetches its own current temperature.
- **Settings** — °C/°F, km·h⁻¹/mph, and light/dark/system theme, all persisted.
- **Search** — debounced autocomplete with keyboard navigation and recent
  searches.
- Dark mode with **no flash on load** (theme applied synchronously before
  paint), including dark-styled map tiles, controls, and popups.
- Shimmer skeletons (no spinners, no layout shift), graceful error/empty
  states with retry, and offline handling.
- Fully responsive — zero horizontal scroll down to 360px.

## Tech

React 19 · Vite · JavaScript · Tailwind CSS v3.4 · Radix UI · Lucide · Framer
Motion · React Router v7 · Axios · React Leaflet · date-fns.

The shared location + weather bundle is the only global state (Context API);
everything else is local or persisted to `localStorage` / `sessionStorage`.

## Project structure

```
src/
  components/   UI building blocks (ui/ holds shadcn-style primitives)
  context/      WeatherContext — shared active location + weather bundle
  pages/        Home · MapView · Favorites · Settings · NotFound
  hooks/        localStorage, theme, settings, favorites, recents, debounce, geolocation
  services/     weather.js — provider-agnostic, normalized network layer
  utils/        cn · format · datetime · forecast · wmo · weatherIcons
  constants/    storage keys, defaults, AQI levels, pollutants, nav links
  styles/       index.css — design tokens + base styles
```

## Notes on correctness

- **Timezones**: Open-Meteo returns UTC seconds plus `utc_offset_seconds`. All
  times are rendered in the *location's* local time (not the browser's) via
  `src/utils/datetime.js`, avoiding double-offset bugs.
- **Performance**: the map and every route page are lazy-loaded;
  `leaflet`/`react-leaflet` and `framer-motion` are split into manual chunks;
  API responses are cached for 10 minutes; search is debounced; stale async
  responses are discarded via a monotonic request id.

## License

MIT — weather data © Open-Meteo, map data © OpenStreetMap contributors.
"# PragatiCollegeWeather" 

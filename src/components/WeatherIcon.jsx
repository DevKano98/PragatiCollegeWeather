import { resolveIcon } from '@/utils/weatherIcons'
import { cn } from '@/utils/cn'

// Renders the Lucide icon + tint for a normalized weather slice (which carries
// an OpenWeather-style `icon` code like "10d"). `tinted` toggles the color.
export function WeatherIcon({ icon, className, tinted = true, strokeWidth = 2 }) {
  const { Icon, tint } = resolveIcon(icon)
  return (
    <Icon
      className={cn(tinted && tint, className)}
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  )
}

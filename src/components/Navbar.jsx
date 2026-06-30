import { NavLink } from 'react-router-dom'
import { LocateFixed, Loader2, Github, Star } from 'lucide-react'
import { Logo } from './Logo'
import { SearchBar } from './SearchBar'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useWeather } from '@/context/WeatherContext'
import { NAV_LINKS, GITHUB_URL } from '@/constants'
import { cn } from '@/utils/cn'

// Desktop links (Settings lives in the overflow / mobile nav; here we surface
// the primary destinations).
const DESKTOP_LINKS = NAV_LINKS.filter((l) => l.to !== '/settings')

export function Navbar() {
  const { useCurrentLocation, locating } = useWeather()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-3">
        <Logo />

        {/* Primary nav — hidden on small screens (bottom tab bar takes over). */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {DESKTOP_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search — grows to fill, capped width on desktop. */}
        <div className="ml-auto hidden min-w-0 flex-1 justify-end sm:flex">
          <SearchBar className="w-full max-w-xs" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => useCurrentLocation().catch(() => {})}
                disabled={locating}
                aria-label="Use my location"
              >
                {locating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LocateFixed className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Use my location</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
              >
                <NavLink to="/favorites" aria-label="Favorites">
                  <Star className="h-5 w-5" />
                </NavLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Favorites</TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Source on GitHub</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Search on its own row for narrow screens. */}
      <div className="container pb-3 sm:hidden">
        <SearchBar />
      </div>
    </header>
  )
}

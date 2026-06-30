import { NavLink } from 'react-router-dom'
import { Home, Map, Star, Settings } from 'lucide-react'
import { cn } from '@/utils/cn'

// Native-feeling sticky bottom tab bar for mobile, with safe-area padding.
const TABS = [
  { to: '/', label: 'Today', Icon: Home, end: true },
  { to: '/map', label: 'Map', Icon: Map },
  { to: '/favorites', label: 'Favorites', Icon: Star },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export function MobileNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

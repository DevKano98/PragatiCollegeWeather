import { FavoriteCities } from '@/components/FavoriteCities'

export default function Favorites() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
        <p className="text-sm text-muted-foreground">
          Your saved cities. Tap a card to open it on the dashboard.
        </p>
      </div>
      <FavoriteCities />
    </div>
  )
}

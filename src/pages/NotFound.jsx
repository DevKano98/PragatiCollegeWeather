import { Link } from 'react-router-dom'
import { CloudOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
        <CloudOff className="h-8 w-8" />
      </div>
      <p className="text-5xl font-bold tracking-tight">404</p>
      <h1 className="mt-2 text-lg font-semibold">Page not found</h1>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        The forecast for this page is permanently cloudy. Let's head back.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to Today</Link>
      </Button>
    </div>
  )
}

import { Github } from 'lucide-react'
import { GITHUB_URL } from '@/constants'

// Desktop footer — hidden on mobile (the bottom tab bar replaces it).
export function Footer() {
  return (
    <footer className="mt-12 hidden border-t border-border md:block">
      <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
        <p>
          Weather data by{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:text-primary"
          >
            Open-Meteo
          </a>{' '}
          · Map © OpenStreetMap
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </footer>
  )
}

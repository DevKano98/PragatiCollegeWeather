import { Link } from 'react-router-dom'

// Wordmark + glyph. The glyph is a sun peeking behind a cloud.
export function Logo({ withText = true }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <circle cx="9" cy="9" r="3.4" fill="#fbbf24" />
          <path
            d="M7.5 17.5a3.1 3.1 0 0 1 .2-6.2 4.1 4.1 0 0 1 7.9 1.2 2.7 2.7 0 0 1-.5 5z"
            fill="currentColor"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-base font-bold tracking-tight">
          Weather<span className="text-primary">Sphere</span>
        </span>
      )}
    </Link>
  )
}

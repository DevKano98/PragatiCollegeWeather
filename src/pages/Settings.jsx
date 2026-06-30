import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/hooks/useSettings'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

// Animated segmented control. The active pill slides via a shared layoutId.
function Segmented({ value, onChange, options, name }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/60 p-1">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-md bg-background shadow-soft"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {opt.Icon && <opt.Icon className="h-4 w-4" />}
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Row({ title, desc, children }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { settings, update } = useSettings()
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Preferences are saved on this device.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Units</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <Row title="Temperature" desc="Celsius or Fahrenheit">
            <Segmented
              name="temp"
              value={settings.tempUnit}
              onChange={(v) => update({ tempUnit: v })}
              options={[
                { value: 'c', label: '°C' },
                { value: 'f', label: '°F' },
              ]}
            />
          </Row>
          <Row title="Wind speed" desc="Kilometres or miles per hour">
            <Segmented
              name="wind"
              value={settings.windUnit}
              onChange={(v) => update({ windUnit: v })}
              options={[
                { value: 'kmh', label: 'km/h' },
                { value: 'mph', label: 'mph' },
              ]}
            />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <Row title="Theme" desc="Light, dark, or follow your system">
            <Segmented
              name="theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: 'light', label: 'Light', Icon: Sun },
                { value: 'dark', label: 'Dark', Icon: Moon },
                { value: 'system', label: 'System', Icon: Monitor },
              ]}
            />
          </Row>
        </CardContent>
      </Card>
    </div>
  )
}

import { MapPin } from 'lucide-react'
import { building } from '@/config/building'
import { useKiosk } from '../shell/KioskProvider'
import { TapButton } from '../ui/TapButton'

export function AttractScreen() {
  const { begin } = useKiosk()

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: whole screen is tappable as a convenience on top of the "Tap to begin" button below.
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users reach the identical action via the focusable "Tap to begin" button.
    <div
      onClick={begin}
      className="relative w-screen h-dvh overflow-hidden flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-primary/10 via-background to-background text-center px-12"
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-70" />
      <div className="relative flex flex-col items-center gap-10">
        <div
          className="h-32 w-32 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center"
          style={{ boxShadow: '0 0 64px -6px color-mix(in oklab, var(--primary) 60%, transparent)' }}
        >
          <MapPin className="h-16 w-16" strokeWidth={1.9} />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">{building.name}</h1>
          <p className="text-2xl font-medium uppercase tracking-[0.14em] text-muted-foreground">{building.tagline}</p>
        </div>
        <TapButton size="xl" onClick={begin} className="motion-safe:animate-pulse-cta">
          Tap to begin
        </TapButton>
      </div>
    </div>
  )
}

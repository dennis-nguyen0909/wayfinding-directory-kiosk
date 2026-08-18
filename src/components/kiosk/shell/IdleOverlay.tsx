import { TapButton } from '../ui/TapButton'
import { useKiosk } from './KioskProvider'

export function IdleOverlay() {
  const { idleWarningRemaining: r, hasUserState, extendSession, restartSession } = useKiosk()

  // Suppressed on directory/attract with nothing in flight — restarting is meaningless.
  if (r === null || !hasUserState) return null

  const circumference = 276
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: tap-anywhere-to-extend, a convenience on top of the two keyboard-operable buttons below.
    // biome-ignore lint/a11y/useKeyWithClickEvents: same — Enter/Space reach the identical action via the "Yes, I'm here" button.
    <div onClick={extendSession} className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation-only, not a real control. */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation-only, not a real control. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-3xl p-12 max-w-2xl text-center flex flex-col items-center gap-6"
      >
        <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90" role="img" aria-label="Time remaining">
          <title>Time remaining before the kiosk resets</title>
          <circle cx="50" cy="50" r="44" className="fill-none stroke-muted" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            className="fill-none stroke-primary transition-all duration-1000"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (r / 30000) * circumference}
          />
        </svg>
        <h2 className="text-4xl font-bold text-foreground">Are you still there?</h2>
        <p className="text-2xl text-muted-foreground">Returning to the directory in {Math.ceil(r / 1000)}s</p>
        <div className="flex gap-4">
          <TapButton size="lg" onClick={extendSession}>
            Yes, I&apos;m here
          </TapButton>
          <TapButton size="lg" variant="outline" onClick={restartSession}>
            Start over
          </TapButton>
        </div>
      </div>
    </div>
  )
}

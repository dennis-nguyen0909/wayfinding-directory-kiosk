import { Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KioskHelpButton } from '../ui/KioskHelpButton'
import { TapButton } from '../ui/TapButton'

interface KioskFooterProps {
  showHome: boolean
  onHome: () => void
  onHelp: () => void
  className?: string
  /** Primary CTA slot, e.g. "Get Directions" on the room detail card. */
  primaryAction?: React.ReactNode
}

export function KioskFooter({ showHome, onHome, onHelp, className, primaryAction }: KioskFooterProps) {
  return (
    <footer className={cn('flex items-center justify-between px-12 py-6 border-t border-border/60', className)}>
      <div>
        {showHome && (
          <TapButton variant="ghost" size="default" onClick={onHome}>
            <Home />
            Home
          </TapButton>
        )}
      </div>
      <div className="flex items-center gap-4">
        {primaryAction}
        <KioskHelpButton onTap={onHelp} />
      </div>
    </footer>
  )
}

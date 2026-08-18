import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TapButton } from './TapButton'

interface KioskHelpButtonProps {
  onTap: () => void
  className?: string
}

/** Level "staff" — this is an office/business directory, not a regulated hospital/
 * airport space, so a Help-desk affordance is right but a distinct red emergency
 * button is intentionally out of scope. */
export function KioskHelpButton({ onTap, className }: KioskHelpButtonProps) {
  return (
    <TapButton variant="outline" size="default" onClick={onTap} className={cn(className)}>
      <HelpCircle />
      Help
    </TapButton>
  )
}

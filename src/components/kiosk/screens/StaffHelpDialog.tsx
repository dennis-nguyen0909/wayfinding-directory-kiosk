import { Phone } from 'lucide-react'
import { building } from '@/config/building'
import { getRoomById } from '@/lib/selectors'
import { KioskDialog } from '../ui/KioskDialog'

interface StaffHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffHelpDialog({ open, onOpenChange }: StaffHelpDialogProps) {
  const reception = getRoomById(building, 'f1-reception')

  return (
    <KioskDialog open={open} onOpenChange={onOpenChange} title="Need a hand?">
      <div className="flex flex-col gap-6">
        <p>Tap any tile to browse, or use the search box to find a person, business, or amenity by name.</p>
        {reception && (
          <div className="flex items-center gap-4 p-6 rounded-2xl border border-border/60 bg-card">
            <div className="h-14 w-14 rounded-2xl bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0">
              <Phone className="h-7 w-7 text-primary" strokeWidth={1.9} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{reception.name}</p>
              {reception.hours && <p className="text-xl text-muted-foreground">{reception.hours}</p>}
              {reception.phone && <p className="text-xl text-muted-foreground">{reception.phone}</p>}
            </div>
          </div>
        )}
      </div>
    </KioskDialog>
  )
}

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
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-muted">
            <Phone className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-foreground">{reception.name}</p>
              {reception.hours && <p className="text-xl text-muted-foreground">{reception.hours}</p>}
              {reception.phone && <p className="text-xl text-muted-foreground">{reception.phone}</p>}
            </div>
          </div>
        )}
      </div>
    </KioskDialog>
  )
}

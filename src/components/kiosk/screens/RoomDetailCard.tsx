import { ChevronLeft, Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import type { RoomWithFloor } from '@/lib/selectors'
import { cn } from '@/lib/utils'
import { TapButton } from '../ui/TapButton'

interface RoomDetailCardProps {
  room: RoomWithFloor
  onBack: () => void
  onGetDirections: () => void
}

export function RoomDetailCard({ room, onBack, onGetDirections }: RoomDetailCardProps) {
  const { Icon, iconBg, iconColor } = CATEGORY_STYLES[room.category]

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 rounded-3xl border border-border/60 bg-card p-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xl text-muted-foreground hover:text-foreground transition-colors min-h-[44px] w-fit"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.9} />
        Back to directory
      </button>

      <div className="flex items-start gap-4 pb-5 border-b border-border/60">
        <div className={cn('h-16 w-16 rounded-2xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('h-8 w-8', iconColor)} strokeWidth={1.9} />
        </div>
        <div className="min-w-0">
          <h2 className="text-4xl font-bold text-foreground tracking-tight">{room.name}</h2>
          <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-5 w-5" strokeWidth={1.9} />
            {room.floorLabel}
          </p>
        </div>
      </div>

      {room.description && <p className="text-2xl text-foreground">{room.description}</p>}

      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        {room.hours && (
          <div className="flex items-center gap-3 text-xl text-foreground">
            <Clock className="h-6 w-6 text-muted-foreground shrink-0" strokeWidth={1.9} />
            {room.hours}
          </div>
        )}
        {room.phone && (
          <div className="flex items-center gap-3 text-xl text-foreground">
            <Phone className="h-6 w-6 text-muted-foreground shrink-0" strokeWidth={1.9} />
            {room.phone}
          </div>
        )}
      </div>

      <TapButton size="xl" onClick={onGetDirections} className="w-full">
        <Navigation />
        Get Directions
      </TapButton>
    </div>
  )
}

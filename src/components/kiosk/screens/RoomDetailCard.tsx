import { ChevronLeft, Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { building } from '@/config/building'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import { relatedRooms, type RoomWithFloor } from '@/lib/selectors'
import { cn } from '@/lib/utils'
import { TapButton } from '../ui/TapButton'

interface RoomDetailCardProps {
  room: RoomWithFloor
  onBack: () => void
  onGetDirections: () => void
  onSelectRoom: (roomId: string) => void
}

export function RoomDetailCard({ room, onBack, onGetDirections, onSelectRoom }: RoomDetailCardProps) {
  const { Icon, badgeClass } = CATEGORY_STYLES[room.category]
  const categoryLabel = building.categories.find((c) => c.id === room.category)?.label
  const related = relatedRooms(building, room)

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xl text-muted-foreground hover:text-foreground transition-colors min-h-[64px] w-fit"
      >
        <ChevronLeft className="h-6 w-6" />
        Back to directory
      </button>

      <div className="flex items-start gap-4">
        <div className={cn('h-16 w-16 rounded-lg flex items-center justify-center shrink-0', badgeClass)}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-foreground tracking-tight">{room.name}</h2>
          <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-5 w-5" />
            {room.floorLabel}
          </p>
        </div>
      </div>

      {categoryLabel && (
        <div className="flex flex-wrap gap-2">
          <span className={cn('px-3 py-1 rounded-full text-base font-semibold', badgeClass)}>{categoryLabel}</span>
        </div>
      )}

      {room.description && <p className="text-2xl text-foreground">{room.description}</p>}

      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
        {room.hours && (
          <div className="flex items-center gap-3 text-xl text-foreground">
            <Clock className="h-6 w-6 text-muted-foreground shrink-0" />
            {room.hours}
          </div>
        )}
        {room.phone && (
          <div className="flex items-center gap-3 text-xl text-foreground">
            <Phone className="h-6 w-6 text-muted-foreground shrink-0" />
            {room.phone}
          </div>
        )}

        {related.length > 0 && (
          <div>
            <p className="text-lg font-semibold text-muted-foreground mb-2">You may also like</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {related.map((r) => {
                const { Icon: RelatedIcon, badgeClass: relatedBadge } = CATEGORY_STYLES[r.category]
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectRoom(r.id)}
                    className="flex items-center gap-2 shrink-0 rounded-full border border-border pl-2 pr-4 min-h-[64px] transition-all duration-150 active:scale-[0.97] hover:border-primary/50"
                  >
                    <span
                      className={cn('h-9 w-9 rounded-full flex items-center justify-center shrink-0', relatedBadge)}
                    >
                      <RelatedIcon className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-medium text-foreground whitespace-nowrap">{r.name}</span>
                  </button>
                )
              })}
            </div>
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

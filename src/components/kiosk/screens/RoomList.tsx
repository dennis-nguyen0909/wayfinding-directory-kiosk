import { CATEGORY_STYLES } from '@/lib/category-meta'
import type { RoomWithFloor } from '@/lib/selectors'
import { cn } from '@/lib/utils'

interface RoomListProps {
  rooms: RoomWithFloor[]
  onSelect: (roomId: string) => void
  className?: string
}

/**
 * Icon-forward card grid — Mappedin's own browse results use real store/food
 * photography thumbnails. This is a synthetic demo building with no real
 * photos, so rather than fabricate stock imagery for fictional rooms, each
 * card gets a category-tinted gradient tile behind a large icon instead —
 * matching the photo-card grid's rhythm (rounded corners, fixed aspect,
 * name-below-image) without pretending to show real photography.
 */
export function RoomList({ rooms, onSelect, className }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 py-16 text-center', className)}>
        <p className="text-2xl font-semibold text-foreground">No matches</p>
        <p className="text-xl text-muted-foreground">Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 landscape:grid-cols-3 gap-4 auto-rows-max', className)}>
      {rooms.map((room) => {
        const { Icon, iconClass, tileClass } = CATEGORY_STYLES[room.category]
        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room.id)}
            className="flex flex-col rounded-xl border border-border overflow-hidden text-left transition-all duration-150 active:scale-[0.97] hover:border-primary/50"
          >
            <div className={cn('min-h-[120px] flex items-center justify-center bg-gradient-to-br', tileClass)}>
              <Icon className={cn('h-14 w-14', iconClass)} />
            </div>
            <div className="px-4 py-3 bg-card min-h-[64px] flex flex-col justify-center">
              <p className="text-xl font-semibold text-foreground leading-tight line-clamp-2">{room.name}</p>
              <p className="text-base text-muted-foreground mt-0.5">{room.floorLabel}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

import { ChevronRight } from 'lucide-react'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import type { RoomWithFloor } from '@/lib/selectors'
import { cn } from '@/lib/utils'

interface RoomListProps {
  rooms: RoomWithFloor[]
  onSelect: (roomId: string) => void
  className?: string
}

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
    <ul className={cn('flex flex-col gap-3', className)}>
      {rooms.map((room) => {
        const { Icon, iconBg, iconColor } = CATEGORY_STYLES[room.category]
        return (
          <li key={room.id}>
            <button
              type="button"
              onClick={() => onSelect(room.id)}
              className="w-full flex items-center gap-4 min-h-[88px] px-5 rounded-2xl border border-border/60 bg-card hover:border-border transition-all duration-150 active:scale-[0.98] text-left"
            >
              <div className={cn('flex items-center justify-center h-12 w-12 rounded-xl shrink-0', iconBg)}>
                <Icon className={cn('h-6 w-6', iconColor)} strokeWidth={1.9} />
              </div>
              <span className="flex-1 min-w-0">
                <span className="block text-2xl font-semibold text-foreground truncate">{room.name}</span>
                <span className="block text-xl text-muted-foreground">{room.floorLabel}</span>
              </span>
              <ChevronRight className="h-7 w-7 text-muted-foreground shrink-0" strokeWidth={1.9} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

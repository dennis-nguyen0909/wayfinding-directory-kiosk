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
        const { Icon, iconClass } = CATEGORY_STYLES[room.category]
        return (
          <li key={room.id}>
            <button
              type="button"
              onClick={() => onSelect(room.id)}
              className="w-full flex items-center gap-4 min-h-[88px] px-6 rounded-2xl border-2 border-border bg-background hover:bg-accent transition-all duration-150 active:scale-[0.98] text-left"
            >
              <Icon className={cn('h-8 w-8 shrink-0', iconClass)} />
              <span className="flex-1">
                <span className="block text-2xl font-semibold text-foreground">{room.name}</span>
                <span className="block text-xl text-muted-foreground">{room.floorLabel}</span>
              </span>
              <ChevronRight className="h-8 w-8 text-muted-foreground shrink-0" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

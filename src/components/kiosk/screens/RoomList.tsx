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
    <ul className={cn('flex flex-col', className)}>
      {rooms.map((room) => {
        const { Icon, badgeClass } = CATEGORY_STYLES[room.category]
        return (
          <li key={room.id} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => onSelect(room.id)}
              className="w-full flex items-center gap-4 min-h-[88px] py-3 hover:bg-accent transition-all duration-150 active:scale-[0.98] text-left"
            >
              <span className={cn('h-11 w-11 rounded-lg flex items-center justify-center shrink-0', badgeClass)}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block text-2xl font-semibold text-foreground">{room.name}</span>
                <span className="block text-lg text-muted-foreground">{room.floorLabel}</span>
              </span>
              <ChevronRight className="h-7 w-7 text-muted-foreground shrink-0" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

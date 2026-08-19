import { ChevronRight } from 'lucide-react'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import type { GridPosition, Room } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RoomBlockProps {
  room: Room
  onTap: () => void
  isHighlighted?: boolean
  isDestination?: boolean
}

function gridStyle(pos: GridPosition): React.CSSProperties {
  return {
    gridColumn: `${pos.col} / span ${pos.colSpan ?? 1}`,
    gridRow: `${pos.row} / span ${pos.rowSpan ?? 1}`,
  }
}

export function RoomBlock({ room, onTap, isHighlighted, isDestination }: RoomBlockProps) {
  const { Icon, blockClass, iconClass } = CATEGORY_STYLES[room.category]

  return (
    <button
      type="button"
      onClick={onTap}
      style={gridStyle(room.gridPosition)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 min-h-[88px]',
        'transition-all duration-150 active:scale-[0.97]',
        blockClass,
        (isHighlighted || isDestination) && 'ring-4 ring-primary shadow-[0_0_24px_hsl(var(--primary)/0.4)]'
      )}
    >
      <Icon className={cn('h-8 w-8 shrink-0', iconClass)} />
      <span className="w-full min-w-0 text-xl font-semibold leading-tight text-center line-clamp-2 break-words">
        {room.name}
      </span>
      {isDestination && (
        <span className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <ChevronRight className="h-6 w-6" />
        </span>
      )}
    </button>
  )
}

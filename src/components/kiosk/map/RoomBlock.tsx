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
  const { Icon, iconBg, iconColor } = CATEGORY_STYLES[room.category]
  const onRoute = isHighlighted || isDestination

  return (
    <button
      type="button"
      onClick={onTap}
      style={gridStyle(room.gridPosition)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 min-h-[96px]',
        'bg-card border-border/70 hover:border-border transition-all duration-150 active:scale-[0.97]',
        onRoute && 'border-primary ring-2 ring-primary/60'
      )}
    >
      {onRoute && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: '0 0 28px -4px color-mix(in oklab, var(--primary) 55%, transparent)' }}
        />
      )}
      <div className={cn('flex items-center justify-center h-14 w-14 rounded-2xl shrink-0', iconBg)}>
        <Icon className={cn('h-7 w-7', iconColor)} strokeWidth={1.9} />
      </div>
      <span className="w-full min-w-0 text-xl font-semibold leading-tight text-center line-clamp-2 break-words text-foreground">
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

import { ArrowUp, MapPin } from 'lucide-react'
import type { Heading } from '@/lib/grid-graph'
import type { GridPosition } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CorridorCellProps {
  gridPosition: GridPosition
  label?: string
  icon?: React.ReactNode
  isHighlighted?: boolean
  isOrigin?: boolean
  travelHeading?: Heading
}

function gridStyle(pos: GridPosition): React.CSSProperties {
  return {
    gridColumn: `${pos.col} / span ${pos.colSpan ?? 1}`,
    gridRow: `${pos.row} / span ${pos.rowSpan ?? 1}`,
  }
}

const HEADING_ROTATION: Record<Heading, string> = {
  n: 'rotate-0',
  e: 'rotate-90',
  s: 'rotate-180',
  w: '-rotate-90',
}

export function CorridorCell({ gridPosition, label, icon, isHighlighted, isOrigin, travelHeading }: CorridorCellProps) {
  return (
    <div
      style={gridStyle(gridPosition)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/50 min-h-[64px]',
        isHighlighted && 'bg-primary/10 border-primary border-solid ring-2 ring-primary/50'
      )}
    >
      {isOrigin && (
        <span className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
          <MapPin className="h-5 w-5 text-primary-foreground" />
        </span>
      )}
      {icon}
      {label && (
        <span className="text-xl font-medium text-muted-foreground text-center px-1 leading-tight">{label}</span>
      )}
      {isHighlighted && travelHeading && (
        <ArrowUp className={cn('h-6 w-6 text-primary transition-transform', HEADING_ROTATION[travelHeading])} />
      )}
    </div>
  )
}

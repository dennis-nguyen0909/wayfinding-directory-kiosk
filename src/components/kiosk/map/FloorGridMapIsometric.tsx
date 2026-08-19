import { ArrowUp, ArrowUpDown, Footprints, MapPin, TrendingUp } from 'lucide-react'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import { directionBetweenPositions, type Heading } from '@/lib/grid-graph'
import { gridCellStyle } from '@/lib/grid-style'
import type { Floor, GridPosition, Room, Transition } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Isometric / 2.5D tilt — a real CSS 3D perspective on the same grid, rooms
 * read as small raised blocks ("doll-house" view), corridors stay flatter.
 *
 * Matches the review mockup's tilt (rotateX 42deg, perspective 900px) rather
 * than a conservative angle — room/corridor cells now stretch to fill their
 * actual CSS Grid track (w-full h-full, not just their intrinsic content
 * size), so at kiosk scale (rows ~150px+ at 1920px width) even this steeper
 * tilt's perspective-foreshortened *visual* height stays comfortably above
 * the 64px touch-target floor (min-h-[64px]/min-w-[64px] stay as a hard
 * backstop regardless). Verify this holds if the demo grid size changes —
 * a much denser floor (many more rows/cols) would shrink the per-cell track
 * and could eat into that headroom.
 */

const HEADING_ROTATION: Record<Heading, string> = {
  n: 'rotate-0',
  e: 'rotate-90',
  s: 'rotate-180',
  w: '-rotate-90',
}

const TRANSITION_ICON: Record<Transition['kind'], React.ReactNode> = {
  elevator: <ArrowUpDown className="h-6 w-6 text-primary" />,
  stairs: <Footprints className="h-6 w-6 text-muted-foreground" />,
  ramp: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
}

interface FloorGridMapIsometricProps {
  floor: Floor
  highlightedNodeIds?: string[]
  originCorridorId?: string
  selectedRoomId?: string | null
  destinationRoomId?: string | null
  onSelectRoom: (roomId: string) => void
}

export function FloorGridMapIsometric({
  floor,
  highlightedNodeIds = [],
  originCorridorId,
  selectedRoomId,
  destinationRoomId,
  onSelectRoom,
}: FloorGridMapIsometricProps) {
  const highlightSet = new Set(highlightedNodeIds)

  const travelHeadingFor = (nodeId: string): Heading | undefined => {
    const idx = highlightedNodeIds.indexOf(nodeId)
    if (idx < 0 || idx >= highlightedNodeIds.length - 1) return undefined
    const nextId = highlightedNodeIds[idx + 1]
    const fromPos =
      floor.corridors.find((c) => c.id === nodeId)?.gridPosition ??
      floor.transitions.find((t) => t.id === nodeId)?.gridPosition
    const toPos =
      floor.corridors.find((c) => c.id === nextId)?.gridPosition ??
      floor.transitions.find((t) => t.id === nextId)?.gridPosition ??
      floor.rooms.find((r) => r.id === nextId)?.gridPosition
    if (!fromPos || !toPos) return undefined
    return directionBetweenPositions(fromPos, toPos)
  }

  return (
    <div className="w-full h-full flex items-center justify-center [perspective:900px] p-6">
      <div
        className="grid gap-3 w-[92%] h-[86%] [transform-style:preserve-3d] [transform:rotateX(42deg)]"
        style={{ gridTemplateColumns: `repeat(${floor.cols}, 1fr)`, gridTemplateRows: `repeat(${floor.rows}, 1fr)` }}
      >
        {floor.corridors.map((corridor) => (
          <IsoCorridor
            key={corridor.id}
            gridPosition={corridor.gridPosition}
            label={corridor.label}
            isHighlighted={highlightSet.has(corridor.id)}
            isOrigin={corridor.id === originCorridorId}
            travelHeading={travelHeadingFor(corridor.id)}
          />
        ))}
        {floor.transitions.map((transition) => (
          <IsoCorridor
            key={transition.id}
            gridPosition={transition.gridPosition}
            label={transition.label}
            icon={TRANSITION_ICON[transition.kind]}
            isHighlighted={highlightSet.has(transition.id)}
            isOrigin={transition.id === originCorridorId}
            travelHeading={travelHeadingFor(transition.id)}
          />
        ))}
        {floor.rooms.map((room) => (
          <IsoRoom
            key={room.id}
            room={room}
            onTap={() => onSelectRoom(room.id)}
            isHighlighted={selectedRoomId === room.id || highlightSet.has(room.id)}
            isDestination={destinationRoomId === room.id}
          />
        ))}
      </div>
    </div>
  )
}

function IsoRoom({
  room,
  onTap,
  isHighlighted,
  isDestination,
}: {
  room: Room
  onTap: () => void
  isHighlighted?: boolean
  isDestination?: boolean
}) {
  const { Icon, blockClass, iconClass } = CATEGORY_STYLES[room.category]
  return (
    <button
      type="button"
      onClick={onTap}
      style={{ ...gridCellStyle(room.gridPosition), transform: 'translateZ(6px)' }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-lg border p-3 w-full h-full min-h-[64px] min-w-[64px]',
        'shadow-[0_6px_0_rgba(0,0,0,0.35),0_8px_10px_rgba(0,0,0,0.25)]',
        'transition-transform duration-150 active:scale-[0.97]',
        blockClass,
        (isHighlighted || isDestination) &&
          'ring-4 ring-primary shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_40%,transparent),0_6px_0_rgba(0,0,0,0.35)]'
      )}
    >
      <Icon className={cn('h-7 w-7 shrink-0', iconClass)} />
      <span className="w-full min-w-0 text-lg font-semibold leading-tight text-center line-clamp-2 break-words">
        {room.name}
      </span>
    </button>
  )
}

function IsoCorridor({
  gridPosition,
  label,
  icon,
  isHighlighted,
  isOrigin,
  travelHeading,
}: {
  gridPosition: GridPosition
  label?: string
  icon?: React.ReactNode
  isHighlighted?: boolean
  isOrigin?: boolean
  travelHeading?: Heading
}) {
  return (
    <div
      style={{ ...gridCellStyle(gridPosition), transform: 'translateZ(1px)' }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border/70 bg-muted/30 w-full h-full min-h-[64px]',
        isHighlighted && 'bg-primary/10 border-primary border-solid ring-2 ring-primary/50'
      )}
    >
      {isOrigin && (
        <span className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center motion-safe:animate-[pulse-ring_1.8s_ease-in-out_infinite]">
          <MapPin className="h-5 w-5 text-primary-foreground" />
        </span>
      )}
      {icon}
      {label && (
        <span className="text-lg font-medium text-muted-foreground text-center px-1 leading-tight">{label}</span>
      )}
      {isHighlighted && travelHeading && (
        <ArrowUp className={cn('h-6 w-6 text-primary transition-transform', HEADING_ROTATION[travelHeading])} />
      )}
    </div>
  )
}

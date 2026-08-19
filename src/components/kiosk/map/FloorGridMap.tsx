import { ArrowUpDown, Footprints, MapPin, TrendingUp } from 'lucide-react'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import { directionBetweenPositions, type Heading, isOrthogonallyAdjacent } from '@/lib/grid-graph'
import { gridCellCenter, gridCellStyle } from '@/lib/grid-style'
import type { Floor, GridPosition, Room, Transition } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Flat 2D architectural schematic — this is how every real map-based wayfinding
 * product researched for this redesign (Mappedin, concretely) actually renders
 * its floor plan: solid category-tinted room blocks, a thin corridor line
 * network with no per-corridor node circles (those read as "subway diagram,"
 * not a floor plan), a thick accent route line with directional chevron ticks,
 * a filled "you are here" dot, and an oversized pin over the active destination.
 * Single mode — replaces the earlier Diagram/Isometric toggle.
 */

const TRANSITION_ICON: Record<Transition['kind'], React.ReactNode> = {
  elevator: <ArrowUpDown className="h-5 w-5" />,
  stairs: <Footprints className="h-5 w-5" />,
  ramp: <TrendingUp className="h-5 w-5" />,
}

interface WayNode {
  id: string
  gridPosition: GridPosition
}

interface FloorGridMapProps {
  floor: Floor
  highlightedNodeIds?: string[]
  originCorridorId?: string
  selectedRoomId?: string | null
  destinationRoomId?: string | null
  onSelectRoom: (roomId: string) => void
}

const CHEVRON_HALF = 0.09

/** A small arrow-shaped tick pointing `heading`, centered at grid-unit (x, y). */
function Chevron({ x, y, heading }: { x: number; y: number; heading: Heading }) {
  const s = CHEVRON_HALF
  const points: Record<Heading, string> = {
    n: `${x - s},${y + s} ${x},${y - s} ${x + s},${y + s}`,
    s: `${x - s},${y - s} ${x},${y + s} ${x + s},${y - s}`,
    e: `${x - s},${y - s} ${x + s},${y} ${x - s},${y + s}`,
    w: `${x + s},${y - s} ${x - s},${y} ${x + s},${y + s}`,
  }
  return (
    <polyline
      points={points[heading]}
      fill="none"
      className="stroke-primary"
      strokeWidth={0.035}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

export function FloorGridMap({
  floor,
  highlightedNodeIds = [],
  originCorridorId,
  selectedRoomId,
  destinationRoomId,
  onSelectRoom,
}: FloorGridMapProps) {
  const wayNodes: WayNode[] = [
    ...floor.corridors.map((c) => ({ id: c.id, gridPosition: c.gridPosition })),
    ...floor.transitions.map((t) => ({ id: t.id, gridPosition: t.gridPosition })),
  ]
  const highlightSet = new Set(highlightedNodeIds)

  // This floor's local through-node network — same adjacency rule the routing
  // graph uses (grid-graph.ts's isOrthogonallyAdjacent), computed fresh here
  // because this is a rendering concern (draw the network), not a pathfinding
  // one (buildGraph's multi-floor graph lives elsewhere, untouched).
  const edges: [WayNode, WayNode][] = []
  for (let i = 0; i < wayNodes.length; i++) {
    for (let j = i + 1; j < wayNodes.length; j++) {
      if (isOrthogonallyAdjacent(wayNodes[i].gridPosition, wayNodes[j].gridPosition)) {
        edges.push([wayNodes[i], wayNodes[j]])
      }
    }
  }

  const highlightedEdgeKeys = new Set<string>()
  for (let i = 0; i < highlightedNodeIds.length - 1; i++) {
    highlightedEdgeKeys.add([highlightedNodeIds[i], highlightedNodeIds[i + 1]].sort().join('|'))
  }

  return (
    <div className="relative w-full h-full p-4">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${floor.cols} ${floor.rows}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {edges.map(([a, b]) => {
          const pa = gridCellCenter(a.gridPosition)
          const pb = gridCellCenter(b.gridPosition)
          const isRoute = highlightedEdgeKeys.has([a.id, b.id].sort().join('|'))
          return (
            <line
              key={`${a.id}-${b.id}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              strokeLinecap="round"
              className={isRoute ? 'stroke-primary' : 'stroke-border'}
              strokeWidth={isRoute ? 0.09 : 0.035}
            />
          )
        })}
        {edges.map(([a, b]) => {
          const key = [a.id, b.id].sort().join('|')
          if (!highlightedEdgeKeys.has(key)) return null
          // Chevron direction follows travel order along the route, not raw a/b order.
          const aIdx = highlightedNodeIds.indexOf(a.id)
          const bIdx = highlightedNodeIds.indexOf(b.id)
          const [fromPos, toPos] = aIdx < bIdx ? [a.gridPosition, b.gridPosition] : [b.gridPosition, a.gridPosition]
          const heading = directionBetweenPositions(fromPos, toPos)
          const mid = gridCellCenter({
            col: (fromPos.col + toPos.col) / 2,
            row: (fromPos.row + toPos.row) / 2,
          })
          return <Chevron key={`chevron-${key}`} x={mid.x} y={mid.y} heading={heading} />
        })}
      </svg>

      <div
        className="relative grid w-full h-full gap-1.5"
        style={{ gridTemplateColumns: `repeat(${floor.cols}, 1fr)`, gridTemplateRows: `repeat(${floor.rows}, 1fr)` }}
      >
        {floor.corridors.map((corridor) => (
          <div key={corridor.id} style={gridCellStyle(corridor.gridPosition)} className="relative pointer-events-none">
            {corridor.id === originCorridorId && <OriginMarker />}
          </div>
        ))}

        {floor.transitions.map((transition) => (
          <div
            key={transition.id}
            style={gridCellStyle(transition.gridPosition)}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 rounded-md border border-dashed pointer-events-none min-h-[64px]',
              highlightSet.has(transition.id) ? 'border-primary bg-primary/10' : 'border-border/70 bg-muted/20'
            )}
          >
            {transition.id === originCorridorId && <OriginMarker />}
            <span className={highlightSet.has(transition.id) ? 'text-primary' : 'text-muted-foreground'}>
              {TRANSITION_ICON[transition.kind]}
            </span>
            <span className="text-base font-medium text-muted-foreground text-center leading-tight px-1">
              {transition.label}
            </span>
          </div>
        ))}

        {floor.rooms.map((room) => (
          <RoomBlock
            key={room.id}
            room={room}
            isSelected={selectedRoomId === room.id}
            isHighlighted={highlightSet.has(room.id)}
            isDestination={destinationRoomId === room.id}
            onSelect={() => onSelectRoom(room.id)}
          />
        ))}
      </div>
    </div>
  )
}

function OriginMarker() {
  return (
    <span className="absolute -top-2 -left-2 z-10 flex items-center justify-center h-4 w-4">
      <span className="absolute inset-0 rounded-full bg-primary motion-safe:animate-[pulse-ring_1.8s_ease-in-out_infinite]" />
      <span className="relative h-4 w-4 rounded-full bg-primary border-2 border-background" />
    </span>
  )
}

function RoomBlock({
  room,
  isSelected,
  isHighlighted,
  isDestination,
  onSelect,
}: {
  room: Room
  isSelected: boolean
  isHighlighted: boolean
  isDestination: boolean
  onSelect: () => void
}) {
  const { Icon, iconClass, blockClass } = CATEGORY_STYLES[room.category]
  const isActive = isSelected || isHighlighted || isDestination
  return (
    <button
      type="button"
      onClick={onSelect}
      style={gridCellStyle(room.gridPosition)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 p-2 min-h-[64px] min-w-[64px]',
        'transition-all duration-150 active:scale-[0.97]',
        blockClass,
        isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {isDestination && (
        <MapPin className="absolute -top-5 left-1/2 -translate-x-1/2 h-7 w-7 text-primary fill-primary/25" />
      )}
      <Icon className={cn('h-6 w-6 shrink-0', iconClass)} />
      <span className="text-lg font-semibold text-foreground text-center leading-tight line-clamp-2 break-words px-1">
        {room.name}
      </span>
    </button>
  )
}

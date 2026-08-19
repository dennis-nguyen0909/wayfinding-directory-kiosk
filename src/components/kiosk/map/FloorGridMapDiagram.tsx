import { ArrowUpDown, Footprints, MapPin, TrendingUp } from 'lucide-react'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import { directionBetweenPositions, isOrthogonallyAdjacent } from '@/lib/grid-graph'
import { gridCellCenter, gridCellStyle } from '@/lib/grid-style'
import type { Floor, GridPosition, Room, Transition } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Diagram / door-notch schematic — no boxes for rooms, a drawn corridor path
 * (an SVG overlay reflecting this floor's REAL adjacency graph, not a straight
 * decorative line) with circular through-nodes, and a short notch tick marking
 * where each room's entrance meets the corridor. Closest to real wayfinding
 * signage/subway-diagram convention.
 *
 * Two layers over the same grid: an SVG (viewBox in grid units, matching a CSS
 * Grid's own coordinate space) draws the connecting lines; a real CSS-grid
 * layer on top holds the actual DOM nodes/room buttons, for accessible,
 * doctrine-sized touch targets.
 */

const TRANSITION_ICON: Record<Transition['kind'], React.ReactNode> = {
  elevator: <ArrowUpDown className="h-5 w-5" />,
  stairs: <Footprints className="h-5 w-5" />,
  ramp: <TrendingUp className="h-5 w-5" />,
}

/** Grid-unit clearance a room's notch stops short of its connector's node circle. */
const NODE_APPROACH_GAP = 0.16

interface WayNode {
  id: string
  gridPosition: GridPosition
  label?: string
  icon?: React.ReactNode
}

interface FloorGridMapDiagramProps {
  floor: Floor
  highlightedNodeIds?: string[]
  originCorridorId?: string
  selectedRoomId?: string | null
  destinationRoomId?: string | null
  onSelectRoom: (roomId: string) => void
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function FloorGridMapDiagram({
  floor,
  highlightedNodeIds = [],
  originCorridorId,
  selectedRoomId,
  destinationRoomId,
  onSelectRoom,
}: FloorGridMapDiagramProps) {
  const wayNodes: WayNode[] = [
    ...floor.corridors.map((c) => ({ id: c.id, gridPosition: c.gridPosition, label: c.label })),
    ...floor.transitions.map((t) => ({
      id: t.id,
      gridPosition: t.gridPosition,
      label: t.label,
      icon: TRANSITION_ICON[t.kind],
    })),
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
    const a = highlightedNodeIds[i]
    const b = highlightedNodeIds[i + 1]
    highlightedEdgeKeys.add([a, b].sort().join('|'))
  }

  // Each room's connector — touching + entranceSide preference, else nearest
  // touching, else nearest by distance. Mirrors grid-graph.ts's buildGraph
  // room-connection rule so the notch never draws a connection routing wouldn't.
  function connectorFor(room: Room): WayNode | undefined {
    const touching = wayNodes.filter((n) => isOrthogonallyAdjacent(room.gridPosition, n.gridPosition))
    if (room.entranceSide) {
      const preferred = touching.find(
        (n) => directionBetweenPositions(room.gridPosition, n.gridPosition) === room.entranceSide
      )
      if (preferred) return preferred
    }
    if (touching[0]) return touching[0]
    if (wayNodes.length === 0) return undefined
    const roomCenter = gridCellCenter(room.gridPosition)
    return [...wayNodes].sort(
      (a, b) => dist(roomCenter, gridCellCenter(a.gridPosition)) - dist(roomCenter, gridCellCenter(b.gridPosition))
    )[0]
  }

  const lastHighlighted = highlightedNodeIds[highlightedNodeIds.length - 1]

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
              strokeWidth={isRoute ? 0.05 : 0.02}
            />
          )
        })}
        {floor.rooms.map((room) => {
          const connector = connectorFor(room)
          if (!connector) return null
          const roomCenter = gridCellCenter(room.gridPosition)
          const nodeCenter = gridCellCenter(connector.gridPosition)
          // Anchor the stub to the room's declared entranceSide (falling back to the
          // raw direction toward its connector) rather than drawing a straight line
          // between the two cell centers. A center-to-center line goes diagonal for
          // any colSpan room whose center doesn't sit above its connector (e.g. The
          // Summit Conference Center) — forcing the perpendicular axis keeps every
          // notch a clean vertical/horizontal tick, like a real signage schematic.
          const heading = room.entranceSide ?? directionBetweenPositions(room.gridPosition, connector.gridPosition)
          const isVertical = heading === 'n' || heading === 's'
          const sign = heading === 'n' || heading === 'w' ? -1 : 1
          const roomHalfExtent = (isVertical ? (room.gridPosition.rowSpan ?? 1) : (room.gridPosition.colSpan ?? 1)) / 2
          const trunk = isVertical ? nodeCenter.y : nodeCenter.x
          // Start right at the room's own edge (not its center) and stop just short
          // of the through-node circle, so the tick reads as touching the corridor
          // instead of floating disconnected above it.
          const start = (isVertical ? roomCenter.y : roomCenter.x) + sign * roomHalfExtent
          const end = trunk - sign * NODE_APPROACH_GAP
          const x1 = isVertical ? roomCenter.x : start
          const y1 = isVertical ? start : roomCenter.y
          const x2 = isVertical ? roomCenter.x : end
          const y2 = isVertical ? end : roomCenter.y
          const isRouteNotch = destinationRoomId === room.id && lastHighlighted === connector.id
          return (
            <line
              key={`notch-${room.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeLinecap="round"
              className={isRouteNotch ? 'stroke-primary' : 'stroke-border'}
              strokeWidth={isRouteNotch ? 0.05 : 0.025}
            />
          )
        })}
      </svg>

      <div
        className="relative grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${floor.cols}, 1fr)`, gridTemplateRows: `repeat(${floor.rows}, 1fr)` }}
      >
        {wayNodes.map((node) => (
          <div
            key={node.id}
            style={gridCellStyle(node.gridPosition)}
            className="relative flex flex-col items-center justify-center gap-1 pointer-events-none min-h-[64px]"
          >
            <span
              className={cn(
                'relative flex items-center justify-center h-12 w-12 rounded-full border-2 bg-background text-muted-foreground shrink-0',
                highlightSet.has(node.id)
                  ? 'border-primary text-primary shadow-[0_0_16px_color-mix(in_oklab,var(--primary)_45%,transparent)]'
                  : 'border-border'
              )}
            >
              {node.id === originCorridorId && (
                <span className="absolute -top-1.5 -left-1.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center motion-safe:animate-[pulse-ring_1.8s_ease-in-out_infinite]">
                  <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
                </span>
              )}
              {node.icon}
            </span>
            {node.label && (
              <span className="text-lg font-medium text-muted-foreground text-center leading-tight px-1">
                {node.label}
              </span>
            )}
          </div>
        ))}

        {floor.rooms.map((room) => {
          const { Icon, iconClass } = CATEGORY_STYLES[room.category]
          const isActive = selectedRoomId === room.id || highlightSet.has(room.id) || destinationRoomId === room.id
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room.id)}
              style={gridCellStyle(room.gridPosition)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 min-h-[64px] min-w-[64px] rounded-lg',
                'transition-transform duration-150 active:scale-[0.97]'
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 shrink-0',
                  isActive
                    ? 'text-primary drop-shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_55%,transparent)]'
                    : iconClass
                )}
              />
              <span
                className={cn(
                  'text-lg text-center leading-tight line-clamp-2 break-words px-1',
                  isActive ? 'font-semibold text-primary' : 'font-medium text-foreground'
                )}
              >
                {room.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

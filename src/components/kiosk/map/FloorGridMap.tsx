import { ArrowUpDown, Footprints, TrendingUp } from 'lucide-react'
import { directionBetweenPositions, type Heading } from '@/lib/grid-graph'
import type { Floor, Transition } from '@/lib/types'
import { CorridorCell } from './CorridorCell'
import { RoomBlock } from './RoomBlock'

const TRANSITION_ICON: Record<Transition['kind'], React.ReactNode> = {
  elevator: <ArrowUpDown className="h-6 w-6 text-primary" strokeWidth={1.9} />,
  stairs: <Footprints className="h-6 w-6 text-muted-foreground" strokeWidth={1.9} />,
  ramp: <TrendingUp className="h-6 w-6 text-muted-foreground" strokeWidth={1.9} />,
}

interface FloorGridMapProps {
  floor: Floor
  /** Node ids of the active route that fall on this floor, in travel order. */
  highlightedNodeIds?: string[]
  originCorridorId?: string
  selectedRoomId?: string | null
  destinationRoomId?: string | null
  onSelectRoom: (roomId: string) => void
}

export function FloorGridMap({
  floor,
  highlightedNodeIds = [],
  originCorridorId,
  selectedRoomId,
  destinationRoomId,
  onSelectRoom,
}: FloorGridMapProps) {
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
    <div
      className="grid gap-3 w-full h-full p-4"
      style={{
        gridTemplateColumns: `repeat(${floor.cols}, 1fr)`,
        gridTemplateRows: `repeat(${floor.rows}, 1fr)`,
      }}
    >
      {floor.corridors.map((corridor) => (
        <CorridorCell
          key={corridor.id}
          gridPosition={corridor.gridPosition}
          label={corridor.label}
          isHighlighted={highlightSet.has(corridor.id)}
          isOrigin={corridor.id === originCorridorId}
          travelHeading={travelHeadingFor(corridor.id)}
        />
      ))}
      {floor.transitions.map((transition) => (
        <CorridorCell
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
        <RoomBlock
          key={room.id}
          room={room}
          onTap={() => onSelectRoom(room.id)}
          isHighlighted={selectedRoomId === room.id || highlightSet.has(room.id)}
          isDestination={destinationRoomId === room.id}
        />
      ))}
    </div>
  )
}

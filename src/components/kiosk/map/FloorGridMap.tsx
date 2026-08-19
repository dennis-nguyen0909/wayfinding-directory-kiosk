import type { Floor } from '@/lib/types'
import { useKiosk } from '../shell/KioskProvider'
import { FloorGridMapDiagram } from './FloorGridMapDiagram'
import { FloorGridMapIsometric } from './FloorGridMapIsometric'

interface FloorGridMapProps {
  floor: Floor
  /** Node ids of the active route that fall on this floor, in travel order. */
  highlightedNodeIds?: string[]
  originCorridorId?: string
  selectedRoomId?: string | null
  destinationRoomId?: string | null
  onSelectRoom: (roomId: string) => void
}

/** Resolves which floor-map render mode is active and delegates to it — both
 * modes consume the same resolved data (floor/route/selection/origin); this
 * component owns no rendering of its own. */
export function FloorGridMap(props: FloorGridMapProps) {
  const { mapDisplayMode } = useKiosk()
  return mapDisplayMode === 'isometric' ? <FloorGridMapIsometric {...props} /> : <FloorGridMapDiagram {...props} />
}

import type { Building, GridPosition, Room, Transition } from './types'

/** A through-node in the merged multi-floor graph — a Corridor or Transition cell. */
interface WayNode {
  id: string
  floorId: string
  kind: 'corridor' | 'transition'
  gridPosition: GridPosition
  label?: string
}

interface Edge {
  to: string
  weight: number
}

export interface WayGraph {
  /** Through-nodes only (corridors + transitions), keyed by id. */
  wayNodes: Map<string, WayNode>
  /** Adjacency among through-nodes, keyed by node id. */
  edges: Map<string, Edge[]>
  /** Room -> its single connecting through-node id. */
  roomEntry: Map<string, string>
  /** Room lookup, keyed by id. */
  rooms: Map<string, Room & { floorId: string }>
}

const TRANSITION_WEIGHT: Record<Transition['kind'], number> = {
  elevator: 15,
  stairs: 25,
  ramp: 20,
}

function span(pos: GridPosition) {
  return { colSpan: pos.colSpan ?? 1, rowSpan: pos.rowSpan ?? 1 }
}

function center(pos: GridPosition) {
  const { colSpan, rowSpan } = span(pos)
  return { x: pos.col + (colSpan - 1) / 2, y: pos.row + (rowSpan - 1) / 2 }
}

function distance(a: GridPosition, b: GridPosition) {
  const ca = center(a)
  const cb = center(b)
  return Math.hypot(ca.x - cb.x, ca.y - cb.y)
}

/** True if two grid cells share an edge (orthogonal adjacency), not just a corner. */
function isOrthogonallyAdjacent(a: GridPosition, b: GridPosition): boolean {
  const aColSpan = a.colSpan ?? 1
  const aRowSpan = a.rowSpan ?? 1
  const bColSpan = b.colSpan ?? 1
  const bRowSpan = b.rowSpan ?? 1

  const aColEnd = a.col + aColSpan - 1
  const aRowEnd = a.row + aRowSpan - 1
  const bColEnd = b.col + bColSpan - 1
  const bRowEnd = b.row + bRowSpan - 1

  const colsOverlap = a.col <= bColEnd && b.col <= aColEnd
  const rowsOverlap = a.row <= bRowEnd && b.row <= aRowEnd

  // Touching vertically (share a horizontal edge): rows are adjacent, columns overlap.
  const verticallyTouching = (aRowEnd + 1 === b.row || bRowEnd + 1 === a.row) && colsOverlap
  // Touching horizontally (share a vertical edge): columns are adjacent, rows overlap.
  const horizontallyTouching = (aColEnd + 1 === b.col || bColEnd + 1 === a.col) && rowsOverlap

  return verticallyTouching || horizontallyTouching
}

function addEdge(edges: Map<string, Edge[]>, a: string, b: string, weight: number) {
  if (!edges.has(a)) edges.set(a, [])
  if (!edges.has(b)) edges.set(b, [])
  edges.get(a)!.push({ to: b, weight })
  edges.get(b)!.push({ to: a, weight })
}

/** Builds the merged multi-floor adjacency graph from the building config. */
export function buildGraph(building: Building): WayGraph {
  const wayNodes = new Map<string, WayNode>()
  const edges = new Map<string, Edge[]>()
  const roomEntry = new Map<string, string>()
  const rooms = new Map<string, Room & { floorId: string }>()

  const nodesByFloor = new Map<string, WayNode[]>()

  for (const floor of building.floors) {
    const floorNodes: WayNode[] = []
    for (const corridor of floor.corridors) {
      const node: WayNode = {
        id: corridor.id,
        floorId: floor.id,
        kind: 'corridor',
        gridPosition: corridor.gridPosition,
        label: corridor.label,
      }
      wayNodes.set(corridor.id, node)
      floorNodes.push(node)
    }
    for (const transition of floor.transitions) {
      const node: WayNode = {
        id: transition.id,
        floorId: floor.id,
        kind: 'transition',
        gridPosition: transition.gridPosition,
        label: transition.label,
      }
      wayNodes.set(transition.id, node)
      floorNodes.push(node)
    }
    nodesByFloor.set(floor.id, floorNodes)

    for (const room of floor.rooms) {
      rooms.set(room.id, { ...room, floorId: floor.id })
    }
  }

  // Intra-floor through-node adjacency.
  for (const floor of building.floors) {
    const floorNodes = nodesByFloor.get(floor.id)!
    for (let i = 0; i < floorNodes.length; i++) {
      for (let j = i + 1; j < floorNodes.length; j++) {
        const a = floorNodes[i]
        const b = floorNodes[j]
        if (isOrthogonallyAdjacent(a.gridPosition, b.gridPosition)) {
          addEdge(edges, a.id, b.id, distance(a.gridPosition, b.gridPosition))
        }
      }
    }
  }

  // Cross-floor transition edges (same groupId).
  const byGroup = new Map<string, Transition[]>()
  for (const floor of building.floors) {
    for (const t of floor.transitions) {
      if (!byGroup.has(t.groupId)) byGroup.set(t.groupId, [])
      byGroup.get(t.groupId)!.push(t)
    }
  }
  for (const group of byGroup.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i]
        const b = group[j]
        if (a.kind !== b.kind) continue // only link same-kind transitions across floors
        addEdge(edges, a.id, b.id, TRANSITION_WEIGHT[a.kind])
      }
    }
  }

  // Room -> its single through-node: prefer the touching cell in the declared
  // `entranceSide` direction (by relative center position), else any touching cell.
  const directionOf = (from: GridPosition, to: GridPosition): 'n' | 's' | 'e' | 'w' => {
    const a = center(from)
    const b = center(to)
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : dy > 0 ? 's' : 'n'
  }

  for (const floor of building.floors) {
    const floorNodes = nodesByFloor.get(floor.id)!
    for (const room of floor.rooms) {
      const touching = floorNodes.filter((n) => isOrthogonallyAdjacent(room.gridPosition, n.gridPosition))
      let connected: WayNode | undefined

      if (room.entranceSide) {
        connected = touching.find((n) => directionOf(room.gridPosition, n.gridPosition) === room.entranceSide)
      }

      if (!connected) {
        connected = touching[0]
      }

      if (!connected && floorNodes.length > 0) {
        // Fallback: nearest through-node by center distance. Authoring mistake — warn loudly.
        connected = [...floorNodes].sort(
          (a, b) => distance(room.gridPosition, a.gridPosition) - distance(room.gridPosition, b.gridPosition)
        )[0]
        // eslint-disable-next-line no-console
        console.warn(
          `[building.ts] Room "${room.name}" (${room.id}) does not touch any corridor/transition cell on floor "${floor.id}". ` +
            `Falling back to nearest connector "${connected.id}" by distance — check its gridPosition.`
        )
      }

      if (connected) {
        addEdge(edges, room.id, connected.id, distance(room.gridPosition, connected.gridPosition) || 1)
        roomEntry.set(room.id, connected.id)
      }
    }
  }

  return { wayNodes, edges, roomEntry, rooms }
}

export interface PathResult {
  /** Ordered node ids (rooms + through-nodes) from origin to destination, inclusive. */
  nodeIds: string[]
  totalCost: number
}

/** Linear-scan Dijkstra — the graph is small (dozens of nodes), a heap buys nothing here. */
export function shortestPath(graph: WayGraph, fromId: string, toId: string): PathResult | null {
  const allIds = new Set<string>([...graph.wayNodes.keys(), ...graph.rooms.keys()])
  if (!allIds.has(fromId) || !allIds.has(toId)) return null

  const dist = new Map<string, number>()
  const prev = new Map<string, string>()
  const visited = new Set<string>()

  for (const id of allIds) dist.set(id, Infinity)
  dist.set(fromId, 0)

  const neighborsOf = (id: string): Edge[] => {
    const throughEdges = graph.edges.get(id) ?? []
    if (graph.roomEntry.has(id)) {
      const entry = graph.roomEntry.get(id)!
      const room = graph.rooms.get(id)
      const entryNode = graph.wayNodes.get(entry)
      const weight = room && entryNode ? distance(room.gridPosition, entryNode.gridPosition) || 1 : 1
      return [...throughEdges, { to: entry, weight }]
    }
    return throughEdges
  }

  while (visited.size < allIds.size) {
    let current: string | null = null
    let currentDist = Infinity
    for (const id of allIds) {
      if (!visited.has(id) && dist.get(id)! < currentDist) {
        current = id
        currentDist = dist.get(id)!
      }
    }
    if (current === null) break
    if (current === toId) break
    visited.add(current)

    for (const edge of neighborsOf(current)) {
      if (visited.has(edge.to)) continue
      const alt = currentDist + edge.weight
      if (alt < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, alt)
        prev.set(edge.to, current)
      }
    }
  }

  if (!prev.has(toId) && fromId !== toId) return null

  const nodeIds: string[] = [toId]
  let cursor = toId
  while (cursor !== fromId) {
    const p = prev.get(cursor)
    if (!p) return null
    nodeIds.unshift(p)
    cursor = p
  }

  return { nodeIds, totalCost: dist.get(toId) ?? 0 }
}

export interface FloorSegment {
  floorId: string
  floorLabel: string
  nodeIds: string[]
  /** Transition taken to leave this segment for the next one, if any. */
  exitTransition?: Transition & { toFloorLabel: string }
}

/** Splits a path into per-floor segments, tagging the transition used between segments. */
export function splitIntoFloorSegments(building: Building, graph: WayGraph, path: PathResult): FloorSegment[] {
  const floorOf = (id: string): string | undefined => {
    const way = graph.wayNodes.get(id)
    if (way) return way.floorId
    const room = graph.rooms.get(id)
    return room?.floorId
  }

  const floorLabel = (floorId: string) => building.floors.find((f) => f.id === floorId)?.label ?? floorId

  const segments: FloorSegment[] = []
  let currentFloor: string | undefined
  let currentNodes: string[] = []

  for (const id of path.nodeIds) {
    const f = floorOf(id)
    if (f && f !== currentFloor) {
      if (currentNodes.length > 0 && currentFloor) {
        segments.push({ floorId: currentFloor, floorLabel: floorLabel(currentFloor), nodeIds: currentNodes })
      }
      currentFloor = f
      currentNodes = [id]
    } else {
      currentNodes.push(id)
    }
  }
  if (currentNodes.length > 0 && currentFloor) {
    segments.push({ floorId: currentFloor, floorLabel: floorLabel(currentFloor), nodeIds: currentNodes })
  }

  // Tag each segment's exit transition (last node of segment, if it's a transition and the
  // next segment starts on a different floor via the same groupId).
  for (let i = 0; i < segments.length - 1; i++) {
    const lastId = segments[i].nodeIds[segments[i].nodeIds.length - 1]
    const way = graph.wayNodes.get(lastId)
    if (way?.kind === 'transition') {
      const floor = building.floors.find((f) => f.id === way.floorId)
      const transition = floor?.transitions.find((t) => t.id === lastId)
      if (transition) {
        segments[i].exitTransition = { ...transition, toFloorLabel: segments[i + 1].floorLabel }
      }
    }
  }

  return segments
}

export function getNodeGridPosition(graph: WayGraph, id: string): GridPosition | undefined {
  const way = graph.wayNodes.get(id)
  if (way) return way.gridPosition
  const room = graph.rooms.get(id)
  return room?.gridPosition
}

export type Heading = 'n' | 's' | 'e' | 'w'

/** Cardinal direction from grid position `a` toward `b`, by cell-center delta. */
export function directionBetweenPositions(a: GridPosition, b: GridPosition): Heading {
  const ca = center(a)
  const cb = center(b)
  const dx = cb.x - ca.x
  const dy = cb.y - ca.y
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : dy > 0 ? 's' : 'n'
}

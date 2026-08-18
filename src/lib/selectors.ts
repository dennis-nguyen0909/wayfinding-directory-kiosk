import { buildGraph, shortestPath, splitIntoFloorSegments, type WayGraph } from './grid-graph'
import { buildDirections, type DirectionStep } from './route-steps'
import type { Building, Room, RoomCategory } from './types'

export interface RoomWithFloor extends Room {
  floorId: string
  floorLabel: string
}

export function allRooms(building: Building): RoomWithFloor[] {
  return building.floors.flatMap((floor) =>
    floor.rooms.map((room) => ({ ...room, floorId: floor.id, floorLabel: floor.label }))
  )
}

export function searchRooms(building: Building, query: string, category: RoomCategory | null): RoomWithFloor[] {
  const q = query.trim().toLowerCase()
  return allRooms(building).filter((room) => {
    if (category && room.category !== category) return false
    if (!q) return true
    const haystack = [room.name, room.description ?? '', ...(room.keywords ?? [])].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

export function getRoomById(building: Building, roomId: string): RoomWithFloor | undefined {
  return allRooms(building).find((r) => r.id === roomId)
}

export interface RouteResult {
  found: true
  segments: ReturnType<typeof splitIntoFloorSegments>
  steps: DirectionStep[]
  totalFloorsCrossed: number
}

export interface RouteNotFound {
  found: false
}

let cachedGraph: { building: Building; graph: WayGraph } | null = null

function getGraph(building: Building): WayGraph {
  if (cachedGraph?.building === building) return cachedGraph.graph
  const graph = buildGraph(building)
  cachedGraph = { building, graph }
  return graph
}

/** Resolves a route from a corridor/transition origin to a destination room. */
export function routeBetween(
  building: Building,
  fromCorridorId: string,
  toRoomId: string
): RouteResult | RouteNotFound {
  const graph = getGraph(building)
  const room = getRoomById(building, toRoomId)
  if (!room) return { found: false }

  const path = shortestPath(graph, fromCorridorId, toRoomId)
  if (!path) return { found: false }

  const segments = splitIntoFloorSegments(building, graph, path)
  const steps = buildDirections(graph, segments, room.name)

  return {
    found: true,
    segments,
    steps,
    totalFloorsCrossed: segments.length,
  }
}

export function findCorridorLabel(building: Building, corridorId: string): string | undefined {
  for (const floor of building.floors) {
    const c = floor.corridors.find((c) => c.id === corridorId)
    if (c) return c.label
  }
  return undefined
}

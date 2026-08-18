/**
 * Building data model — grid-schematic, not pixel/SVG geometry.
 *
 * Every walkable thing on a floor sits on an integer grid cell (col/row), never a
 * percentage or pixel coordinate. This is the whole point of the design: an AI
 * remix agent (or a human) can describe a building in plain English ("reception
 * is top-left, the cafe is next to it") and produce a correct, non-overlapping,
 * automatically-routable layout without ever drawing artwork or picking coordinates.
 *
 * Three kinds of cell:
 * - Room      — a LEAF. One entrance, never a through-path. Where visitors go.
 * - Corridor  — a THROUGH-WAY. Auto-connects to orthogonally-adjacent corridor/
 *               transition cells. Rooms attach to the nearest touching corridor.
 * - Transition — a THROUGH-WAY that also links floors (elevator/stairs/ramp)
 *               via a shared `groupId`.
 */

export type RoomCategory = 'dining' | 'services' | 'business' | 'amenity' | 'restroom' | 'meeting'

export interface GridPosition {
  col: number
  row: number
  /** Defaults to 1. */
  colSpan?: number
  /** Defaults to 1. */
  rowSpan?: number
}

export interface Room {
  id: string
  name: string
  category: RoomCategory
  gridPosition: GridPosition
  /**
   * Which side touches its corridor. Omit to auto-detect (nearest orthogonally
   * touching corridor/transition cell; falls back to nearest-by-distance with a
   * dev-console warning if nothing actually touches — that warning is the only
   * "debug tool" this design needs, no visual pin-placement UI required).
   */
  entranceSide?: 'n' | 's' | 'e' | 'w'
  keywords?: string[]
  hours?: string
  phone?: string
  description?: string
}

export interface Corridor {
  id: string
  gridPosition: GridPosition
  /**
   * Landmark label for turn-by-turn copy ("Main Entrance", "Elevator Lobby").
   * Optional — plain corridor segments don't need one.
   */
  label?: string
}

export interface Transition {
  id: string
  /** Shared across floors — cells with the same groupId are the same elevator/stair. */
  groupId: string
  floorId: string
  gridPosition: GridPosition
  kind: 'elevator' | 'stairs' | 'ramp'
  label: string
}

export interface Floor {
  id: string
  label: string
  cols: number
  rows: number
  rooms: Room[]
  corridors: Corridor[]
  transitions: Transition[]
}

export interface CategoryMeta {
  id: RoomCategory
  label: string
}

export interface Building {
  name: string
  tagline: string
  /** Corridor id used as the routing origin when no device attribute / QR param is present. */
  defaultEntryCorridorId: string
  categories: CategoryMeta[]
  floors: Floor[]
}

/** A resolved "walkable" node in the merged multi-floor graph — a Corridor or Transition. */
export type WayNode = ({ kind: 'corridor'; floorId: string } & Corridor) | ({ kind: 'transition' } & Transition)

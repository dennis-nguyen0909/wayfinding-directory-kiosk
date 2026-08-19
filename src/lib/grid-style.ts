import type { GridPosition } from './types'

/** CSS grid placement for a cell — shared by every floor-map render mode. */
export function gridCellStyle(pos: GridPosition): React.CSSProperties {
  return {
    gridColumn: `${pos.col} / span ${pos.colSpan ?? 1}`,
    gridRow: `${pos.row} / span ${pos.rowSpan ?? 1}`,
  }
}

/** Cell center in grid units (0-indexed, matches a CSS Grid's own coordinate space —
 * column 1 spans [0,1), so its center is 0.5), for SVG overlays drawn with
 * viewBox="0 0 {cols} {rows}" over the same grid. */
export function gridCellCenter(pos: GridPosition): { x: number; y: number } {
  const colSpan = pos.colSpan ?? 1
  const rowSpan = pos.rowSpan ?? 1
  return { x: pos.col - 1 + colSpan / 2, y: pos.row - 1 + rowSpan / 2 }
}

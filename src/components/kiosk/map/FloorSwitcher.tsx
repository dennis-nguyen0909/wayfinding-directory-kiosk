import { cn } from '@/lib/utils'

interface FloorSwitcherProps {
  floors: { id: string; label: string }[]
  activeFloorId: string
  onSelect: (floorId: string) => void
  /** Floors visited by the active route, in order — shown as progress context. */
  routeFloorIds?: string[]
}

/**
 * Compact corner capsule — Mappedin's "Level N" floor switcher, adapted to this
 * app's 64px touch-target doctrine. A real closed `<select>`'s hit area is far
 * under 64px, so this stays a row of full-size buttons, just visually condensed
 * into one pill instead of a full-width row. Buttons show each floor's
 * 1-indexed position rather than its full label — floor labels can be long
 * ("2nd Floor — Business Suites") and would force wrapping/overflow inside a
 * corner-pinned capsule; the active floor's full name shows as a caption below
 * the capsule instead.
 */
export function FloorSwitcher({ floors, activeFloorId, onSelect, routeFloorIds }: FloorSwitcherProps) {
  const activeFloor = floors.find((f) => f.id === activeFloorId)
  const routeIndex = routeFloorIds?.indexOf(activeFloorId) ?? -1

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
      <div className="flex gap-1.5 rounded-full border border-border bg-card/95 backdrop-blur-sm p-1.5 shadow-lg">
        {floors.map((floor, i) => {
          const isActive = floor.id === activeFloorId
          const isOnRoute = routeFloorIds?.includes(floor.id)
          return (
            <button
              key={floor.id}
              type="button"
              onClick={() => onSelect(floor.id)}
              aria-label={floor.label}
              aria-current={isActive}
              className={cn(
                'min-h-[64px] min-w-[64px] rounded-full text-xl font-bold transition-all duration-150 active:scale-[0.97]',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isOnRoute
                    ? 'bg-primary/15 text-foreground'
                    : 'text-muted-foreground hover:bg-accent'
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <span className="rounded-full bg-card/95 backdrop-blur-sm border border-border px-4 py-1.5 text-base font-mono text-muted-foreground max-w-[260px] truncate">
        {activeFloor?.label}
        {routeFloorIds && routeFloorIds.length > 1 && routeIndex >= 0 && ` · ${routeIndex + 1}/${routeFloorIds.length}`}
      </span>
    </div>
  )
}

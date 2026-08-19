import { cn } from '@/lib/utils'

interface FloorSwitcherProps {
  floors: { id: string; label: string }[]
  activeFloorId: string
  onSelect: (floorId: string) => void
  /** Floors visited by the active route, in order — shown as progress context. */
  routeFloorIds?: string[]
}

export function FloorSwitcher({ floors, activeFloorId, onSelect, routeFloorIds }: FloorSwitcherProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-card/60 p-2">
        {floors.map((floor) => {
          const isActive = floor.id === activeFloorId
          const isOnRoute = routeFloorIds?.includes(floor.id)
          return (
            <button
              key={floor.id}
              type="button"
              onClick={() => onSelect(floor.id)}
              className={cn(
                'min-h-[64px] px-6 rounded-xl text-xl font-semibold transition-all duration-150 active:scale-[0.97] border',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : isOnRoute
                    ? 'bg-primary/10 border-primary/40 text-foreground'
                    : 'bg-transparent border-transparent text-muted-foreground hover:border-border/60'
              )}
            >
              {floor.label}
            </button>
          )
        })}
      </div>
      {routeFloorIds && routeFloorIds.length > 1 && (
        <p className="label-caps">
          Floor {routeFloorIds.indexOf(activeFloorId) + 1} of {routeFloorIds.length} on this route
        </p>
      )}
    </div>
  )
}

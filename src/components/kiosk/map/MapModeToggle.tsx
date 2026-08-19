import { cn } from '@/lib/utils'
import type { MapDisplayMode } from '../shell/KioskProvider'

const MODES: { id: MapDisplayMode; label: string }[] = [
  { id: 'diagram', label: 'Diagram' },
  { id: 'isometric', label: 'Isometric' },
]

interface MapModeToggleProps {
  mode: MapDisplayMode
  onSelect: (mode: MapDisplayMode) => void
}

/** Segmented control switching how the floor map renders — same visual
 * language as FloorSwitcher's floor tabs (active = filled primary). */
export function MapModeToggle({ mode, onSelect }: MapModeToggleProps) {
  return (
    <div className="flex gap-2">
      {MODES.map((m) => {
        const isActive = m.id === mode
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className={cn(
              'min-h-[64px] px-5 rounded-md text-xl font-semibold transition-all duration-150 active:scale-[0.97] border',
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground'
            )}
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}

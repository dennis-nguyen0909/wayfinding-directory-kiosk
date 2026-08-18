import { building } from '@/config/building'
import type { RoomCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  active: RoomCategory | null
  onSelect: (category: RoomCategory | null) => void
}

export function CategoryChips({ active, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'min-h-[64px] px-6 rounded-full text-xl font-semibold border-2 transition-all duration-150 active:scale-[0.97]',
          active === null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background border-border text-muted-foreground'
        )}
      >
        All
      </button>
      {building.categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            'min-h-[64px] px-6 rounded-full text-xl font-semibold border-2 transition-all duration-150 active:scale-[0.97]',
            active === category.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border text-muted-foreground'
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

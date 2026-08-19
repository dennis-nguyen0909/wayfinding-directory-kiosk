import { building } from '@/config/building'
import type { RoomCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  active: RoomCategory | null
  onSelect: (category: RoomCategory | null) => void
}

export function CategoryChips({ active, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-card/60 p-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'min-h-[64px] px-6 rounded-xl text-xl font-semibold border transition-all duration-150 active:scale-[0.97]',
          active === null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-transparent border-transparent text-muted-foreground hover:border-border/60'
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
            'min-h-[64px] px-6 rounded-xl text-xl font-semibold border transition-all duration-150 active:scale-[0.97]',
            active === category.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-transparent border-transparent text-muted-foreground hover:border-border/60'
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

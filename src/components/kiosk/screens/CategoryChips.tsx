import { building } from '@/config/building'
import { CATEGORY_STYLES } from '@/lib/category-meta'
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
          'min-h-[64px] px-6 rounded-full font-mono text-xl uppercase tracking-wide font-semibold border transition-all duration-150 active:scale-[0.97]',
          active === null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background border-border text-muted-foreground'
        )}
      >
        All
      </button>
      {building.categories.map((category) => {
        const { Icon } = CATEGORY_STYLES[category.id]
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              'min-h-[64px] px-6 rounded-full text-xl font-semibold border-2 flex items-center gap-2 transition-all duration-150 active:scale-[0.97]',
              active === category.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {category.label}
          </button>
        )
      })}
    </div>
  )
}

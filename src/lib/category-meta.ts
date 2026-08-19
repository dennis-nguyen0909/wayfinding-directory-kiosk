import { Briefcase, Coffee, DoorClosed, Info, type LucideIcon, Sparkles, Users } from 'lucide-react'
import type { RoomCategory } from './types'

interface CategoryStyle {
  Icon: LucideIcon
  /** Room block treatment — semantic tokens only, distinct per category. */
  blockClass: string
  iconClass: string
}

export const CATEGORY_STYLES: Record<RoomCategory, CategoryStyle> = {
  business: {
    Icon: Briefcase,
    blockClass: 'bg-[hsl(var(--chart-1)/0.12)] border-[hsl(var(--chart-1))] text-foreground',
    iconClass: 'text-[hsl(var(--chart-1))]',
  },
  dining: {
    Icon: Coffee,
    blockClass: 'bg-[hsl(var(--chart-2)/0.12)] border-[hsl(var(--chart-2))] text-foreground',
    iconClass: 'text-[hsl(var(--chart-2))]',
  },
  meeting: {
    Icon: Users,
    blockClass: 'bg-[hsl(var(--chart-3)/0.12)] border-[hsl(var(--chart-3))] text-foreground',
    iconClass: 'text-[hsl(var(--chart-3))]',
  },
  amenity: {
    Icon: Sparkles,
    blockClass: 'bg-[hsl(var(--chart-4)/0.12)] border-[hsl(var(--chart-4))] text-foreground',
    iconClass: 'text-[hsl(var(--chart-4))]',
  },
  services: {
    Icon: Info,
    blockClass: 'bg-[hsl(var(--chart-5)/0.12)] border-[hsl(var(--chart-5))] text-foreground',
    iconClass: 'text-[hsl(var(--chart-5))]',
  },
  restroom: {
    Icon: DoorClosed,
    blockClass: 'bg-muted border-border text-muted-foreground',
    iconClass: 'text-muted-foreground',
  },
}

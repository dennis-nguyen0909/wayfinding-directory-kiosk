import { Briefcase, Coffee, DoorClosed, Info, type LucideIcon, Sparkles, Users } from 'lucide-react'
import type { RoomCategory } from './types'

interface CategoryStyle {
  Icon: LucideIcon
  /** Tinted icon-badge background (list rows, detail header, map tiles). */
  iconBg: string
  /** Icon stroke color — same hue as iconBg. */
  iconColor: string
}

/**
 * Category color-coding — distinct hues via the named `category-*` Tailwind
 * colors (tailwind.config.js), each backed by a plain hex CSS var
 * (src/index.css). Tailwind's own opacity modifier (`/12`, `/45`) handles
 * tinting via color-mix() regardless of the var's format — do NOT hand-roll
 * `hsl(var(--x)/N)` arbitrary values, the vars already hold complete hsl()
 * strings elsewhere in this theme and double-wrapping silently produces
 * invalid (dropped) CSS.
 */
export const CATEGORY_STYLES: Record<RoomCategory, CategoryStyle> = {
  business: {
    Icon: Briefcase,
    iconBg: 'bg-category-business/14',
    iconColor: 'text-category-business',
  },
  dining: {
    Icon: Coffee,
    iconBg: 'bg-category-dining/14',
    iconColor: 'text-category-dining',
  },
  meeting: {
    Icon: Users,
    iconBg: 'bg-category-meeting/14',
    iconColor: 'text-category-meeting',
  },
  amenity: {
    Icon: Sparkles,
    iconBg: 'bg-category-amenity/14',
    iconColor: 'text-category-amenity',
  },
  services: {
    Icon: Info,
    iconBg: 'bg-category-services/14',
    iconColor: 'text-category-services',
  },
  restroom: {
    Icon: DoorClosed,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
}

import { Briefcase, Coffee, DoorClosed, Info, type LucideIcon, Sparkles, Users } from 'lucide-react'
import type { RoomCategory } from './types'

interface CategoryStyle {
  Icon: LucideIcon
  /** Room block treatment — semantic tokens only, distinct per category. */
  blockClass: string
  iconClass: string
  /** Icon-badge background (RoomList rows, RoomDetailCard header) — a tinted
   * circle/square, never a full-tile fill. `category-*` opacity utilities
   * resolve through the Tailwind color group in tailwind.config.js, which
   * reads the plain-hex `--cat-*` tokens in index.css directly — never
   * re-wrapped in hsl(). */
  badgeClass: string
}

export const CATEGORY_STYLES: Record<RoomCategory, CategoryStyle> = {
  business: {
    Icon: Briefcase,
    blockClass: 'bg-category-business/20 border-category-business/60 text-foreground',
    iconClass: 'text-category-business',
    badgeClass: 'bg-category-business/15 text-category-business',
  },
  dining: {
    Icon: Coffee,
    blockClass: 'bg-category-dining/20 border-category-dining/60 text-foreground',
    iconClass: 'text-category-dining',
    badgeClass: 'bg-category-dining/15 text-category-dining',
  },
  meeting: {
    Icon: Users,
    blockClass: 'bg-category-meeting/20 border-category-meeting/60 text-foreground',
    iconClass: 'text-category-meeting',
    badgeClass: 'bg-category-meeting/15 text-category-meeting',
  },
  amenity: {
    Icon: Sparkles,
    blockClass: 'bg-category-amenity/20 border-category-amenity/60 text-foreground',
    iconClass: 'text-category-amenity',
    badgeClass: 'bg-category-amenity/15 text-category-amenity',
  },
  services: {
    Icon: Info,
    blockClass: 'bg-category-services/20 border-category-services/60 text-foreground',
    iconClass: 'text-category-services',
    badgeClass: 'bg-category-services/15 text-category-services',
  },
  restroom: {
    Icon: DoorClosed,
    blockClass: 'bg-muted border-border text-muted-foreground',
    iconClass: 'text-muted-foreground',
    badgeClass: 'bg-muted text-muted-foreground',
  },
}

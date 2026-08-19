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
  /** Gradient-tile background for the browse-grid card's icon-forward "photo"
   * substitute (see RoomList.tsx) — a fixed from/to pair per category, kept as
   * a full literal string since Tailwind's JIT scanner can't resolve a
   * template-interpolated class name. */
  tileClass: string
}

export const CATEGORY_STYLES: Record<RoomCategory, CategoryStyle> = {
  business: {
    Icon: Briefcase,
    blockClass: 'bg-category-business/20 border-category-business/60 text-foreground',
    iconClass: 'text-category-business',
    badgeClass: 'bg-category-business/15 text-category-business',
    tileClass: 'from-category-business/30 to-category-business/5',
  },
  dining: {
    Icon: Coffee,
    blockClass: 'bg-category-dining/20 border-category-dining/60 text-foreground',
    iconClass: 'text-category-dining',
    badgeClass: 'bg-category-dining/15 text-category-dining',
    tileClass: 'from-category-dining/30 to-category-dining/5',
  },
  meeting: {
    Icon: Users,
    blockClass: 'bg-category-meeting/20 border-category-meeting/60 text-foreground',
    iconClass: 'text-category-meeting',
    badgeClass: 'bg-category-meeting/15 text-category-meeting',
    tileClass: 'from-category-meeting/30 to-category-meeting/5',
  },
  amenity: {
    Icon: Sparkles,
    blockClass: 'bg-category-amenity/20 border-category-amenity/60 text-foreground',
    iconClass: 'text-category-amenity',
    badgeClass: 'bg-category-amenity/15 text-category-amenity',
    tileClass: 'from-category-amenity/30 to-category-amenity/5',
  },
  services: {
    Icon: Info,
    blockClass: 'bg-category-services/20 border-category-services/60 text-foreground',
    iconClass: 'text-category-services',
    badgeClass: 'bg-category-services/15 text-category-services',
    tileClass: 'from-category-services/30 to-category-services/5',
  },
  restroom: {
    Icon: DoorClosed,
    blockClass: 'bg-muted border-border text-muted-foreground',
    iconClass: 'text-muted-foreground',
    badgeClass: 'bg-muted text-muted-foreground',
    tileClass: 'from-muted to-muted/40',
  },
}

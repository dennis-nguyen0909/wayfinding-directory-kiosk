import { MapPin } from 'lucide-react'
import { building } from '@/config/building'
import { cn } from '@/lib/utils'

export function KioskHeader({ className }: { className?: string }) {
  return (
    <header className={cn('flex items-center justify-between px-12 py-6 border-b border-border', className)}>
      <div className="flex items-center gap-4 min-w-[200px] min-h-[80px]">
        <div className="h-14 w-14 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <MapPin className="h-8 w-8" />
        </div>
        <div>
          <div className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
            {building.name}
          </div>
          <div className="font-mono text-lg uppercase tracking-widest text-muted-foreground">{building.tagline}</div>
        </div>
      </div>
    </header>
  )
}

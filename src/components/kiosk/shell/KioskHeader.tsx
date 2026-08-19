import { MapPin } from 'lucide-react'
import { building } from '@/config/building'
import { cn } from '@/lib/utils'

export function KioskHeader({ className }: { className?: string }) {
  return (
    <header className={cn('flex items-center justify-between px-12 py-6 border-b border-border/60', className)}>
      <div className="flex items-center gap-4 min-w-[200px] min-h-[80px]">
        <div className="h-14 w-14 rounded-2xl bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0">
          <MapPin className="h-7 w-7 text-primary" strokeWidth={1.9} />
        </div>
        <div>
          <div className="text-3xl font-bold tracking-tight text-foreground">{building.name}</div>
          <div className="label-caps mt-0.5">{building.tagline}</div>
        </div>
      </div>
    </header>
  )
}

import { MapPin } from 'lucide-react'
import { building } from '@/config/building'
import { cn } from '@/lib/utils'

export function KioskHeader({ className }: { className?: string }) {
  return (
    <header className={cn('flex items-center justify-between px-12 py-6', className)}>
      <div className="flex items-center gap-4 min-w-[200px] min-h-[80px]">
        <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <MapPin className="h-8 w-8" />
        </div>
        <div>
          <div className="text-3xl font-bold tracking-tight text-foreground">{building.name}</div>
          <div className="text-xl text-muted-foreground">{building.tagline}</div>
        </div>
      </div>
    </header>
  )
}

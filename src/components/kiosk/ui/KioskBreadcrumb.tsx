import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbSegment {
  label: string
  onTap?: () => void
}

export function KioskBreadcrumb({ segments, className }: { segments: BreadcrumbSegment[]; className?: string }) {
  return (
    <nav className={cn('flex items-center gap-2 text-xl text-muted-foreground', className)}>
      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1
        return (
          <span key={`${segment.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="h-5 w-5 shrink-0" />}
            {segment.onTap && !isLast ? (
              <button
                type="button"
                onClick={segment.onTap}
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline min-h-[44px]"
              >
                {segment.label}
              </button>
            ) : (
              <span className={cn(isLast && 'text-foreground font-semibold')}>{segment.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

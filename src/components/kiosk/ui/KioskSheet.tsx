import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface KioskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  className?: string
}

export function KioskSheet({ open, onOpenChange, title, children, className }: KioskSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          'bg-background data-[side=bottom]:h-[85dvh] rounded-t-3xl border-t border-border flex flex-col',
          className
        )}
      >
        <SheetDescription className="sr-only">{title}</SheetDescription>
        <div className="shrink-0 flex items-center justify-between gap-4 px-12 pt-12 pb-6 border-b border-border">
          <SheetTitle className="text-4xl font-bold text-foreground tracking-tight">{title}</SheetTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="h-16 w-16 rounded-full bg-muted hover:bg-accent flex items-center justify-center shrink-0 transition-all duration-150 active:scale-[0.97]"
          >
            <X className="h-8 w-8 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto text-2xl text-foreground px-12 py-8">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

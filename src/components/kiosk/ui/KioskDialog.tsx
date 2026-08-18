import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface KioskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  className?: string
}

export function KioskDialog({ open, onOpenChange, title, children, className }: KioskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'bg-background max-w-2xl max-h-[85dvh] rounded-3xl border border-border flex flex-col p-0',
          className
        )}
      >
        <DialogDescription className="sr-only">{title}</DialogDescription>
        <div className="shrink-0 flex items-center justify-between gap-4 px-12 pt-12 pb-6 border-b border-border">
          <DialogTitle asChild>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">{title}</h2>
          </DialogTitle>
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
      </DialogContent>
    </Dialog>
  )
}

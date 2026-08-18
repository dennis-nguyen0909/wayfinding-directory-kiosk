import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TapSize = 'sm' | 'default' | 'lg' | 'xl'

interface TapButtonProps extends Omit<ButtonProps, 'size'> {
  size?: TapSize
}

const SIZE_CLASSES: Record<TapSize, string> = {
  sm: 'text-xl  px-5  min-h-[64px]  [&_svg]:!h-6  [&_svg]:!w-6  [&_svg]:!mr-3',
  default: 'text-2xl px-6  min-h-[72px]  [&_svg]:!h-7  [&_svg]:!w-7  [&_svg]:!mr-3',
  lg: 'text-3xl px-8  min-h-[88px]  [&_svg]:!h-8  [&_svg]:!w-8  [&_svg]:!mr-3',
  xl: 'text-4xl px-10 min-h-[96px]  [&_svg]:!h-10 [&_svg]:!w-10 [&_svg]:!mr-4',
}

export function TapButton({ className, children, size = 'lg', ...props }: TapButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        SIZE_CLASSES[size],
        'min-w-[64px] font-semibold',
        'active:scale-[0.97] transition-transform duration-150',
        'focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:pointer-events-none',
        className
      )}
    >
      {children}
    </Button>
  )
}

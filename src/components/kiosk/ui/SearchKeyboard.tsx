import { useRef, useState } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchKeyboardProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchKeyboard({
  value,
  onChange,
  placeholder = 'Search the directory',
  className,
}: SearchKeyboardProps) {
  const [layout, setLayout] = useState<'default' | 'shift'>('default')
  // react-simple-keyboard tracks its own input buffer internally; onChange is the
  // source of truth for `value`. We only need the ref to sync an external clear.
  const keyboardRef = useRef<{ setInput: (value: string) => void } | null>(null)

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      setLayout(layout === 'default' ? 'shift' : 'default')
    }
  }

  const clear = () => {
    onChange('')
    keyboardRef.current?.setInput('')
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" />
        <Input
          value={value}
          readOnly
          inputMode="none"
          placeholder={placeholder}
          className="h-20 text-3xl bg-background border-2 border-border rounded-2xl pl-16 pr-16 focus-visible:ring-4 focus-visible:ring-primary/40"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-muted flex items-center justify-center active:scale-[0.97] transition-transform"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        )}
      </div>
      <Keyboard
        keyboardRef={(r) => {
          keyboardRef.current = r
        }}
        layoutName={layout}
        layout={{
          default: ['q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m {bksp}', '{space}'],
          shift: ['Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M {bksp}', '{space}'],
        }}
        display={{ '{bksp}': '⌫', '{shift}': 'Shift', '{space}': 'Space' }}
        onChange={onChange}
        onKeyPress={onKeyPress}
        theme="kiosk-keyboard hg-theme-default"
      />
    </div>
  )
}

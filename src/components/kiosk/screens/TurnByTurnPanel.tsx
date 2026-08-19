import { ArrowRight, ArrowUpDown, CornerDownLeft, CornerDownRight, Flag, Footprints } from 'lucide-react'
import type { DirectionStep } from '@/lib/route-steps'

const STEP_ICON: Record<NonNullable<DirectionStep['kind']>, React.ReactNode> = {
  start: <ArrowRight className="h-6 w-6" />,
  straight: <ArrowRight className="h-6 w-6" />,
  'turn-left': <CornerDownLeft className="h-6 w-6" />,
  'turn-right': <CornerDownRight className="h-6 w-6" />,
  elevator: <ArrowUpDown className="h-6 w-6" />,
  stairs: <Footprints className="h-6 w-6" />,
  ramp: <ArrowUpDown className="h-6 w-6" />,
  arrive: <Flag className="h-6 w-6" />,
}

export function TurnByTurnPanel({ steps }: { steps: DirectionStep[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={`${i}-${step.text}`} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
          <span className="shrink-0 h-11 w-11 rounded-full bg-primary/15 text-primary flex items-center justify-center">
            {STEP_ICON[step.kind ?? 'straight']}
          </span>
          <span className="text-2xl font-semibold text-foreground">{step.text}</span>
        </li>
      ))}
    </ol>
  )
}

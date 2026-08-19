import type { DirectionStep } from '@/lib/route-steps'

export function TurnByTurnPanel({ steps }: { steps: DirectionStep[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={`${i}-${step.text}`} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
          <span className="shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
            {i + 1}
          </span>
          <span className="text-2xl text-foreground pt-1">{step.text}</span>
        </li>
      ))}
    </ol>
  )
}

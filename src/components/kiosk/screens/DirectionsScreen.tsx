import {
  ArrowRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  CornerDownRight,
  Flag,
  Footprints,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { building } from '@/config/building'
import { buildGraph } from '@/lib/grid-graph'
import { type DirectionStep, segmentToSteps } from '@/lib/route-steps'
import { getRoomById, routeBetween } from '@/lib/selectors'
import { FloorGridMap } from '../map/FloorGridMap'
import { FloorSwitcher } from '../map/FloorSwitcher'
import { KioskFooter } from '../shell/KioskFooter'
import { KioskHeader } from '../shell/KioskHeader'
import { useKiosk } from '../shell/KioskProvider'
import { KioskBreadcrumb } from '../ui/KioskBreadcrumb'
import { TapButton } from '../ui/TapButton'
import { QrHandoffCard } from './QrHandoffCard'
import { StaffHelpDialog } from './StaffHelpDialog'
import { TurnByTurnPanel } from './TurnByTurnPanel'

const STEP_ICON: Record<NonNullable<DirectionStep['kind']>, React.ReactNode> = {
  start: <ArrowRight className="h-7 w-7" />,
  straight: <ArrowRight className="h-7 w-7" />,
  'turn-left': <CornerDownLeft className="h-7 w-7" />,
  'turn-right': <CornerDownRight className="h-7 w-7" />,
  elevator: <ArrowUpDown className="h-7 w-7" />,
  stairs: <Footprints className="h-7 w-7" />,
  ramp: <ArrowUpDown className="h-7 w-7" />,
  arrive: <Flag className="h-7 w-7" />,
}

/** ~30s per instruction — there's no real distance/speed model, this is a
 * presentational approximation only, matching Mappedin's "time to
 * destination" headline treatment. */
function estimateMinutes(stepCount: number): number {
  return Math.max(1, Math.round(stepCount * 0.5))
}

export function DirectionsScreen() {
  const { selectedRoomId, originCorridorId, backToDirectory, restartSession } = useKiosk()
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [helpOpen, setHelpOpen] = useState(false)

  const room = selectedRoomId ? getRoomById(building, selectedRoomId) : undefined
  const route = useMemo(
    () => (selectedRoomId ? routeBetween(building, originCorridorId, selectedRoomId) : null),
    [selectedRoomId, originCorridorId]
  )
  // Rebuilt locally (cheap — this graph is small) rather than threading the
  // routing-layer graph through selectors.ts, purely to map a flat step index
  // back to which floor segment produced it (see stepIndexToSegment below).
  const graph = useMemo(() => buildGraph(building), [])

  const stepIndexToSegment = useMemo(() => {
    if (!route || !route.found) return []
    const map: number[] = []
    route.segments.forEach((segment, segIdx) => {
      const count = segmentToSteps(graph, segment, segIdx === 0).length + (segment.exitTransition ? 1 : 0)
      for (let i = 0; i < count; i++) map.push(segIdx)
    })
    if (route.segments.length > 0) map.push(route.segments.length - 1) // final "Arrive" step
    return map
  }, [route, graph])

  if (!room || !route || !route.found) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center p-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="text-3xl font-semibold text-foreground">We couldn&apos;t find a route</p>
          <TapButton size="lg" onClick={backToDirectory}>
            Back to directory
          </TapButton>
        </div>
      </div>
    )
  }

  const clampedStepIndex = Math.min(activeStepIndex, route.steps.length - 1)
  const currentStep = route.steps[clampedStepIndex]
  const activeSegmentIndex = stepIndexToSegment[clampedStepIndex] ?? 0
  const routeFloorIds = route.segments.map((s) => s.floorId)
  const activeSegment = route.segments[activeSegmentIndex]
  const activeFloor = building.floors.find((f) => f.id === activeSegment.floorId) ?? building.floors[0]

  return (
    <div className="grid h-dvh w-screen overflow-hidden grid-rows-[auto_1fr_auto]">
      <KioskHeader />

      <main className="min-h-0 grid landscape:grid-cols-[5fr_7fr] portrait:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 px-12 pb-6">
        <section className="min-h-0 flex flex-col gap-4 overflow-hidden">
          <KioskBreadcrumb
            segments={[{ label: 'Directory', onTap: backToDirectory }, { label: room.name }, { label: 'Directions' }]}
          />
          <div>
            <p className="font-mono text-lg text-primary tracking-widest uppercase">Time to destination</p>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">~{estimateMinutes(route.steps.length)} min</h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TurnByTurnPanel steps={route.steps} />
          </div>
          <QrHandoffCard roomId={room.id} originCorridorId={originCorridorId} />
          <div className="shrink-0 flex items-center gap-3 p-4 rounded-xl bg-primary text-primary-foreground">
            <button
              type="button"
              onClick={() => setActiveStepIndex((i) => Math.max(0, i - 1))}
              disabled={clampedStepIndex === 0}
              aria-label="Previous step"
              className="shrink-0 h-16 w-16 rounded-full bg-primary-foreground/15 flex items-center justify-center disabled:opacity-30 active:scale-[0.97] transition-transform"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <span className="shrink-0 h-14 w-14 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              {STEP_ICON[currentStep.kind ?? 'straight']}
            </span>
            <p className="flex-1 text-2xl font-bold leading-tight">{currentStep.text}</p>
            <button
              type="button"
              onClick={() => setActiveStepIndex((i) => Math.min(route.steps.length - 1, i + 1))}
              disabled={clampedStepIndex === route.steps.length - 1}
              aria-label="Next step"
              className="shrink-0 h-16 w-16 rounded-full bg-primary-foreground/15 flex items-center justify-center disabled:opacity-30 active:scale-[0.97] transition-transform"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </section>

        <section className="relative min-h-0 flex flex-col bg-card rounded-xl border border-border p-6 overflow-hidden">
          <FloorSwitcher
            floors={building.floors}
            activeFloorId={activeFloor.id}
            onSelect={(floorId) => {
              const segIdx = route.segments.findIndex((s) => s.floorId === floorId)
              if (segIdx < 0) return
              const firstStepOfSegment = stepIndexToSegment.indexOf(segIdx)
              if (firstStepOfSegment >= 0) setActiveStepIndex(firstStepOfSegment)
            }}
            routeFloorIds={routeFloorIds}
          />
          <div className="flex-1 min-h-0 pt-28">
            <FloorGridMap
              floor={activeFloor}
              highlightedNodeIds={activeSegment.nodeIds}
              originCorridorId={activeSegment.floorId === routeFloorIds[0] ? originCorridorId : undefined}
              destinationRoomId={room.id}
              onSelectRoom={() => {}}
            />
          </div>
        </section>
      </main>

      <KioskFooter showHome onHome={restartSession} onHelp={() => setHelpOpen(true)} />
      <StaffHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}

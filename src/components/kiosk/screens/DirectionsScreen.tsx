import { QrCode } from 'lucide-react'
import { useMemo, useState } from 'react'
import { building } from '@/config/building'
import { getRoomById, routeBetween } from '@/lib/selectors'
import { FloorGridMap } from '../map/FloorGridMap'
import { FloorSwitcher } from '../map/FloorSwitcher'
import { MapModeToggle } from '../map/MapModeToggle'
import { KioskFooter } from '../shell/KioskFooter'
import { KioskHeader } from '../shell/KioskHeader'
import { useKiosk } from '../shell/KioskProvider'
import { KioskBreadcrumb } from '../ui/KioskBreadcrumb'
import { TapButton } from '../ui/TapButton'
import { QrShareDialog } from './QrShareDialog'
import { StaffHelpDialog } from './StaffHelpDialog'
import { TurnByTurnPanel } from './TurnByTurnPanel'

export function DirectionsScreen() {
  const { selectedRoomId, originCorridorId, mapDisplayMode, backToDirectory, restartSession, setMapDisplayMode } =
    useKiosk()
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0)
  const [qrOpen, setQrOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const room = selectedRoomId ? getRoomById(building, selectedRoomId) : undefined
  const route = useMemo(
    () => (selectedRoomId ? routeBetween(building, originCorridorId, selectedRoomId) : null),
    [selectedRoomId, originCorridorId]
  )

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

  const routeFloorIds = route.segments.map((s) => s.floorId)
  const activeSegment = route.segments[Math.min(activeSegmentIndex, route.segments.length - 1)]
  const activeFloor = building.floors.find((f) => f.id === activeSegment.floorId) ?? building.floors[0]

  return (
    <div className="grid h-dvh w-screen overflow-hidden grid-rows-[auto_1fr_auto]">
      <KioskHeader />

      <main className="min-h-0 grid landscape:grid-cols-[5fr_7fr] portrait:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 px-12 pb-6">
        <section className="min-h-0 flex flex-col gap-4 overflow-hidden">
          <KioskBreadcrumb
            segments={[{ label: 'Directory', onTap: backToDirectory }, { label: room.name }, { label: 'Directions' }]}
          />
          <h2 className="text-4xl font-bold text-foreground tracking-tight">Directions to {room.name}</h2>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TurnByTurnPanel steps={route.steps} />
          </div>
          <TapButton size="lg" variant="outline" onClick={() => setQrOpen(true)} className="w-full">
            <QrCode />
            Send to my phone
          </TapButton>
        </section>

        <section className="min-h-0 flex flex-col gap-4 bg-card rounded-xl border border-border p-6 overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <FloorSwitcher
              floors={building.floors}
              activeFloorId={activeFloor.id}
              onSelect={(floorId) => {
                const idx = route.segments.findIndex((s) => s.floorId === floorId)
                if (idx >= 0) setActiveSegmentIndex(idx)
              }}
              routeFloorIds={routeFloorIds}
            />
            <MapModeToggle mode={mapDisplayMode} onSelect={setMapDisplayMode} />
          </div>
          <div className="flex-1 min-h-0">
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
      <QrShareDialog open={qrOpen} onOpenChange={setQrOpen} roomId={room.id} originCorridorId={originCorridorId} />
      <StaffHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}

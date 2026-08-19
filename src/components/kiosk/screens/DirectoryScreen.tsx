import { useMemo, useState } from 'react'
import { building } from '@/config/building'
import { getRoomById, searchRooms } from '@/lib/selectors'
import { FloorGridMap } from '../map/FloorGridMap'
import { FloorSwitcher } from '../map/FloorSwitcher'
import { MapModeToggle } from '../map/MapModeToggle'
import { KioskFooter } from '../shell/KioskFooter'
import { KioskHeader } from '../shell/KioskHeader'
import { useKiosk } from '../shell/KioskProvider'
import { KioskBreadcrumb } from '../ui/KioskBreadcrumb'
import { SearchKeyboard } from '../ui/SearchKeyboard'
import { CategoryChips } from './CategoryChips'
import { RoomDetailCard } from './RoomDetailCard'
import { RoomList } from './RoomList'
import { StaffHelpDialog } from './StaffHelpDialog'

function floorOfCorridor(corridorId: string): string {
  for (const floor of building.floors) {
    if (floor.corridors.some((c) => c.id === corridorId) || floor.transitions.some((t) => t.id === corridorId)) {
      return floor.id
    }
  }
  return building.floors[0].id
}

export function DirectoryScreen() {
  const {
    activeCategory,
    searchQuery,
    selectedRoomId,
    originCorridorId,
    mapDisplayMode,
    setActiveCategory,
    setSearchQuery,
    selectRoom,
    startDirections,
    restartSession,
    setMapDisplayMode,
  } = useKiosk()
  const [activeMapFloorId, setActiveMapFloorId] = useState(() => floorOfCorridor(originCorridorId))
  const [helpOpen, setHelpOpen] = useState(false)

  const results = useMemo(() => searchRooms(building, searchQuery, activeCategory), [searchQuery, activeCategory])
  const selectedRoom = selectedRoomId ? getRoomById(building, selectedRoomId) : undefined
  const activeFloor = building.floors.find((f) => f.id === activeMapFloorId) ?? building.floors[0]

  return (
    <div className="grid h-dvh w-screen overflow-hidden grid-rows-[auto_1fr_auto]">
      <KioskHeader />

      <main className="min-h-0 grid landscape:grid-cols-[5fr_7fr] portrait:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 px-12 pb-6">
        <section className="min-h-0 flex flex-col gap-4 overflow-hidden">
          <KioskBreadcrumb
            segments={[
              { label: 'Directory', onTap: selectedRoom ? () => selectRoom(null) : undefined },
              ...(selectedRoom ? [{ label: selectedRoom.name }] : []),
            ]}
          />

          {selectedRoom ? (
            <RoomDetailCard
              room={selectedRoom}
              onBack={() => selectRoom(null)}
              onGetDirections={() => {
                setActiveMapFloorId(selectedRoom.floorId)
                startDirections()
              }}
            />
          ) : (
            <>
              <CategoryChips active={activeCategory} onSelect={setActiveCategory} />
              <SearchKeyboard value={searchQuery} onChange={setSearchQuery} />
              <div className="flex-1 min-h-0 overflow-y-auto">
                <RoomList rooms={results} onSelect={selectRoom} />
              </div>
            </>
          )}
        </section>

        <section className="min-h-0 flex flex-col gap-4 bg-card rounded-xl border border-border p-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FloorSwitcher floors={building.floors} activeFloorId={activeMapFloorId} onSelect={setActiveMapFloorId} />
            <MapModeToggle mode={mapDisplayMode} onSelect={setMapDisplayMode} />
          </div>
          <div className="flex-1 min-h-0">
            <FloorGridMap
              floor={activeFloor}
              originCorridorId={floorOfCorridor(originCorridorId) === activeFloor.id ? originCorridorId : undefined}
              selectedRoomId={selectedRoomId}
              onSelectRoom={selectRoom}
            />
          </div>
        </section>
      </main>

      <KioskFooter showHome={false} onHome={restartSession} onHelp={() => setHelpOpen(true)} />
      <StaffHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}

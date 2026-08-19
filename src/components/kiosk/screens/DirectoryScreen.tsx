import { useMemo, useState } from 'react'
import { building } from '@/config/building'
import { getRoomById, searchRooms } from '@/lib/selectors'
import { FloorGridMap } from '../map/FloorGridMap'
import { FloorSwitcher } from '../map/FloorSwitcher'
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
    setActiveCategory,
    setSearchQuery,
    selectRoom,
    startDirections,
    restartSession,
  } = useKiosk()
  const [activeMapFloorId, setActiveMapFloorId] = useState(() => floorOfCorridor(originCorridorId))
  const [helpOpen, setHelpOpen] = useState(false)

  const results = useMemo(() => searchRooms(building, searchQuery, activeCategory), [searchQuery, activeCategory])
  const selectedRoom = selectedRoomId ? getRoomById(building, selectedRoomId) : undefined
  const activeFloor = building.floors.find((f) => f.id === activeMapFloorId) ?? building.floors[0]

  return (
    <div className="grid h-dvh w-screen overflow-hidden grid-rows-[auto_1fr_auto]">
      <KioskHeader />

      {selectedRoom ? (
        // Detail state — matches Mappedin's map-alongside-a-task layout. The
        // map panel only exists in the DOM once there's a task to show it for.
        <main className="min-h-0 grid landscape:grid-cols-[5fr_7fr] portrait:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 px-12 pb-6">
          <section className="min-h-0 flex flex-col gap-4 overflow-hidden">
            <KioskBreadcrumb
              segments={[{ label: 'Directory', onTap: () => selectRoom(null) }, { label: selectedRoom.name }]}
            />
            <RoomDetailCard
              room={selectedRoom}
              onBack={() => selectRoom(null)}
              onGetDirections={() => {
                setActiveMapFloorId(selectedRoom.floorId)
                startDirections()
              }}
              onSelectRoom={(roomId) => {
                selectRoom(roomId)
                const targetFloorId = getRoomById(building, roomId)?.floorId
                if (targetFloorId) setActiveMapFloorId(targetFloorId)
              }}
            />
          </section>

          <section className="relative min-h-0 flex flex-col bg-card rounded-xl border border-border p-6 overflow-hidden">
            <FloorSwitcher floors={building.floors} activeFloorId={activeMapFloorId} onSelect={setActiveMapFloorId} />
            <div className="flex-1 min-h-0 pt-28">
              <FloorGridMap
                floor={activeFloor}
                originCorridorId={floorOfCorridor(originCorridorId) === activeFloor.id ? originCorridorId : undefined}
                selectedRoomId={selectedRoomId}
                onSelectRoom={selectRoom}
              />
            </div>
          </section>
        </main>
      ) : (
        // Browse state — Mappedin's own home/browse screens don't reserve map
        // real estate either; the map is absent until a task is underway.
        <main className="min-h-0 flex flex-col gap-4 px-12 pb-6 overflow-hidden">
          <KioskBreadcrumb segments={[{ label: 'Directory' }]} />
          <CategoryChips active={activeCategory} onSelect={setActiveCategory} />
          <SearchKeyboard value={searchQuery} onChange={setSearchQuery} />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <RoomList rooms={results} onSelect={selectRoom} />
          </div>
        </main>
      )}

      <KioskFooter showHome={false} onHome={restartSession} onHelp={() => setHelpOpen(true)} />
      <StaffHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}

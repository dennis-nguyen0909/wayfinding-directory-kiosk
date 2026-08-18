Update this file when app purpose, key files, or the customization workflow change significantly.

**Current App Description**: Wayfinding / building-directory kiosk — a touchscreen app for
malls, offices, hospitals, and campuses. Visitors search or browse by category, open a
room's detail card, then get an animated route with turn-by-turn directions and a QR code
to send the same directions to their phone. Opens on a seeded demo building ("Meridian
Tower", 3 floors) with zero setup; customize it by chatting — see "Customization workflow"
below. Built on the OptiDev starter stack so it drops into an OptiDev project.

**The core idea**: floor plans are a **CSS-Grid schematic**, not artwork. Every room,
hallway, and elevator/stairwell sits on an integer grid cell — there is no SVG to draw and
no percentage/pixel coordinate to place. This is deliberate: schematic maps (subway-map
style) are easier to read AND far easier to generate correctly than freehand floor-plan art
or hand-picked coordinates, which is what makes this app reliably remixable via chat.

**Data model** (`src/lib/types.ts`):
- `Building` → `Floor[]` → `Room[]` / `Corridor[]` / `Transition[]`, each placed at an
  integer `GridPosition` (`col`/`row`, optional `colSpan`/`rowSpan`).
- `Room` — a **leaf**. One entrance (`entranceSide`, optional — auto-detected if omitted).
- `Corridor` — a **through-way**. Auto-connects to orthogonally-adjacent corridor/transition
  cells; rooms auto-wire to the nearest touching one.
- `Transition` — a through-way that also links floors (elevator/stairs/ramp) via a shared
  `groupId` across floors.

Routing (`src/lib/grid-graph.ts`), turn-by-turn copy (`src/lib/route-steps.ts`), and the map
render (`src/components/kiosk/map/`) all derive automatically from the grid — there is
nothing else to keep in sync when you edit `src/config/building.ts`.

**Key Files**:
- `src/config/building.ts` — ★ the only file a remix needs to touch (see below).
- `src/lib/types.ts` — the data model.
- `src/lib/grid-graph.ts` / `route-steps.ts` / `selectors.ts` — routing + search.
- `src/components/kiosk/shell/` — `KioskProvider` (state machine, idle timer, Wake Lock),
  header/footer chrome.
- `src/components/kiosk/map/` — the grid-schematic renderer (`FloorGridMap`, `RoomBlock`,
  `CorridorCell`, `FloorSwitcher`).
- `src/components/kiosk/screens/` — `AttractScreen` → `DirectoryScreen` (search/browse →
  detail) → `DirectionsScreen` (route + turn-by-turn + QR share).

**Current Routes**: `/` only — this is a kiosk; navigation is state-driven (`attract` →
`directory` → `directions`), never sub-routes.

## Customization workflow

To turn this into a real building, edit only `src/config/building.ts`:

1. Set `name`, `tagline`, and `categories` (add/remove/rename to match the real building's
   mix of amenities — dining, services, business, restrooms, whatever applies).
2. For each floor: pick a grid size (`cols` × `rows` — big enough that every room and a
   corridor spine both fit without overlapping) and add one `Room` entry per space, each
   with a `gridPosition`. Lay a corridor row (or path) between them so every room touches
   at least one corridor cell — that's the only rule that has to hold for routing to work.
3. Mark exactly one corridor cell per floor as the elevator (`Transition`, `kind: 'elevator'`)
   and, if there is one, the stairs — give matching cells on every floor **the same
   `groupId`** (e.g. `'elevator-a'`) so the app knows they're the same shaft.
4. Point `defaultEntryCorridorId` at the corridor cell nearest the real main entrance.
5. Run `pnpm dev` and click through: Attract → search/browse a room → Directions. If a room
   doesn't connect (dev console shows a warning naming it), move its `gridPosition` next to
   a corridor cell, or set its `entranceSide` explicitly.

No floor-plan image, no coordinate picking, no separate graph file — the layout you just
described in step 2 IS the map and IS the routing graph.

<h1><a href="https://app.optidev.ai/dashboard/apps?remix=REPLACE_WITH_APP_UUID"><img src=".github/customize-button.svg" alt="Customize the app" height="40" align="right"></a>Wayfinding Directory</h1>

A customizable wayfinding / building-directory kiosk. Visitors search or browse by category,
open a room's detail card, then get an animated route with turn-by-turn directions — and a
QR code to send the same directions to their phone.

Opens on a seeded demo building ("Meridian Tower", 3 floors) with no local setup. Customize
it for your own building by chatting — one config file, no floor-plan art, no coordinates
to place.

<a href="https://app.optidev.ai/dashboard/apps?remix=REPLACE_WITH_APP_UUID"><img src=".github/customize-button-sm.svg" alt="Customize the app" height="40"></a>

## Overview

Most indoor wayfinding tools make you draw or upload a real floor plan and then hand-place
coordinates for every room and hallway junction — accurate, but slow to build and hard to
get right without an editor to visually iterate in. This app takes a different approach:
every floor is a **grid schematic** (rooms and corridors as labeled blocks on a grid, like a
subway map rather than a blueprint). It's the one representation an AI coding agent can
reliably generate correctly from a short description — and research on wayfinding UX shows
schematic maps are easier for people to navigate by too.

## Features

- **Search or browse** — on-screen keyboard search, or filter by category chips.
- **Grid-schematic floor maps** — every floor renders as a real CSS grid of labeled room and
  corridor blocks; switch floors with the floor tabs.
- **Turn-by-turn directions** — an animated lit path across the grid plus plain-language
  steps ("Head past Reception, turn right toward the Elevator Lobby, take the elevator to
  2nd Floor…"), including multi-floor routes via elevator/stairs.
- **QR hand-off** — send the same directions to your phone with a scannable code.
- **Kiosk-grade UX** — attract/idle loop, Wake Lock (screen never sleeps), both landscape
  and portrait, large touch targets throughout.

## Customization

Everything about the building lives in **one file**: `src/config/building.ts`.

| To change | Edit |
|---|---|
| Building name / categories | `building.name`, `building.tagline`, `building.categories` |
| Rooms on a floor | `floors[].rooms` — name, category, `gridPosition`, hours/phone/description |
| Hallways | `floors[].corridors` — a corridor spine your rooms sit next to |
| Elevators / stairs | `floors[].transitions` — same `groupId` across floors links them |
| Main entrance | `building.defaultEntryCorridorId` |

See `CLAUDE.md` → "Customization workflow" for the full step-by-step (that's what an AI
agent reads to turn this into your real building from a chat description).

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build to dist/
pnpm typecheck
pnpm lint
```

## Project structure

```
src/
  config/building.ts      ★ the customization surface — building, floors, rooms, routing
  lib/
    types.ts               Data model
    grid-graph.ts          Auto-adjacency from the grid + Dijkstra pathfinding
    route-steps.ts          Turn-by-turn copy generation
    selectors.ts            Search/filter + route lookup
    device-attributes.ts    OptiSigns per-screen device context
  components/kiosk/
    shell/                 KioskProvider (state machine, idle timer, Wake Lock), chrome
    map/                   Grid-schematic renderer (FloorGridMap, RoomBlock, CorridorCell)
    screens/               Attract → Directory (search/browse + detail) → Directions
    ui/                    TapButton, KioskDialog/Sheet, on-screen keyboard, breadcrumb
```

## Tech stack

React 19, Vite 7, TypeScript (strict mode), Tailwind CSS, shadcn/ui, Lucide icons,
`qrcode.react`, `react-simple-keyboard`. Package manager: pnpm.

## License

MIT

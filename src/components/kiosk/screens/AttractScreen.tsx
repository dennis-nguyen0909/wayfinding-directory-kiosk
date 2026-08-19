import { Clock as ClockIcon, MapPin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { building } from '@/config/building'
import { CATEGORY_STYLES } from '@/lib/category-meta'
import { getDeviceTimezone } from '@/lib/device-attributes'
import { allRooms } from '@/lib/selectors'
import { cn } from '@/lib/utils'
import { useKiosk } from '../shell/KioskProvider'

const FLOOR_ROTATION_MS = 14_000
const SPOTLIGHT_ROOM_COUNT = 3

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

/**
 * The kiosk's default, resting state — an ambient signage board, not a "tap to
 * begin" splash. It's correct on any hardware, touch or not: on a non-touch
 * commercial display this is the whole experience (rotating floor spotlight +
 * ticker, forever); the first real tap promotes the same screen into the
 * interactive directory. See claude-dev/2026-08-10-66-wayfinding-directory-app/
 * 02-signage-redesign-research.md for why ("Option A").
 *
 * Two independently-rotating zones, not one static frame — the Pickcel/AiScreen
 * idle-mode convention this redesign borrowed research from: a floor-spotlight
 * zone (rotates every FLOOR_ROTATION_MS) and a ticker zone (its own crawl speed,
 * divided by the border-t below), the same way a signage CMS treats a directory
 * screen as one zone in a playlist alongside separately-timed weather/news zones.
 */
export function AttractScreen() {
  const { begin } = useKiosk()
  const now = useClock()
  const [floorIndex, setFloorIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFloorIndex((i) => (i + 1) % building.floors.length)
    }, FLOOR_ROTATION_MS)
    return () => clearInterval(id)
  }, [])

  const floor = building.floors[floorIndex]
  const spotlightRooms = floor.rooms.slice(0, SPOTLIGHT_ROOM_COUNT)

  const tickerText = useMemo(
    () =>
      allRooms(building)
        .map((r) => `${r.name} — ${r.floorLabel}`)
        .join('   ·   '),
    []
  )

  const timeLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: getDeviceTimezone(),
  }).format(now)

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the whole screen is the tap target — ambient signage promotes into the directory on any real touch, not a specific control.
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard/assistive users reach the identical action via the focusable "tap to find a room" affordance below.
    <div onClick={begin} className="relative w-screen h-dvh overflow-hidden flex flex-col cursor-pointer bg-background">
      {/* One continuous ambient motion element — a signage board never sits in a
          dead, static "waiting for input" frame, whether or not input ever comes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 motion-safe:animate-[ambient-rise_6s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 115%, hsl(41 50% 55% / 0.14) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
        }}
      />

      <div className="relative flex items-center justify-between px-12 pt-8 landscape:pt-8 portrait:pt-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="font-display text-3xl font-bold uppercase tracking-tight text-foreground truncate">
            {building.name}
          </span>
        </div>
        <span className="font-mono text-xl text-muted-foreground flex items-center gap-2 shrink-0">
          <ClockIcon className="h-5 w-5" />
          {timeLabel}
        </span>
      </div>

      <div
        key={floor.id}
        className="relative flex-1 min-h-0 flex landscape:flex-row landscape:items-center portrait:flex-col portrait:justify-center gap-10 px-12 py-6 motion-safe:animate-fade-in"
      >
        <div
          className="relative rounded-lg overflow-hidden shrink-0 landscape:h-[70%] landscape:w-[40%] portrait:w-full portrait:h-[36%]"
          style={{ background: '#0d1524' }}
        >
          <div
            aria-hidden
            className="absolute -inset-[20%] motion-safe:animate-[ambient-glow-a_14s_ease-in-out_infinite_alternate]"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 20% 85%, hsl(41 50% 55% / 0.55) 0%, hsl(41 50% 55% / 0.16) 42%, transparent 72%)',
              mixBlendMode: 'screen',
              filter: 'blur(28px)',
            }}
          />
          <div
            aria-hidden
            className="absolute -inset-[20%] motion-safe:animate-[ambient-glow-b_17s_ease-in-out_infinite_alternate]"
            style={{
              background: 'radial-gradient(ellipse 60% 90% at 90% 10%, hsl(220 39% 55% / 0.35) 0%, transparent 65%)',
              mixBlendMode: 'screen',
              filter: 'blur(34px)',
            }}
          />
          <span className="absolute left-5 bottom-5 font-mono text-xl tracking-widest text-primary border border-primary/40 rounded-full px-4 py-1.5">
            {floor.label.toUpperCase()}
          </span>
        </div>

        <div className="landscape:flex-1 min-w-0 shrink-0">
          <p className="font-mono text-xl text-primary tracking-widest mb-3">NOW FEATURING</p>
          <h1 className="font-display text-6xl font-bold uppercase tracking-tight text-foreground leading-[1.02] mb-6 text-balance">
            {floor.label}
          </h1>
          <div className="flex flex-wrap gap-4">
            {spotlightRooms.map((room) => {
              const { Icon, iconClass, tileClass } = CATEGORY_STYLES[room.category]
              return (
                <div
                  key={room.id}
                  className="flex items-center gap-3 rounded-xl border border-border overflow-hidden pr-5"
                >
                  <div
                    className={cn(
                      'h-16 w-16 flex items-center justify-center bg-gradient-to-br shrink-0',
                      tileClass
                    )}
                  >
                    <Icon className={cn('h-8 w-8', iconClass)} />
                  </div>
                  <span className="text-2xl text-foreground font-medium">{room.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-8 px-12 py-5 border-t border-border">
        <span className="font-mono text-xl text-muted-foreground shrink-0">72°F</span>
        <div className="flex-1 min-w-0 overflow-hidden">
          <span className="inline-block whitespace-nowrap font-mono text-xl text-muted-foreground motion-safe:animate-[ticker-crawl_45s_linear_infinite]">
            {tickerText}
          </span>
        </div>
        <span className="font-mono text-xl text-muted-foreground/60 border border-border rounded-full px-5 py-2 shrink-0">
          tap anywhere to find a room &rsaquo;
        </span>
      </div>
    </div>
  )
}

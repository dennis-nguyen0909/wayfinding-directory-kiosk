import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { building } from '@/config/building'
import { getDeviceAttribute } from '@/lib/device-attributes'
import { getRoomById } from '@/lib/selectors'
import type { RoomCategory } from '@/lib/types'

type Screen = 'attract' | 'directory' | 'directions'

interface KioskContextValue {
  screen: Screen
  activeCategory: RoomCategory | null
  searchQuery: string
  selectedRoomId: string | null
  originCorridorId: string
  hasUserState: boolean
  idleWarningRemaining: number | null
  begin: () => void
  setActiveCategory: (category: RoomCategory | null) => void
  setSearchQuery: (query: string) => void
  selectRoom: (roomId: string | null) => void
  startDirections: () => void
  backToDirectory: () => void
  extendSession: () => void
  restartSession: () => void
}

const KioskContext = createContext<KioskContextValue | null>(null)

const IDLE_TIMEOUT_MS = 90_000
const IDLE_WARNING_MS = 30_000

function resolveOriginCorridorId(): string {
  const params = new URLSearchParams(window.location.search)
  const fromParam = params.get('from')
  if (fromParam) return fromParam

  const deviceOrigin = getDeviceAttribute('originRoomId', '')
  if (deviceOrigin) return deviceOrigin

  return building.defaultEntryCorridorId
}

function resolveInitialRoomId(): string | null {
  const params = new URLSearchParams(window.location.search)
  const roomParam = params.get('room')
  if (roomParam && getRoomById(building, roomParam)) return roomParam
  return null
}

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const initialRoomId = useMemo(resolveInitialRoomId, [])
  const [activeScreen, setActiveScreen] = useState<Screen>(initialRoomId ? 'directions' : 'attract')
  const [activeCategory, setActiveCategory] = useState<RoomCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRoomId)
  const [originCorridorId] = useState<string>(resolveOriginCorridorId)
  const [idleWarningRemaining, setIdleWarningRemaining] = useState<number | null>(null)

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasUserState = activeScreen !== 'attract'

  const resetToAttract = useCallback(() => {
    setActiveScreen('attract')
    setActiveCategory(null)
    setSearchQuery('')
    setSelectedRoomId(null)
    setIdleWarningRemaining(null)
  }, [])

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (warningIntervalRef.current) clearInterval(warningIntervalRef.current)
  }, [])

  const armIdleTimer = useCallback(() => {
    clearTimers()
    setIdleWarningRemaining(null)
    if (!hasUserState) return
    idleTimerRef.current = setTimeout(() => {
      let remaining = IDLE_WARNING_MS
      setIdleWarningRemaining(remaining)
      warningIntervalRef.current = setInterval(() => {
        remaining -= 1000
        setIdleWarningRemaining(remaining)
        if (remaining <= 0) {
          clearTimers()
          resetToAttract()
        }
      }, 1000)
    }, IDLE_TIMEOUT_MS - IDLE_WARNING_MS)
  }, [hasUserState, clearTimers, resetToAttract])

  const extendSession = useCallback(() => {
    clearTimers()
    setIdleWarningRemaining(null)
    armIdleTimer()
  }, [clearTimers, armIdleTimer])

  const restartSession = useCallback(() => {
    clearTimers()
    resetToAttract()
  }, [clearTimers, resetToAttract])

  // Re-arm whenever hasUserState flips (entering/leaving attract).
  useEffect(() => {
    armIdleTimer()
    return clearTimers
  }, [armIdleTimer, clearTimers])

  // "Tap anywhere" extends the session while there's user state in flight —
  // a global listener rather than tracking every individual state field.
  useEffect(() => {
    if (!hasUserState) return
    const bump = () => armIdleTimer()
    document.addEventListener('pointerdown', bump)
    return () => document.removeEventListener('pointerdown', bump)
  }, [hasUserState, armIdleTimer])

  // Wake Lock — keep the screen on. Skip in iframes (OptiDev preview); the browser
  // fires [Violation] before any JS catch runs there. Standalone deploys always
  // have window.self === window.top.
  useEffect(() => {
    if (!('wakeLock' in navigator) || window.self !== window.top) return

    let lock: WakeLockSentinel | null = null
    const acquire = () => {
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          lock = l
        })
        .catch(() => {})
    }
    acquire()

    const onVisible = () => {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVisible)
    screen.orientation?.addEventListener('change', acquire)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      screen.orientation?.removeEventListener('change', acquire)
      lock?.release().catch(() => {})
    }
  }, [])

  const value: KioskContextValue = {
    screen: activeScreen,
    activeCategory,
    searchQuery,
    selectedRoomId,
    originCorridorId,
    hasUserState,
    idleWarningRemaining,
    begin: () => setActiveScreen('directory'),
    setActiveCategory,
    setSearchQuery,
    selectRoom: setSelectedRoomId,
    startDirections: () => setActiveScreen('directions'),
    backToDirectory: () => setActiveScreen('directory'),
    extendSession,
    restartSession,
  }

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
}

export function useKiosk(): KioskContextValue {
  const ctx = useContext(KioskContext)
  if (!ctx) throw new Error('useKiosk must be used within a KioskProvider')
  return ctx
}

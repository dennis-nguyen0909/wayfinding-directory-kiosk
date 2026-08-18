import { useMemo } from 'react'

export function useDeviceAttributes() {
  return useMemo(() => {
    const params = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)
    return {
      uuid: params.get('UUID'),
      deviceName: params.get('deviceName') ?? 'this screen',
      tz: params.get('tz') ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      get: (key: string, fallback = '') => params.get(key) ?? fallback,
    }
  }, [])
}

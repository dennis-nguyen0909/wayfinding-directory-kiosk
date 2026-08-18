/**
 * Reads OptiSigns device/screen context, appended by the player as URL query
 * params on the published project. Absent in dev-container preview and local
 * dev — every reader here has a sensible fallback. See the `device-attributes`
 * skill for the full contract.
 */
function getParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

export function getDeviceAttribute(key: string, fallback = ''): string {
  return getParams().get(key) ?? fallback
}

export function getDeviceUUID(): string | null {
  return getParams().get('UUID')
}

export function getDeviceName(fallback = 'this screen'): string {
  return getParams().get('deviceName') ?? fallback
}

export function getDeviceTimezone(): string {
  return getParams().get('tz') ?? Intl.DateTimeFormat().resolvedOptions().timeZone
}

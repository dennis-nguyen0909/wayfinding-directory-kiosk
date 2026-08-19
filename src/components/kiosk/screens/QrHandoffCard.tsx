import { QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QrHandoffCardProps {
  roomId: string
  originCorridorId: string
}

/**
 * Always-visible "take it with you" card — Mappedin pairs its QR hand-off
 * directly beside the direction content rather than gating it behind a
 * dialog. This is supplementary context, not a primary action, so removing
 * the extra tap a modal would cost helps this app's tap-budget doctrine
 * rather than hurting it.
 */
export function QrHandoffCard({ roomId, originCorridorId }: QrHandoffCardProps) {
  const deepLinkUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomId)}&from=${encodeURIComponent(originCorridorId)}`

  return (
    <div className="shrink-0 flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
      <div className="p-2 bg-background border border-border rounded-lg shrink-0">
        <QRCodeSVG value={deepLinkUrl} size={88} />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <QrCode className="h-5 w-5 text-muted-foreground shrink-0" />
          Take this with you
        </p>
        <p className="text-base text-muted-foreground truncate">Scan to open these directions on your phone</p>
      </div>
    </div>
  )
}

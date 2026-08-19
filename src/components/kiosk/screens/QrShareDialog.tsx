import { QRCodeSVG } from 'qrcode.react'
import { useEffect } from 'react'
import { KioskDialog } from '../ui/KioskDialog'

interface QrShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: string
  originCorridorId: string
}

const AUTO_CLOSE_MS = 90_000

export function QrShareDialog({ open, onOpenChange, roomId, originCorridorId }: QrShareDialogProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => onOpenChange(false), AUTO_CLOSE_MS)
    return () => clearTimeout(timer)
  }, [open, onOpenChange])

  const deepLinkUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomId)}&from=${encodeURIComponent(originCorridorId)}`

  return (
    <KioskDialog open={open} onOpenChange={onOpenChange} title="Take this with you">
      <div className="flex flex-col items-center gap-6">
        <div className="p-6 bg-card border border-border/60 rounded-2xl">
          <QRCodeSVG value={deepLinkUrl} size={240} bgColor="#ffffff" fgColor="#000000" />
        </div>
        <p className="text-xl text-muted-foreground text-center break-all">{deepLinkUrl}</p>
      </div>
    </KioskDialog>
  )
}

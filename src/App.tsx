import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AttractScreen } from '@/components/kiosk/screens/AttractScreen'
import { DirectionsScreen } from '@/components/kiosk/screens/DirectionsScreen'
import { DirectoryScreen } from '@/components/kiosk/screens/DirectoryScreen'
import { IdleOverlay } from '@/components/kiosk/shell/IdleOverlay'
import { KioskProvider, useKiosk } from '@/components/kiosk/shell/KioskProvider'

function KioskRoot() {
  const { screen } = useKiosk()

  if (screen === 'attract') return <AttractScreen />
  if (screen === 'directions') return <DirectionsScreen />
  return <DirectoryScreen />
}

function Kiosk() {
  return (
    <KioskProvider>
      <KioskRoot />
      <IdleOverlay />
    </KioskProvider>
  )
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Kiosk />} />
    </Routes>
  </BrowserRouter>
)

export default App

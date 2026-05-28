'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'

const RoomScene = dynamic(() => import('../components/RoomScene'), { ssr: false })

export default function RoomAPage() {
  const router = useRouter()
  const [nearDoor, setNearDoor] = useState(false)

  const handleInteract = useCallback(() => {
    router.push('/room-b')
  }, [router])

  // Spacebar navigation when near door
  useEffect(() => {
    if (!nearDoor) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') handleInteract()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nearDoor, handleInteract])

  return (
    <ControlsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <RoomScene
          doorLabel="Gallery Room B →"
          nearDoor={nearDoor}
          onNearDoor={setNearDoor}
          onDoorInteract={handleInteract}
          pedestalColor="#9b59b6"
          pedestalEmissive="#6c3483"
          exhibitPrefix="A"
        />

        {/* ── INTERACTIVE FEATURES ── HUD overlay */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '16px 20px',
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(6px)',
            padding: '6px 16px',
            borderRadius: '6px',
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#333',
            letterSpacing: '0.04em',
          }}>
            Gallery Room A
          </div>
          <a
            href="/"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(6px)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontFamily: 'sans-serif',
              fontSize: '13px',
              color: '#555',
              textDecoration: 'none',
              pointerEvents: 'all',
            }}
          >
            ← Exit Museum
          </a>
        </div>

        {/* Controls hint */}
        <div style={{
          position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.42)',
          color: '#eee', fontSize: '11px', padding: '5px 14px',
          borderRadius: '20px', fontFamily: 'sans-serif',
          pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          ↑↓ Move &nbsp;·&nbsp; ,. Pan &nbsp;·&nbsp; Space Enter
        </div>

        <MobileControls nearDoor={nearDoor} onInteract={handleInteract} />
      </div>
    </ControlsProvider>
  )
}

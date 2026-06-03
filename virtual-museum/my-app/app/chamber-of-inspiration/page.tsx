'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { CreditsPanel } from '../components/CreditsPanel'

const ChamberScene = dynamic(() => import('./ChamberScene'), { ssr: false })

// Path: enter from z=+5, walk toward the screen wall at z=-6 (stop at z=-4)
const PATH: readonly [number, number][] = [
  [0,  5],
  [0, -4],
]

const hudBtn: React.CSSProperties = {
  background: 'rgba(12, 24, 60, 0.88)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '1px solid rgba(40, 80, 180, 0.45)',
  borderRadius: '50%',
  width: '34px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '15px',
  cursor: 'pointer',
  pointerEvents: 'all',
  userSelect: 'none',
  flexShrink: 0,
  color: '#88aaee',
}

export default function ChamberPage() {
  const router = useRouter()
  const [autoWalk, setAutoWalk] = useState(false)
  const [nearDoor, setNearDoor] = useState(false)
  const [showCredits, setShowCredits] = useState(false)

  const handleLobby  = useCallback(() => router.push('/lobby'), [router])
  const handleBack   = useCallback(() => router.back(),         [router])
  const handleToggle = useCallback(() => setAutoWalk(v => !v), [])

  // Space = auto-walk
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'BUTTON' || t.tagName === 'A') return
      if (e.key === ' ') { e.preventDefault(); handleToggle() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleToggle])

  return (
    <ControlsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <ChamberScene
          onNearDoor={setNearDoor}
          onLobby={handleLobby}
          onBack={handleBack}
          path={PATH}
          autoWalk={autoWalk}
        />

        {/* HUD */}
        <div style={{
          position: 'fixed', top: 0, right: 0,
          display: 'flex', alignItems: 'center',
          gap: '8px', padding: '16px 20px',
          pointerEvents: 'none', zIndex: 10,
        }}>
          <button
            type="button"
            onClick={handleToggle}
            title={autoWalk ? 'Stop auto-walk' : 'Start auto-walk'}
            style={{
              ...hudBtn,
              background: autoWalk ? 'rgba(22, 50, 130, 0.9)' : hudBtn.background,
            }}
          >
            {autoWalk ? '⏸' : '▶'}
          </button>

          <button
            type="button"
            onClick={() => setShowCredits(v => !v)}
            title="Room credits"
            style={{ ...hudBtn, pointerEvents: 'all' }}
          >
            📜
          </button>

          <a
            href="/"
            style={{
              background: 'rgba(12, 24, 60, 0.88)',
              backdropFilter: 'blur(6px)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontFamily: 'sans-serif',
              fontSize: '13px',
              color: '#6688cc',
              textDecoration: 'none',
            }}
          >
            ← Exit
          </a>
        </div>

        {showCredits && (
          <CreditsPanel onClose={() => setShowCredits(false)}>
            <p style={{ margin: 0, fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
              Credits will be added as assets are added to this room.
            </p>
          </CreditsPanel>
        )}

        {/* Controls hint */}
        <div style={{
          position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(6, 14, 40, 0.72)',
          color: '#4466aa', fontSize: '11px', padding: '5px 14px',
          borderRadius: '20px', fontFamily: 'sans-serif',
          pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          ↑↓ Move &nbsp;·&nbsp; ,. Pan &nbsp;·&nbsp; Space: auto-walk
        </div>

        <MobileControls nearDoor={nearDoor} onInteract={handleLobby} />
      </div>
    </ControlsProvider>
  )
}

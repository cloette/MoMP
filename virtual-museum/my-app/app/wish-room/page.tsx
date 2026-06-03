'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { CreditsPanel } from '../components/CreditsPanel'

const WishRoomScene   = dynamic(() => import('./WishRoomScene'),   { ssr: false })
const DressUpModal    = dynamic(() => import('./DressUpModal'),    { ssr: false })
const StarStationModal = dynamic(() => import('./StarStationModal'), { ssr: false })

// Straight path: camera enters from lobby side (z=+6) and walks toward exterior (z=-6)
const PATH: readonly [number, number][] = [
  [0,  6],
  [0, -6],
]

const hudBtnBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '1px solid rgba(200,200,200,0.5)',
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
}

export default function WishRoomPage() {
  const router = useRouter()
  const [nearDoor, setNearDoor] = useState(false)
  const [autoWalk, setAutoWalk] = useState(false)
  const autoWalkRef = useRef(false)
  const [showCredits, setShowCredits] = useState(false)
  const [showDressUp, setShowDressUp] = useState(false)
  const [showStarStation, setShowStarStation] = useState(false)

  useEffect(() => { autoWalkRef.current = autoWalk }, [autoWalk])

  useEffect(() => {
    if (sessionStorage.getItem('momp_autowalk') === '1') {
      sessionStorage.removeItem('momp_autowalk')
      setAutoWalk(true)
    }
  }, [])

  const handleToggleAutoWalk = useCallback(() => setAutoWalk(v => !v), [])

  const nearDoorRef = useRef(false)
  useEffect(() => { nearDoorRef.current = nearDoor }, [nearDoor])

  const handleInteract = useCallback(() => {
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push('/exterior')
  }, [router])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      if (e.key === ' ')     { e.preventDefault(); handleToggleAutoWalk() }
      if (e.key === 'Enter' && nearDoorRef.current) handleInteract()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleToggleAutoWalk, handleInteract])

  useEffect(() => {
    if (!autoWalk || !nearDoor) return
    const t = setTimeout(handleInteract, 800)
    return () => clearTimeout(t)
  }, [autoWalk, nearDoor, handleInteract])

  return (
    <ControlsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <WishRoomScene
          nearDoor={nearDoor}
          onNearDoor={setNearDoor}
          onDoorInteract={handleInteract}
          path={PATH}
          autoWalk={autoWalk}
          onOpenDressUp={() => setShowDressUp(true)}
          onOpenStarStation={() => setShowStarStation(true)}
        />

        {/* HUD overlay */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '16px 20px',
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(20,10,35,0.82)',
            backdropFilter: 'blur(6px)',
            padding: '6px 16px',
            borderRadius: '6px',
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#ddd',
            letterSpacing: '0.04em',
          }}>
            Wish Room
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'all' }}>
            <button
              type="button"
              onClick={handleToggleAutoWalk}
              title={autoWalk ? 'Stop auto-walk' : 'Start auto-walk'}
              style={{
                ...hudBtnBase,
                background: autoWalk ? 'rgba(108,52,131,0.85)' : 'rgba(231,152,255,0.82)',
                border: autoWalk ? '1px solid rgba(108,52,131,0.5)' : hudBtnBase.border,
                color: autoWalk ? '#fff' : undefined,
              }}
            >
              {autoWalk ? '⏸' : '▶'}
            </button>

            <button
              type="button"
              onClick={() => setShowCredits(v => !v)}
              title="Room credits"
              style={hudBtnBase}
            >
              📜
            </button>

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
              }}
            >
              ← Exit
            </a>
          </div>
        </div>

        {showCredits && (
          <CreditsPanel onClose={() => setShowCredits(false)}>
            <p style={{ margin: 0, fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
              Origami Lucky Star Tutorial by <a href="https://www.youtube.com/@EasyPaperOrigami" target="_blank">Easy Paper Origami</a>
              <br />"Computer Desk" (https://skfb.ly/6BRuF) by felixawani is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Paper Stack" (https://skfb.ly/oI98E) by Vivify Productions is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"ORIGAMI Dragon" (https://skfb.ly/oTYnL) by Jac.obj is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Low poly animated Cartoon Whale" (https://skfb.ly/oFMAq) by Blue Colossus Studio is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Torti - Stylized Turtle" (https://skfb.ly/oyIWN) by Bato Balvanera is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Snake" (https://skfb.ly/UpVV) by Anette Rana is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Cute Little Bunny pet" (https://skfb.ly/oZrnA) by james.dales is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Magician Top Hat" (https://skfb.ly/o7XQQ) by Janice Emmons 1990-present is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Luffy's Straw Hat" (https://skfb.ly/owNED) by Mzati Chikoko is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Witch Hat Halooween" (https://skfb.ly/oquJJ) by Sarath K is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Red Bowtie" (https://skfb.ly/ooDUU) by assetfactory is licensed under the free standard license.
              <br />"Sapphire Pendant with Inner Fracture" (https://skfb.ly/pzJFV) by Valentine_crut is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Rune Pendant" (https://skfb.ly/6RyVv) by powers28 is licensed under the free standard license.
              <br />"Staff" (https://skfb.ly/6QVBQ) by ndotson904 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
            </p>
          </CreditsPanel>
        )}

        <div className="controls-hint" style={{
          position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.42)',
          color: '#eee', fontSize: '11px', padding: '5px 14px',
          borderRadius: '20px', fontFamily: 'sans-serif',
          pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          ↑↓ Move &nbsp;·&nbsp; ,. Pan &nbsp;·&nbsp; Enter: door &nbsp;·&nbsp; Space: walk
        </div>

        {showDressUp     && <DressUpModal     onClose={() => setShowDressUp(false)} />}
        {showStarStation && <StarStationModal onClose={() => setShowStarStation(false)} />}

        <MobileControls nearDoor={nearDoor} onInteract={handleInteract} />
      </div>
    </ControlsProvider>
  )
}

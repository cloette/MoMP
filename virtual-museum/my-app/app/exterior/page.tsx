'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { CreditsPanel } from '../components/CreditsPanel'
import Link from 'next/link'

const ExteriorScene = dynamic(() => import('./ExteriorScene'), { ssr: false })

// Straight path: garden (z=+20) → camera start (z=0) → pedestal/door (z=-18)
// Segment lengths: 20 + 18 = 38 total
const PATH_EXT: readonly [number, number][] = [
  [0, 20],  // garden end  (t = 0)
  [0, 0],  // camera start
  [0, -18],  // forward limit (t = 1)
]
// Place camera at the midpoint of segment 1 (z ≈ 0)
const START_T = 20 / 38
const AMBIENT_VOLUME = 0.3  // 0.0 – 1.0

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

export default function ExteriorPage() {
  const router = useRouter()
  const [nearDoor, setNearDoor] = useState(false)
  const [autoWalk, setAutoWalk] = useState(false)
  const autoWalkRef = useRef(false)
  const [audioMuted, setAudioMuted] = useState(true)
  const audioMutedRef = useRef(true)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null)
  const [showCredits, setShowCredits] = useState(false)

  useEffect(() => { autoWalkRef.current = autoWalk }, [autoWalk])
  useEffect(() => { audioMutedRef.current = audioMuted }, [audioMuted])

  // On mount: restore audio + auto-walk state from session
  useEffect(() => {
    const unmuted = sessionStorage.getItem('momp_audio_unmuted') === '1'
    setAudioMuted(!unmuted)
    audioMutedRef.current = !unmuted

    if (unmuted) {
      const ambient = new Audio('/exhibitobjects/exterior/exteriorambient.mp3')
      ambient.volume = AMBIENT_VOLUME
      ambient.loop = true
      ambientAudioRef.current = ambient
      ambient.play().catch(() => { })
    }

    if (sessionStorage.getItem('momp_autowalk') === '1') {
      sessionStorage.removeItem('momp_autowalk')
      setAutoWalk(true)
    }
  }, [])

  // Cleanup all audio on unmount
  useEffect(() => {
    return () => {
      currentAudioRef.current?.pause()
      currentAudioRef.current = null
      ambientAudioRef.current?.pause()
      ambientAudioRef.current = null
    }
  }, [])

  const handleToggleMute = useCallback(() => {
    if (audioMutedRef.current) {
      setAudioMuted(false)
      audioMutedRef.current = false
      sessionStorage.setItem('momp_audio_unmuted', '1')

      // Start looping ambient
      if (!ambientAudioRef.current) {
        const ambient = new Audio('/exhibitobjects/exterior/exteriorambient.mp3')
        ambient.volume = AMBIENT_VOLUME
        ambient.loop = true
        ambientAudioRef.current = ambient
        ambient.play().catch(() => { })
      } else {
        ambientAudioRef.current.play().catch(() => { })
      }

      // Welcome narration once per session
      if (!sessionStorage.getItem('momp_welcome_played')) {
        sessionStorage.setItem('momp_welcome_played', '1')
        const audio = new Audio('/MoMPwelcome.m4a')
        currentAudioRef.current = audio
        audio.play().catch(() => { })
        audio.onended = () => {
          if (currentAudioRef.current === audio) currentAudioRef.current = null
        }
      }
    } else {
      currentAudioRef.current?.pause()
      currentAudioRef.current = null
      ambientAudioRef.current?.pause()
      setAudioMuted(true)
      audioMutedRef.current = true
      sessionStorage.setItem('momp_audio_unmuted', '0')
    }
  }, [])

  const handleToggleAutoWalk = useCallback(() => {
    setAutoWalk(v => !v)
  }, [])

  const handleInteract = useCallback(() => {
    currentAudioRef.current?.pause()
    currentAudioRef.current = null
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push('/lobby')
  }, [router])

  const nearDoorRef = useRef(false)
  useEffect(() => { nearDoorRef.current = nearDoor }, [nearDoor])

  // Keyboard shortcuts: Space = auto-walk · / = audio · Enter = door
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') return
      if (e.key === ' ') { e.preventDefault(); handleToggleAutoWalk() }
      if (e.key === '/') { e.preventDefault(); handleToggleMute() }
      if (e.key === 'Enter' && nearDoorRef.current) handleInteract()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleToggleAutoWalk, handleToggleMute, handleInteract])

  // Auto-navigate when auto-walk reaches the door
  useEffect(() => {
    if (!autoWalk || !nearDoor) return
    const t = setTimeout(handleInteract, 800)
    return () => clearTimeout(t)
  }, [autoWalk, nearDoor, handleInteract])

  return (
    <ControlsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <ExteriorScene
          nearDoor={nearDoor}
          onNearDoor={setNearDoor}
          onDoorInteract={handleInteract}
          path={PATH_EXT}
          startT={START_T}
          autoWalk={autoWalk}
        />

        {/* HUD overlay */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '16px 20px',
          pointerEvents: 'none', zIndex: 10,
        }}>

          <div style={{
            background: 'rgba(255, 255, 255, 0)',
            backdropFilter: 'blur(6px)',
            fontSize: '15px',
            color: '#33333300',
            letterSpacing: '0.04em'
          }}>
          </div>

          {/* Right-side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'all' }}>
            <button
              type="button"
              onClick={handleToggleMute}
              title={audioMuted ? 'Unmute audio' : 'Mute audio'}
              style={hudBtnBase}
            >
              {audioMuted ? '🔇' : '🔊'}
            </button>

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
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
              <em>Disclaimer:</em> Nothing in this room is presented as complete or definitive. This is our best effort within the space and knowledge available to us, and we will keep improving it. 
              <br></br>
              Spotted an error, an omission, or something that deserves more care? <Link href="https://forms.gle/mogSB53GkJcgRUL18" target="_blank">Let us know!</Link>
              <br></br>
              <em>Credits:</em><br></br>
              "Harlequin Orb" (https://skfb.ly/oDPZZ) by Tycho Magnetic Anomaly is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Door" (https://skfb.ly/6ZWw8) by Maria Stashko is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Rock Mountain with cave (realistic version)" (https://skfb.ly/pK9UN) by Jungle Jim is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Grass claster | Downoad = Like please" (https://skfb.ly/oRIP6) by VRA is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Coastal redwood from Grove of Old Trees" (https://skfb.ly/oxL6p) by kungphil is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Sakura Tree 01 - Low Poly Model" (https://skfb.ly/oPyPz) by Jogoss is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Pine Tree [Game-ready]" (https://skfb.ly/ow7yN) by Wenedi (^-^)/ is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />"Realistic HD Blue jacaranda (9/40)" (https://skfb.ly/oDCJF) by PlantCatalog is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />All music is copyright-free from Pixabay (human-created tracks only).
            </p>
          </CreditsPanel>
        )}

        {/* Controls hint */}
        <div className="controls-hint" style={{
          position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.42)',
          color: '#eee', fontSize: '11px', padding: '5px 14px',
          borderRadius: '20px', fontFamily: 'sans-serif',
          pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          ↑↓ Move &nbsp;·&nbsp; ,. Pan &nbsp;·&nbsp; Enter: door &nbsp;·&nbsp; Space: walk &nbsp;·&nbsp; /: audio
        </div>

        <MobileControls nearDoor={nearDoor} onInteract={handleInteract} />
      </div>
    </ControlsProvider>
  )
}

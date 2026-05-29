'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { WelcomePopup } from '../components/WelcomePopup'
import type { PauseZone } from '../components/RailCamera'

const RoomScene = dynamic(() => import('../components/RoomScene'), { ssr: false })

// Room is W=12 (x: -6..+6), D=14 (z: -7..+7).
// Segment lengths: 4.2 + 9.8 + 12.9(diagonal) + 9.8 + 4.2 ≈ 40.9 units total
const PATH_A: readonly [number, number][] = [
  [ 0,   4.9],  // (50x,15z) center, entry wall
  [-4.0, 4.7],  // (15x,15z) left,   entry wall
  [-4.0,-4.7],  // (15x,85z) left,   door  wall
  [ 4.0,-4.7],  // (85x,85z) right,  door  wall
  [ 4.0, 4.7],  // (85x,15z) right,  entry wall
  [ 0,  -4.9],  // (50x,85z) center, door  wall  → next room
]

// Pause zones placed at the four turning corners (t ≈ 0.10 / 0.34 / 0.66 / 0.90)
const PAUSE_ZONES: PauseZone[] = [
  { t: 0.10, audioSrc: '/Firstexhibit.m4a' },    // left-entry corner  (near Exhibit A2)
  { t: 0.34, audioSrc: '/Anotherexhibit.m4a' },  // left-door  corner  (near Exhibit A1)
  { t: 0.58, audioSrc: '/Anotherexhibit.m4a' },    // right-entry corner (near Exhibit A4)
  { t: 0.82, audioSrc: '/Anotherexhibit.m4a' },  // right-door  corner (near Exhibit A3)
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

export default function RoomAPage() {
  const router = useRouter()
  const [nearDoor, setNearDoor] = useState(false)
  const [autoWalk, setAutoWalk] = useState(false)
  const autoWalkRef = useRef(false)
  const [autoWalkPaused, setAutoWalkPaused] = useState(false)
  const [audioMuted, setAudioMuted] = useState(true)
  const audioMutedRef = useRef(true)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => { autoWalkRef.current = autoWalk }, [autoWalk])
  useEffect(() => { audioMutedRef.current = audioMuted }, [audioMuted])

  // Read persisted state from sessionStorage on mount
  useEffect(() => {
    const unmuted = sessionStorage.getItem('momp_audio_unmuted') === '1'
    setAudioMuted(!unmuted)
    audioMutedRef.current = !unmuted

    if (sessionStorage.getItem('momp_autowalk') === '1') {
      sessionStorage.removeItem('momp_autowalk')
      setAutoWalk(true)
    }
  }, [])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
    }
  }, [])

  const handleToggleMute = useCallback(() => {
    if (audioMutedRef.current) {
      setAudioMuted(false)
      audioMutedRef.current = false
      sessionStorage.setItem('momp_audio_unmuted', '1')
      // Welcome audio plays only once per session
      if (!sessionStorage.getItem('momp_welcome_played')) {
        sessionStorage.setItem('momp_welcome_played', '1')
        const audio = new Audio('/MoMPwelcome.m4a')
        currentAudioRef.current = audio
        audio.play().catch(() => {})
        audio.onended = () => {
          if (currentAudioRef.current === audio) currentAudioRef.current = null
        }
      }
    } else {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current.onended = null
        currentAudioRef.current = null
      }
      setAudioMuted(true)
      audioMutedRef.current = true
      sessionStorage.setItem('momp_audio_unmuted', '0')
      setAutoWalkPaused(false)
    }
  }, [])

  const handleToggleAutoWalk = useCallback(() => {
    setAutoWalk(v => !v)
  }, [])

  const handleEnterZone = useCallback((index: number) => {
    // Stop whatever is currently playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.onended = null
      currentAudioRef.current = null
    }
    if (audioMutedRef.current) return

    const audio = new Audio(PAUSE_ZONES[index].audioSrc)
    currentAudioRef.current = audio
    setAutoWalkPaused(true)
    audio.play().catch(() => {})
    audio.onended = () => {
      if (currentAudioRef.current === audio) currentAudioRef.current = null
      setAutoWalkPaused(false)
    }
  }, [])

  const handleInteract = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.onended = null
      currentAudioRef.current = null
    }
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push('/room-b')
  }, [router])

  // nearDoor ref keeps the keyboard handler stable (no need to re-register on every door state change)
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

  // Auto-navigate when auto-walk reaches the door; waits for any zone audio to finish
  useEffect(() => {
    if (!autoWalk || !nearDoor || autoWalkPaused) return
    const t = setTimeout(handleInteract, 800)
    return () => clearTimeout(t)
  }, [autoWalk, nearDoor, autoWalkPaused, handleInteract])

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
          path={PATH_A}
          autoWalk={autoWalk}
          autoWalkPaused={autoWalkPaused}
          zones={PAUSE_ZONES}
          onEnterZone={handleEnterZone}
        />

        {/* HUD overlay */}
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
                background: autoWalk ? 'rgba(108,52,131,0.85)' : 'rgba(231, 152, 255, 0.82)',
                border: autoWalk ? '1px solid rgba(108,52,131,0.5)' : hudBtnBase.border,
                color: autoWalk ? '#fff' : undefined,
              }}
            >
              {autoWalk ? '⏸' : '▶'}
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
              ← Exit Museum
            </a>
          </div>
        </div>

        {/* Controls hint */}
        <div className='controls-hint' style={{
          position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.42)',
          color: '#eee', fontSize: '11px', padding: '5px 14px',
          borderRadius: '20px', fontFamily: 'sans-serif',
          pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
        }}>
          ↑↓ Move &nbsp;·&nbsp; ,. Pan &nbsp;·&nbsp; Enter: door &nbsp;·&nbsp; Space: walk &nbsp;·&nbsp; /: audio
        </div>

        <MobileControls nearDoor={nearDoor} onInteract={handleInteract} />
        <WelcomePopup />
      </div>
    </ControlsProvider>
  )
}

'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { CreditsPanel } from '../components/CreditsPanel'
import { CategoryModal } from './CategoryModal'
import type { PauseZone } from '../components/RailCamera'
import type { CategoryName, LibraryItem } from './CategoryModal'

const LibraryRoomScene = dynamic(() => import('./LibraryScene'), { ssr: false })

const PATH: readonly [number, number][] = [
  [ 0,   4.9],  // center, entry wall
  [ 0,  -4.9],  // center, door  wall → wish room
]

const PAUSE_ZONES: PauseZone[] = [
  { t: 0.10, audioSrc: '' },
]

// ── Category data ─────────────────────────────────────────────────────────────
// Items are sorted alphabetically in the modal. Add entries here.
const CATEGORY_DATA: Record<CategoryName, LibraryItem[]> = {
  Books:          [],
  'Comics/Manga': [],
  Video:          [],
  Games:          [],
  Other:          [],
}

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

export default function LibraryPage() {
  const router = useRouter()
  const [nearDoor, setNearDoor] = useState(false)
  const [autoWalk, setAutoWalk] = useState(false)
  const autoWalkRef = useRef(false)
  const [autoWalkPaused, setAutoWalkPaused] = useState(false)
  const [audioMuted, setAudioMuted] = useState(true)
  const audioMutedRef = useRef(true)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const [showCredits, setShowCredits] = useState(false)
  const [openCategory, setOpenCategory] = useState<CategoryName | null>(null)

  useEffect(() => { autoWalkRef.current = autoWalk }, [autoWalk])
  useEffect(() => { audioMutedRef.current = audioMuted }, [audioMuted])

  useEffect(() => {
    const unmuted = sessionStorage.getItem('momp_audio_unmuted') === '1'
    setAudioMuted(!unmuted)
    audioMutedRef.current = !unmuted
    if (sessionStorage.getItem('momp_autowalk') === '1') {
      sessionStorage.removeItem('momp_autowalk')
      setAutoWalk(true)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
    }
  }, [])

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.onended = null
      currentAudioRef.current = null
    }
  }, [])

  const handleToggleMute = useCallback(() => {
    if (audioMutedRef.current) {
      setAudioMuted(false)
      audioMutedRef.current = false
      sessionStorage.setItem('momp_audio_unmuted', '1')
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
      stopAudio()
      setAudioMuted(true)
      audioMutedRef.current = true
      sessionStorage.setItem('momp_audio_unmuted', '0')
      setAutoWalkPaused(false)
    }
  }, [stopAudio])

  const handleToggleAutoWalk = useCallback(() => {
    setAutoWalk(v => !v)
  }, [])

  const handleEnterZone = useCallback((index: number) => {
    stopAudio()
    if (audioMutedRef.current) return
    const audio = new Audio(PAUSE_ZONES[index].audioSrc)
    currentAudioRef.current = audio
    setAutoWalkPaused(true)
    audio.play().catch(() => {})
    audio.onended = () => {
      if (currentAudioRef.current === audio) currentAudioRef.current = null
      setAutoWalkPaused(false)
    }
  }, [stopAudio])

  const handleInteract = useCallback(() => {
    stopAudio()
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push('/wish-room')
  }, [router, stopAudio])

  const handleLobbyInteract = useCallback(() => {
    stopAudio()
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push('/lobby')
  }, [router, stopAudio])

  const handleChamberInteract = useCallback(() => {
    stopAudio()
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push('/chamber-of-inspiration')
  }, [router, stopAudio])

  const nearDoorRef = useRef(false)
  useEffect(() => { nearDoorRef.current = nearDoor }, [nearDoor])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') return
      if (e.key === 'Escape') { setOpenCategory(null); return }
      if (openCategory) return
      if (e.key === ' ') { e.preventDefault(); handleToggleAutoWalk() }
      if (e.key === '/') { e.preventDefault(); handleToggleMute() }
      if (e.key === 'Enter' && nearDoorRef.current) handleInteract()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleToggleAutoWalk, handleToggleMute, handleInteract, openCategory])

  useEffect(() => {
    if (!autoWalk || !nearDoor || autoWalkPaused) return
    const t = setTimeout(handleInteract, 800)
    return () => clearTimeout(t)
  }, [autoWalk, nearDoor, autoWalkPaused, handleInteract])

  return (
    <ControlsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <LibraryRoomScene
          nearDoor={nearDoor}
          onNearDoor={setNearDoor}
          onDoorInteract={handleInteract}
          onLobbyDoorInteract={handleLobbyInteract}
          onChamberDoorInteract={handleChamberInteract}
          onOpenCategory={setOpenCategory}
          path={PATH}
          autoWalk={autoWalk}
          autoWalkPaused={autoWalkPaused}
          zones={PAUSE_ZONES}
          onEnterZone={handleEnterZone}
        />

        {/* HUD */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '16px 20px',
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(30,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            padding: '6px 16px',
            borderRadius: '6px',
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#f5e6c0',
            letterSpacing: '0.04em',
          }}>
            Library
          </div>

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
              ← Exit Museum
            </a>
          </div>
        </div>

        {showCredits && (
          <CreditsPanel onClose={() => setShowCredits(false)}>
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Credits</p>
          </CreditsPanel>
        )}

        <MobileControls nearDoor={nearDoor} onInteract={handleInteract} />

        {openCategory !== null && (
          <CategoryModal
            category={openCategory}
            items={CATEGORY_DATA[openCategory]}
            onClose={() => setOpenCategory(null)}
          />
        )}
      </div>
    </ControlsProvider>
  )
}

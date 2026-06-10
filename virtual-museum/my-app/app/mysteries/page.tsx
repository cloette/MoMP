'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { CreditsPanel } from '../components/CreditsPanel'
import { PauseZone } from '../components/RailCamera'

const Scene = dynamic(() => import('./scene'), { ssr: false })

// Segment lengths: 20 + 18 = 38 total
const PATH_EXT: readonly [number, number][] = [
  [0,  18], 
  [-3,  14],
  [-3,  13],
  [3,  13],
  [3,  -13],  
  [-3,  -13],  
  [-3,  3],  
  [0, 0],
  [0, -18],  
]
// Place camera at the midpoint of segment 1 (z ≈ 0)
const START_T = .05
const AMBIENT_VOLUME = 0.03

const PAUSE_ZONES: PauseZone[] = [
  { t: 0.01, audioSrc: '/exhibitobjects/mysteries/Pmextended.m4a' },
  { t: 0.10, audioSrc: '/exhibitobjects/mysteries/Moon.m4a' },
  { t: 0.12, audioSrc: '/exhibitobjects/mysteries/Mbemba.m4a' },
  { t: 0.22, audioSrc: '/exhibitobjects/mysteries/Consciousness.m4a' },
  { t: 0.36, audioSrc: '/exhibitobjects/mysteries/Dinosaurs.m4a' },
  { t: 0.49, audioSrc: '/exhibitobjects/mysteries/Protons.m4a' },
  { t: 0.50, audioSrc: '/exhibitobjects/mysteries/Darkmatter.m4a' },
  { t: 0.54, audioSrc: '/exhibitobjects/mysteries/Continental.m4a' },
  { t: 0.55, audioSrc: '/exhibitobjects/mysteries/Tardigrades.m4a' },
  { t: 0.75, audioSrc: '/exhibitobjects/mysteries/Sleep.m4a' },
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

export default function Page() {
  const router = useRouter()
  const [nearDoor, setNearDoor] = useState(false)
  const [autoWalk, setAutoWalk] = useState(false)
  const [autoWalkPaused, setAutoWalkPaused] = useState(false)
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
      const ambient = new Audio('/exhibitobjects/mysteries/zec53-inspiring-adventure-epic-cinematic-orchestral-trailer-315359.mp3')
      ambient.volume = AMBIENT_VOLUME
      ambient.loop = true
      ambientAudioRef.current = ambient
      ambient.play().catch(() => {})
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
        const  ambient = new Audio('/exhibitobjects/mysteries/zec53-inspiring-adventure-epic-cinematic-orchestral-trailer-315359.mp3')
        ambient.volume = AMBIENT_VOLUME
        ambient.loop = true
        ambientAudioRef.current = ambient
        ambient.play().catch(() => { })
      } else {
        ambientAudioRef.current.play().catch(() => { })
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

  const handleEnterZone = useCallback((index: number) => {
    const zone = PAUSE_ZONES[index]
    if (!zone || audioMutedRef.current) return

    setAutoWalkPaused(true)
    currentAudioRef.current?.pause()
    const audio = new Audio(zone.audioSrc)
    currentAudioRef.current = audio
    audio.play().catch(() => { setAutoWalkPaused(false) })
    audio.addEventListener('ended', () => { setAutoWalkPaused(false) }, { once: true })
  }, [])

  // Generic navigate: cleans up audio, persists auto-walk flag, then pushes route
  const handleNavigate = useCallback((route: string) => {
    currentAudioRef.current?.pause()
    currentAudioRef.current = null
    if (autoWalkRef.current) sessionStorage.setItem('momp_autowalk', '1')
    router.push(route)
  }, [router])

  // Default action for keyboard Enter / auto-walk / mobile = far-left door
  const handleInteract = useCallback(() => handleNavigate('nature'), [handleNavigate])

  const handleSecretNavigate = useCallback(() => handleNavigate('secret0DT'), [handleNavigate])

  const nearDoorRef = useRef(false)
  useEffect(() => { nearDoorRef.current = nearDoor }, [nearDoor])

  // Keyboard shortcuts: Space = auto-walk · / = audio · Enter = door
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') return
      if (e.key === ' ')     { e.preventDefault(); handleToggleAutoWalk() }
      if (e.key === '/')     { e.preventDefault(); handleToggleMute() }
      if (e.key === 'Enter' && nearDoorRef.current) handleInteract()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleToggleAutoWalk, handleToggleMute, handleInteract])

  // Pause camera when auto-walk reaches the door, then navigate after brief delay
  useEffect(() => {
    if (!autoWalk || !nearDoor) {
      setAutoWalkPaused(false)
      return
    }
    setAutoWalkPaused(true)
    const t = setTimeout(handleInteract, 1500)
    return () => {
      clearTimeout(t)
      setAutoWalkPaused(false)
    }
  }, [autoWalk, nearDoor, handleInteract])

  return (
    <ControlsProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <Scene
          nearDoor={nearDoor}
          onNearDoor={setNearDoor}
          onNavigate={handleNavigate}
          onSecretDoorInteract={handleSecretNavigate}
          path={PATH_EXT}
          startT={START_T}
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
              Spotted an error, an omission, or something that deserves more care? <a href="https://forms.gle/mogSB53GkJcgRUL18" target="_blank">Let us know!</a>
              <br></br>
              <em>Credits:</em><br />
              Moon Photo by <a href="https://unsplash.com/@nevenkrcmarek?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Neven Krcmarek</a> on <a href="https://unsplash.com/photos/full-moon-9dTg44Qhx1Q?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Brain Photo by <a href="https://unsplash.com/@averey?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Robina Weermeijer</a> on <a href="https://unsplash.com/photos/brown-brain-decor-in-selective-focus-photography-3KGF9R_0oHs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Map Photo by <a href="https://unsplash.com/@hartonocreativestudio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hartono Creative Studio</a> on <a href="https://unsplash.com/photos/a-blue-and-white-map-of-the-world-1gW-pzeXX2E?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Oregon Vortex Photo by <a href="https://unsplash.com/@sierrahouk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sierra Houk</a> on <a href="https://unsplash.com/photos/a-sign-on-a-road-4vLTihdrifg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Wave Photo by <a href="https://unsplash.com/@a_chosensoul?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">A Chosen Soul</a> on <a href="https://unsplash.com/photos/a-purple-wave-of-light-on-a-black-background-FnGZcsmeD2U?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Sleeping Koala Photo by <a href="https://unsplash.com/@davidclode?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">David Clode</a> on <a href="https://unsplash.com/photos/koala-bear-sleeping-on-tree-Yg_sNKOiXvY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Thundercloud Photo by <a href="https://unsplash.com/@noaa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">NOAA</a> on <a href="https://unsplash.com/photos/white-clouds-under-blue-sky-during-daytime-UJsUJr3cgEM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Molecule structure Photo by <a href="https://unsplash.com/@spexypants?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ayush Kumar</a> on <a href="https://unsplash.com/photos/an-image-of-a-structure-that-looks-like-a-structure-VIb8pHrBUC4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Physics experiement Photo by <a href="https://unsplash.com/@avivace?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Antonio Vivace</a> on <a href="https://unsplash.com/photos/a-large-metal-object-with-a-clock-on-its-side-sorv8yNYE6g?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Blue vortex Photo by <a href="https://unsplash.com/@pixelprovibes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">PixelPro Vibes</a> on <a href="https://unsplash.com/photos/a-black-hole-with-a-bright-blue-accretion-disk-isqg1cuGcuU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Dinosaur bones Photo by <a href="https://unsplash.com/@el_chicho?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Narciso Arellano</a> on <a href="https://unsplash.com/photos/brown-animal-skeleton-on-glass-roof-XGs1Dwk9V9M?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              <br />Tardigrade by Philippe Garcelon is licensed under CC BY 2.0 on <a href="https://www.flickr.com/photos/78178083@N05/51952626085" target="_blank">Flickr</a>.
              <br />Mpemba effect <a href="https://www.youtube.com/watch?v=UjIdzcxSe3g&pp=ygUNbXBlbWJhIGVmZmVjdA%3D%3D" target="_blank">video</a> by Veritasium.
              <br />Lyamin O, Pryaslova J, Lance V, Siegel J. Animal behaviour: continuous activity in cetaceans after birth. Nature. 2005 Jun 30;435(7046):1177. doi: 10.1038/4351177a. PMID: 15988513; PMCID: PMC8790654. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8790654/" target="_blank">Link.</a>
              <br />Bullfrog Brumation - Virginia Herpetological Society - <a href="https://www.virginiaherpetologicalsociety.com/amphibians/frogsandtoads/american-bullfrog/index.php/" target="_blank">https://www.virginiaherpetologicalsociety.com/amphibians/frogsandtoads/american-bullfrog/index.php</a>
              <br />Live Science, &quot;38,000-Year-Old Rock Art Discovered in France&quot; - <a href="https://www.livescience.com/57678-ancient-rock-art-discovered-in-france.html">Link.</a>
              <br />Music - &quot;Inspiring Adventure epic cinematic orchestral trailer&quot; by zec53 on Pixabay. Copyright-free.
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

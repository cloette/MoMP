'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ControlsProvider } from '../components/ControlsContext'
import { MobileControls } from '../components/MobileControls'
import { CreditsPanel } from '../components/CreditsPanel'
import { PauseZone } from '../components/RailCamera'
import Link from 'next/link'

const Scene = dynamic(() => import('./scene'), { ssr: false })

const PATH_EXT: readonly [number, number][] = [
  [0, 18],
  [-3, 14],
  [-3, 13],
  [0, 13],
  [8, -13],
  [8, 13],
  [0, 0],
  [-8, -13],
  [-8, 2],
  [0, 0],
  [0, -18],
]
// Place camera at the midpoint of segment 1 (z ≈ 0)
const START_T = 0
const AMBIENT_VOLUME = 0.2  // 0.0 – 1.0

const PAUSE_ZONES: PauseZone[] = [
  { t: 0.90, audioSrc: '' },
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
      const ambient = new Audio('/exhibitobjects/occupational/occupational-ambiance.mp3')
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
        const ambient = new Audio('/exhibitobjects/occupational/occupational-ambiance.mp3')
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
  const handleInteract = useCallback(() => handleNavigate('/occupational2'), [handleNavigate])

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
              Spotted an error, an omission, or something that deserves more care? <Link href="https://forms.gle/mogSB53GkJcgRUL18" target="_blank"><b>Let us know!</b></Link>
              <br></br><br></br>
              <em>Credits:</em><br></br>
              &quot;File:Rhumsiki crab sorceror.jpg.&quot; Wikimedia Commons. 31 Dec 2025, 13:34 UTC. https://commons.wikimedia.org/w/index.php?title=File:Rhumsiki_crab_sorceror.jpg&oldid=1139589112. 15 Jun 2026, 18:29.
              <br />
              &quot;Retro style stage&quot; (https://skfb.ly/6WPVA) by Mayantique is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />&quot;Curtain&quot; (https://skfb.ly/oHQXO) by milaink is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
              <br />Book Cover of "Black Bull, Ancestors and Me: My Life as a Lesbian Sangoma" by Nkunzi Zandile Nkabinde from https://www.amazon.com/stores/author/B001NSU5C6.
              <br /> China map by Sbb1413 on wikimedia, original is here: https://commons.wikimedia.org/wiki/File:Country-level_map_of_the_China_region.svg. Changes were made to flatten colors. This file is licensed under the Creative Commons Attribution 4.0 International license. (https://creativecommons.org/licenses/by/4.0/deed.en)
              <br /><a href="https://www.vecteezy.com/free-png/india">India PNGs by Vecteezy</a>
              <br /><a href="https://www.vecteezy.com/free-png/egypt">Egypt PNGs by Vecteezy</a>
              <br />Hesy-Ra image of relief; public domain, Hesy-Ra_CG1426.jpg: User:GDK: James Edward Quibell († 5. Juni 1935)
              <br />Papyrus Ebers image by Einsamer Schütze, File:PEbers_c41.jpg licensed with Cc-by-sa-3.0,2.5,2.0,1.0, GFDL Einsamer Schütze https://en.wikipedia.org/wiki/File:PEbers_c41-bc.jpg
              <br />Depiction of the Devil giving wax dolls to witches, from The History of Witches and Wizards. Public Domain. Date: 1720. Source: https://commons.wikimedia.org/wiki/File:Agnes_Sampson_and_witches_with_devil.jpg  Author:	Unknown author
              <br />Portrait of Marie Anne Lenormand from The Court of Napoleon by Frank Boott Goodrich, Date	12 September 2012, 11:13:52, Source	The Court of Napoleon (Derby and Jackson, New York 1858), Author	Frank Boott Goodrich (1826-1894) and Jules Champagne. https://commons.wikimedia.org/wiki/File:Portrait_of_Mlle_Lenormand_from_The_Court_of_Napoleon.jpg
              <br />Native American healing practices, https://pmc.ncbi.nlm.nih.gov/articles/PMC2913884/.
              <br />Lector Priest, universal public domain image, https://commons.wikimedia.org/wiki/File:Stela_of_the_lector_priest_of_Amun_Siamun_and_his_mother_the_singer_Amenhotep_MET_DT2928.jpg
              <br />Stambali by Hn Khaoula, licensed under the  Creative Commons Attribution-Share Alike 4.0 International license, https://commons.wikimedia.org/wiki/File:Stambali_au_mouled.jpg, https://creativecommons.org/licenses/by-sa/4.0/deed.en
              <br />Daoist Priest's Robe, China, back (MET, 36.105), universal public domain, https://www.metmuseum.org/art/collection/search/65366. https://commons.wikimedia.org/wiki/File:MET_TP479.jpg
              <br />Itneg shaman, licensed as public domain, by Fay-Cooper Cole on wikimedia: https://commons.wikimedia.org/wiki/File:An_Itneg_shaman_renewing_an_offering_to_the_spirit_shield_(1922,_Philippines).jpg
              <br />All music is copyright-free from Pixabay (human-created tracks only).
            </p>
          </CreditsPanel>
        )}

        <MobileControls nearDoor={nearDoor} onInteract={handleInteract} />
      </div>
    </ControlsProvider>
  )
}

'use client'
import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { Frame } from './Frame'

export type ExhibitContent =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string }
  | { type: 'youtube'; youtubeId: string; title?: string }
  | { type: 'placeholder' }

interface ExhibitFrameProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  content: ExhibitContent
}

// Pixel width/height that visually fills one 1.4 × 1.05 world-unit frame
// at distanceFactor=6, viewed from ~5.8 units away (the gallery wall distance).
// Adjust these constants if the content looks too large or too small.
const PX_W = 189
const PX_H = 142

export function ExhibitFrame({
  position,
  rotation = [0, 0, 0],
  width = 1.4,
  height = 1.05,
  content,
}: ExhibitFrameProps) {
  return (
    <group position={position} rotation={rotation}>
      <Frame position={[0, 0, 0]} width={width} height={height} />
      {content.type !== 'placeholder' && (
        <Html
          center
          transform
          occlude={true}
          distanceFactor={6}
          position={[0, 0, 0.01]}
        >
          <FrameMedia content={content} />
        </Html>
      )}
    </group>
  )
}

// ─── per-type renderers ───────────────────────────────────────────────────────

function FrameMedia({ content }: { content: Exclude<ExhibitContent, { type: 'placeholder' }> }) {
  if (content.type === 'image')   return <ImageMedia src={content.src} alt={content.alt} />
  if (content.type === 'video')   return <VideoMedia src={content.src} />
  if (content.type === 'youtube') return <YouTubeMedia youtubeId={content.youtubeId} title={content.title} />
  return null
}

function ImageMedia({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <div style={{ width: PX_W, height: PX_H, overflow: 'hidden', background: '#111' }}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}

function VideoMedia({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [autoplay, setAutoplay] = useState(false)

  function toggleAutoplay() {
    const next = !autoplay
    setAutoplay(next)
    if (next) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }

  return (
    <div style={{
      width: PX_W,
      height: PX_H,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        controls
        style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'contain', display: 'block' }}
      />
      {/* Autoplay toggle — off by default. Remove this button if the feature is never needed. */}
      <button
        onClick={toggleAutoplay}
        style={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          background: autoplay ? 'rgba(108,52,131,0.85)' : 'rgba(0,0,0,0.55)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 4,
          fontSize: 9,
          padding: '2px 5px',
          cursor: 'pointer',
          fontFamily: 'sans-serif',
          pointerEvents: 'all',
          userSelect: 'none',
        }}
      >
        {autoplay ? '⏸ Autoplay: On' : '▶ Autoplay: Off'}
      </button>
    </div>
  )
}

// YouTube iframe is only mounted after a click so it doesn't allocate a WebGL
// context on load — YouTube's player uses WebGL, which can push the browser over
// its context limit and cause the Three.js canvas to lose its own context.
function YouTubeMedia({ youtubeId, title = 'YouTube video' }: { youtubeId: string; title?: string }) {
  const [active, setActive] = useState(false)
  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

  if (!active) {
    return (
      <div
        onClick={() => setActive(true)}
        style={{
          width: PX_W,
          height: PX_H,
          background: '#000',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <img
          src={thumb}
          alt={title}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Play button overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 18, marginLeft: 3 }}>▶</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: PX_W, height: PX_H, background: '#000' }}>
      <iframe
        width={PX_W}
        height={PX_H}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: 'block' }}
      />
    </div>
  )
}

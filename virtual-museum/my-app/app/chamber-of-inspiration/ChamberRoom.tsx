'use client'
import { Suspense, useState } from 'react'
import { Html } from '@react-three/drei'
import { Door } from '../components/Door'

const W = 14, D = 22, H = 4
const HW = W / 2, HD = D / 2

const COL = {
  floor: '#1d0b30',
  ceiling: '#15071f',
  walls: '#240e38',
  farWall: '#2c1242',
  trim: '#3e1a60',
  rail: '#541e78',
}

export const PLAYLIST: { title: string; src: string }[] = [
  { title: 'Rethink the limit', src: '/videos/inspiration-01.mp4' },
  { title: 'Dance Moves - 1', src: 'https://www.youtube.com/watch?v=XXfz_0JbRpg' },
  { title: 'Dance Moves - 2', src: 'https://www.youtube.com/watch?v=qWJmvab0dcE' },
  { title: 'Singing - 1', src: 'https://youtu.be/EXt9CgJhBhQ?si=qwelauZ3Q0TY9UKP&t=93' },
  { title: 'Singing - 2', src: 'https://www.youtube.com/watch?v=9jfOJKvQK_o&list=RD9jfOJKvQK_o'},
  { title: 'Singing - 3', src: 'https://www.youtube.com/watch?v=2rd8VktT8xY&list=RD2rd8VktT8xY'},
  { title: 'Teamwork', src: 'https://youtu.be/GPeeZ6viNgY?si=0DyLkfrPRDy5GDzL&t=38'},
  { title: '...more to come...', src:'/videos/inspiration-01.mp4'}
]

function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function toYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    const startTime = parsed.searchParams.get('t')
    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1)
    } else if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v') || ''
    }
    if (!videoId) return url
    return `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`
  } catch {
    return url
  }
}

interface ChamberRoomProps {
  onLobby: () => void
  onBack: () => void
}

export function ChamberRoom({ onLobby, onBack }: ChamberRoomProps) {
  const [selected, setSelected] = useState(0)

  return (
    <group>
      {/* ── LIGHTING ──────────────────────────────────────────────── */}
      <ambientLight intensity={.6} color="#7422aa" />
      <directionalLight position={[0, H, 0]} intensity={0.5} color="#8f44bb" />
      <pointLight position={[-HW + 2, H - 0.4, HD - 2]} intensity={1.0} color="#601a88" distance={20} />
      <pointLight position={[HW - 2, H - 0.4, HD - 2]} intensity={1.0} color="#601a88" distance={20} />
      {/* Screen glow */}
      <pointLight position={[0, 2.1, -HD + 1]} intensity={0.9} color="#ffffff" distance={8} />

      {/* ── FLOOR ─────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={COL.floor} roughness={0.95} />
      </mesh>

      {/* ── CEILING ───────────────────────────────────────────────── */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={COL.ceiling} roughness={0.95} />
      </mesh>

      {/* Ceiling light rails */}
      {([-2, 2] as number[]).map(x => (
        <mesh key={x} position={[x, H - 0.05, 0]}>
          <boxGeometry args={[0.06, 0.06, D - 0.4]} />
          <meshStandardMaterial
            color={COL.rail} emissive={COL.rail} emissiveIntensity={1.5}
            metalness={0.4} roughness={0.4}
          />
        </mesh>
      ))}

      {/* ── FAR WALL (z = -HD) — screen wall ─────────────────────── */}
      <mesh position={[0, H / 2, -HD]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={COL.farWall} roughness={0.9} />
      </mesh>

      {/* ── BACK WALL (z = +HD) ───────────────────────────────────── */}
      <mesh position={[0, H / 2, HD]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={COL.walls} roughness={0.9} />
      </mesh>

      {/* ── LEFT WALL (x = -HW) ───────────────────────────────────── */}
      <mesh position={[-HW, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={COL.walls} roughness={0.9} />
      </mesh>

      {/* ── RIGHT WALL (x = +HW) ──────────────────────────────────── */}
      <mesh position={[HW, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={COL.walls} roughness={0.9} />
      </mesh>

      {/* ── FLOOR TRIM ────────────────────────────────────────────── */}
      <mesh position={[0, 0.01, -HD + 0.11]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, 0.22]} />
        <meshStandardMaterial color={COL.trim} emissive={COL.trim} emissiveIntensity={0.5} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.01, HD - 0.11]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, 0.22]} />
        <meshStandardMaterial color={COL.trim} emissive={COL.trim} emissiveIntensity={0.5} roughness={0.8} />
      </mesh>

      {/* ── VIDEO SCREEN FRAME (far wall) ─────────────────────────── */}
      {/* Outer bezel */}
      <mesh position={[0, 2.1, -HD + 0.04]}>
        <boxGeometry args={[8.6, 4.0, 0.05]} />
        <meshStandardMaterial color="#050c1c" roughness={0.7} />
      </mesh>
      {/* Screen surface with emissive glow */}
      <mesh position={[0, 2.1, -HD + 0.07]}>
        <boxGeometry args={[8.0, 3.6, 0.015]} />
        <meshStandardMaterial color="#020510" roughness={0.2} emissive="#001244" emissiveIntensity={0.6} />
      </mesh>

      {/* ── VIDEO PLAYER + PLAYLIST ───────────────────────────────── */}
      {/* transform+occlude anchors the Html in 3D world space (fixed to the wall) */}
      <Html position={[0, 2.1, -HD + 0.1]} center transform occlude distanceFactor={6}>
        <div style={{
          display: 'flex',
          background: 'rgba(4, 10, 30, 0.96)',
          border: '1px solid #551e70',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(115, 30, 180, 0.4)',
          userSelect: 'none',
        }}>
          {/* Video player */}
          {isYouTubeUrl(PLAYLIST[selected].src) ? (
            <iframe
              key={selected}
              src={toYouTubeEmbedUrl(PLAYLIST[selected].src)}
              width="480"
              height="270"
              style={{ display: 'block', background: '#000', flexShrink: 0, border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={selected}
              src={PLAYLIST[selected].src}
              controls
              style={{ width: '480px', height: '270px', display: 'block', background: '#000', flexShrink: 0 }}
            />
          )}

          {/* Playlist sidebar */}
          <div style={{
            width: '160px',
            padding: '10px 8px',
            background: 'rgba(6, 14, 38, 0.98)',
            borderLeft: '1px solid #421a60',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            overflowY: 'auto',
          }}>
            <p style={{
              margin: '0 0 8px 2px',
              fontSize: '8px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#3a5aaa',
            }}>
              Playlist
            </p>

            {PLAYLIST.map((item, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 8px',
                  marginBottom: '3px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selected === i ? '#3d1560' : 'transparent',
                  border: `1px solid ${selected === i ? '#622a8a' : 'transparent'}`,
                  color: selected === i ? '#ddeeff' : '#8155aa',
                  fontSize: '11px',
                  lineHeight: 1.3,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  if (i !== selected) (e.currentTarget as HTMLElement).style.background = '#0e2044'
                }}
                onMouseLeave={e => {
                  if (i !== selected) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <span style={{
                  color: selected === i ? '#9b44ff' : '#3d2255',
                  fontSize: '9px', flexShrink: 0, fontVariantNumeric: 'tabular-nums',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </Html>

      {/* ── LOBBY DOOR (left wall, faces +x into room) ─────────────── */}
      <group position={[-HW, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Door label="Lobby" isNear={false} onInteract={onLobby} />
      </group>

      {/* ── BACK DOOR (right wall, faces -x into room) ─────────────── */}
      <group position={[HW, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Door label="Back" isNear={false} onInteract={onBack} />
      </group>
    </group>
  )
}

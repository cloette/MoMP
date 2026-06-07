'use client'
import { useMemo, Suspense, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { Door } from '../components/Door'
import { GlassJar } from './GlassJar'
import { DeskWithPaper } from './Desk'
import { Mirror } from './Mirror'
import { DressingShelf } from './DressingShelf'

// Room: W=12 (x: -6..+6), D=14 (z: -7..+7), H=3.6
const W = 12, D = 14, H = 3.6
const WALL = '#0a113d'
const FLOOR = '#888888'
const CEIL = '#000000'
const RAIL = '#005a74'
const RAIL_H = 0.12
const RAIL_D = 0.08

interface Props {
  nearDoor: boolean
  onDoorInteract: () => void
  lobbyDoorInteract: () => void
  onOpenDressUp: () => void
  onOpenStarStation: () => void
  starStationOpen?: boolean
}

export function WishRoomGeometry({ nearDoor, onDoorInteract, lobbyDoorInteract, onOpenDressUp, onOpenStarStation, starStationOpen }: Props) {
  return (
    <group>
      {/* ── LIGHTING ── */}
      <ambientLight intensity={0.65} />
      <pointLight position={[0, H - 0.3, 0]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-4, 2.5, -1]} intensity={2} color="#ff00ff" />
      <pointLight position={[4, 2.5, -1]} intensity={3} color="#4a93ff" />

      {/* ── FLOOR ── */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} />
      </mesh>

      {/* ── CEILING ── */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={CEIL} roughness={1} />
      </mesh>

      {/* ── WALLS ── */}
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      {/* Back wall (lobby side, z=+7) */}
      <mesh position={[0, H / 2, D / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      {/* Front wall (exterior side, z=-7) */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>

      {/* ── GREY RAILS (baseboards) ── */}
      <group position={[0, 3.5, 0]}>
      <mesh position={[-W / 2 + RAIL_D / 2, RAIL_H / 2, 0]}>
        <boxGeometry args={[RAIL_D, RAIL_H, D]} />
        <meshStandardMaterial color={RAIL} roughness={0.7} />
      </mesh>
      <mesh position={[W / 2 - RAIL_D / 2, RAIL_H / 2, 0]}>
        <boxGeometry args={[RAIL_D, RAIL_H, D]} />
        <meshStandardMaterial color={RAIL} roughness={0.7} />
      </mesh>
      <mesh position={[0, RAIL_H / 2, D / 2 - RAIL_D / 2]}>
        <boxGeometry args={[W, RAIL_H, RAIL_D]} />
        <meshStandardMaterial color={RAIL} roughness={0.7} />
      </mesh>
      <mesh position={[0, RAIL_H / 2, -D / 2 + RAIL_D / 2]}>
        <boxGeometry args={[W, RAIL_H, RAIL_D]} />
        <meshStandardMaterial color={RAIL} roughness={0.7} />
      </mesh>
      </group>

      {/* ── DOORS ── */}
      {/* Lobby door: back wall, decorative only (camera enters from this side) */}
      <group position={[0, 0, D / 2]} rotation={[0, Math.PI, 0]}>
        <Door isNear={false} onInteract={lobbyDoorInteract} />
      </group>
      {/* Exterior door: front wall, interactive exit */}
      <group position={[0, 0, -D / 2]}>
        <Door isNear={nearDoor} onInteract={onDoorInteract} />
      </group>

      <Suspense fallback={null}>
        <group position={[2.5, 0, -4]}>
          <GlassJar />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <group position={[4.9, 0, -2]} rotation={[0, 30, 0]}>
          <DeskWithPaper />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <group position={[-2.5, 0, -2]} rotation={[0, 19.5, 0]}>
          <Mirror />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <group position={[-5.3, 0.9,-6]} rotation={[0, 80, 0]}>
          <DressingShelf />
        </group>
      </Suspense>

      {/* ── ZONE LABELS (floating HTML buttons) — hidden while their modal is open ── */}
      {!starStationOpen && (
        <Html position={[-3.5, 3.4, -1.5]} center>
          <button
            type="button"
            onClick={onOpenDressUp}
            style={{
              background: 'rgba(160,80,220,0.92)',
              border: '1px solid rgba(220,170,255,0.5)',
              borderRadius: '8px',
              padding: '8px 18px',
              color: '#fff',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              pointerEvents: 'all',
              boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
              letterSpacing: '0.03em',
            }}
          >
            🪞 Dress-Up Studio
          </button>
        </Html>
      )}

      {!starStationOpen && (
        <Html position={[3.5, 3.4, -1.5]} center>
          <button
            type="button"
            onClick={onOpenStarStation}
            style={{
              background: 'rgba(60,130,210,0.92)',
              border: '1px solid rgba(150,200,255,0.5)',
              borderRadius: '8px',
              padding: '8px 18px',
              color: '#fff',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              pointerEvents: 'all',
              boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
              letterSpacing: '0.03em',
            }}
          >
            ⭐ Paper Star Station
          </button>
        </Html>
      )}
    </group>
  )
}

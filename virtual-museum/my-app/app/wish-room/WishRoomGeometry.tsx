'use client'
import { Html } from '@react-three/drei'
import { Door } from '../components/Door'

// Room: W=12 (x: -6..+6), D=14 (z: -7..+7), H=3.6
const W = 12, D = 14, H = 3.6
const WALL  = '#111111'
const FLOOR = '#888888'
const CEIL  = '#444444'
const RAIL  = '#666666'
const RAIL_H = 0.12
const RAIL_D = 0.08

interface Props {
  nearDoor: boolean
  onDoorInteract: () => void
  onOpenDressUp: () => void
  onOpenStarStation: () => void
}

export function WishRoomGeometry({ nearDoor, onDoorInteract, onOpenDressUp, onOpenStarStation }: Props) {
  return (
    <group>
      {/* ── LIGHTING ── */}
      <ambientLight intensity={0.45} />
      <pointLight position={[0, H - 0.3, 0]}  intensity={0.7} color="#ffffff" />
      <pointLight position={[-4, 2.5, -1]} intensity={0.6} color="#ffccff" />
      <pointLight position={[ 4, 2.5, -1]} intensity={0.6} color="#cce0ff" />

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

      {/* ── DOORS ── */}
      {/* Lobby door: back wall, decorative only (camera enters from this side) */}
      <group position={[0, 0, D / 2]} rotation={[0, Math.PI, 0]}>
        <Door label="← Lobby" isNear={false} onInteract={() => {}} />
      </group>
      {/* Exterior door: front wall, interactive exit */}
      <group position={[0, 0, -D / 2]}>
        <Door label="Exterior →" isNear={nearDoor} onInteract={onDoorInteract} />
      </group>

      {/* ── ZONE FLOOR CIRCLES ── */}
      <mesh position={[-3.5, 0.005, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#2a0a3a" roughness={1} />
      </mesh>
      <mesh position={[3.5, 0.005, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#0a1a2a" roughness={1} />
      </mesh>

      {/* ── ZONE LABELS (floating HTML buttons) ── */}
      <Html position={[-3.5, 2.4, -1.5]} center>
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

      <Html position={[3.5, 2.4, -1.5]} center>
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

      {/* ── PLACEHOLDER PROPS (swapped for real GLTFs later) ── */}
      {/* Dress-up area: mirror stand */}
      <mesh position={[-4.8, 1.6, -2.5]}>
        <boxGeometry args={[0.08, 2.2, 0.08]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-4.8, 2.5, -2.5]}>
        <boxGeometry args={[0.9, 1.4, 0.04]} />
        <meshStandardMaterial color="#b0c0cc" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* Star station: small table */}
      <mesh position={[4.0, 0.75, -2.5]}>
        <boxGeometry args={[1.4, 0.06, 0.9]} />
        <meshStandardMaterial color="#555" roughness={0.7} />
      </mesh>
      <mesh position={[4.0, 0.375, -2.5]}>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>
    </group>
  )
}

'use client'
import { Environment, Html } from '@react-three/drei'
import { Door } from '../components/Door'
import type { CategoryName } from './CategoryModal'
import { Suspense } from 'react'
import { Setting } from './settingobject'
import { FancyDoor } from './Door'

const W = 14
const D = 18
const H = 5.6

const LEFT_CATEGORIES: { label: CategoryName; z: number }[] = [
  { label: 'Books', z: 3.5 },
  { label: 'Comics/Manga', z: 0 },
  { label: 'Video', z: -3.5 },
]

const RIGHT_CATEGORIES: { label: CategoryName; z: number }[] = [
  { label: 'Games', z: 2 },
  { label: 'Other', z: -2 },
]

interface LibraryRoomProps {
  nearDoor: boolean
  onDoorInteract: () => void
  onLobbyDoorInteract: () => void
  onChamberDoorInteract: () => void
  onOpenCategory: (cat: CategoryName) => void
}

function CategoryPlaque({
  label,
  position,
  rotation,
  onClick,
}: {
  label: string
  position: [number, number, number]
  rotation: [number, number, number]
  onClick: () => void
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer wooden frame */}
      <mesh>
        <boxGeometry args={[2.6, 0.55, 0.07]} />
        <meshStandardMaterial color="#3d1f0a" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Parchment inner panel */}
      <mesh position={[0, 0, 0.036]}>
        <boxGeometry args={[2.38, 0.38, 0.02]} />
        <meshStandardMaterial color="#f2e4c4" roughness={0.9} />
      </mesh>
      {/* Invisible click surface */}
      <mesh
        position={[0, 0, 0.08]}
        onClick={onClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={[2.6, 0.55, 0.05]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      {/* Text label */}
      <Html position={[0, 0, 0.07]} transform center>
        <div style={{
          fontSize: '9px',
          fontFamily: 'Georgia, serif',
          color: '#2a1005',
          whiteSpace: 'nowrap',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {label}
        </div>
      </Html>
    </group>
  )
}

export function LibraryRoom({
  nearDoor,
  onDoorInteract,
  onLobbyDoorInteract,
  onChamberDoorInteract,
  onOpenCategory,
}: LibraryRoomProps) {
  return (
    <group>
      {/* ── BACKDROP ────────────────────────────────────────────── */}

      {/* Sky-ground fill */}
      <hemisphereLight args={['#ffffff', '#ffffff', 0.5]} />
      {/* Sun — position matches Sky sunPosition */}
      <directionalLight
        position={[80, 30, 100]}
        intensity={5.2}
        color="#fffcee"
        castShadow
      />

      {/* ── LIGHTING ────────────────────────────────────────────── */}
      <ambientLight intensity={0.95} />
      <Suspense fallback={null}>
        <group>
          <Setting />
        </group>
      </Suspense>

      {/* ── LIGHTING ──────────────────────────────────────────── */}
      <ambientLight intensity={0.45} color="#ffddcc" />
      <directionalLight position={[0, H - 0.3, 0]} intensity={0.5} color="#ffe8d0" />

      {/* ── CATEGORY PLAQUES — LEFT WALL (Books, Comics/Manga, Video) ── */}
      {LEFT_CATEGORIES.map(({ label, z }) => (
        <CategoryPlaque
          key={label}
          label={label}
          position={[-W / 3 + 0.05, 2.5, z - 2.5]}
          rotation={[0, Math.PI / 2, 0]}
          onClick={() => onOpenCategory(label)}
        />
      ))}

      {/* ── CATEGORY PLAQUES — RIGHT WALL (Games, Other) ─────── */}
      {RIGHT_CATEGORIES.map(({ label, z }) => (
        <CategoryPlaque
          key={label}
          label={label}
          position={[W / 3 - 0.05, 2.5, z - 2.5]}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={() => onOpenCategory(label)}
        />
      ))}

      {/* ── LOBBY DOOR (front wall, center — faces interior) ──── */}
      <group position={[0, 0, D / 2 + 0.06]} rotation={[0, Math.PI, 0]}>
        <Door label="Lobby" isNear={false} onInteract={onLobbyDoorInteract} />
      </group>

      {/* ── CHAMBER OF INSPIRATION DOOR (back wall, right side) ─ */}
      {/* Hidden click target — no visible geometry */}
      <mesh
        position={[3.8, 1.2, -D / 2 + 0.12]}
        onClick={onChamberDoorInteract}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={[1.4, 2.5, 0.08]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Door embedded in front face of pedestal */}
      <Suspense fallback={null}>
        <group position={[0, .34, -D / 2 + 1.76]}>
          <FancyDoor isNear={nearDoor} onInteract={onDoorInteract} />
        </group>
      </Suspense>

    </group>
  )
}

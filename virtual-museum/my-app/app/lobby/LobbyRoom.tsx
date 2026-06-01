'use client'
import { useMemo, Suspense } from 'react'
import { Environment, useGLTF } from '@react-three/drei'

const W = 12
const D = 14
const H = 3.6

interface LobbyProps {
  nearDoor: boolean
  onDoorInteract: () => void
}

export function LobbyRoom({
  nearDoor,
  onDoorInteract,
}: LobbyProps) {
  return (
    <group>
      {/* ── BACKDROP ────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <Environment
          files="/exhibitobjects/lobby/spacebg.webp"
          background
        />
      </Suspense>

      {/* ── LIGHTING ────────────────────────────────────────────── */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.55} color="#fffef8" />

      {/* ── IN-ROOM OBJECTS ─────────────────────────────────────── */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.015, -11.5 + i * 2.0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[2.0, 1.8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#b0a898' : '#a09888'}
            roughness={0.97}
          />
        </mesh>
      ))}

    </group>
  )
}

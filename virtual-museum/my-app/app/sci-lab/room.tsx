'use client'
import { useMemo, Suspense, useEffect } from 'react'
import { Environment, Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { Setting } from './settingobject'
import { FancyDoor } from './Door'
import { Desk } from './desk'
import { Station } from './station'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 30


const W = 20
const D = 24
const H = 4.7

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
  { x: 0, label: 'Nature', route: '/nature' },
]

interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
  return (
    <group>

      {/* ── BACKDROP ────────────────────────────────────────────── */}

      {/* Sky-ground fill */}
      <hemisphereLight args={['#ffffff', '#9e9e9e', 0.5]} />
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
        <group position={[-1, 0, 5]} rotation={[0, Math.PI / 2, 0]}>
          <Setting />
        </group>
        <group position={[1, 0, 5]} rotation={[0, -Math.PI / 2, 0]}>
          <Setting />
        </group>
      </Suspense>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0 + 5]}>
        <planeGeometry args={[W, D + 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2 + 3.7]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f7f5f2" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2 + 6.3]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f7f5f2" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 8]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f4f1ed" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f4f1ed" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.3, 6.3]} receiveShadow>
        <planeGeometry args={[W + 6, D + 12.5]} />
        <meshStandardMaterial color="#b6e3ff" roughness={0.9} />
      </mesh>
      {/* Baseboards */}
      <mesh position={[0, 0.08, -D / 2 + 0.04 + 3.7]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh position={[0, 0.08, D / 2 - 0.04 + 6.3]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2 + 0.04, 0.08, 8]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[W / 2 - 0.04, 0.08, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh position={[0, 4.6, -D / 2 + 0.04 + 3.7]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh position={[0, 4.6, D / 2 - 0.04 + 6.3]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2 + 0.04, 4.6, 8]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[W / 2 - 0.04, 4.6, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>

      <Suspense fallback={null}>
        <group
          position={[-5, 0, 16]} rotation={[0, Math.PI, 0]}>
          <Desk />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <group
          position={[9, 0, -3]} rotation={[0, -Math.PI, 0]}>
          <Station />
        </group>
      </Suspense>

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[5, 0, FAR_Z + 10]} rotation={[0, 0, 0]}>
          <FancyDoor
            isNear={nearDoor}
            onInteract={() => onNavigate('/nature')}
          />
        </group>
        <group
          position={[-5, 0, BACK_Z - 0]} rotation={[0, Math.PI, 0]}>
          <FancyDoor
            isNear={nearDoor}
            onInteract={() => onNavigate('/lobby')}
          />
        </group>
      </Suspense>
    </group>
  )
}

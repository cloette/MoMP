'use client'
import { useMemo, Suspense, useEffect } from 'react'
import { Environment, Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { Setting } from './settingobject'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 30


const W = 16
const D = 38
const H = 5.6

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
  { x: 0, label: 'Technology', route: '/technology' },
]

interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
  return (
    <group>

      {/* ── BACKDROP ────────────────────────────────────────────── */}
            <Suspense fallback={null} >
                <Environment 
                files="/exhibitobjects/exterior/brighterbg2.jpg"
                background
              />
            </Suspense>

      {/* Sky-ground fill */}
      <hemisphereLight args={['#87ceeb', '#558633', 0.5]} />
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

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[0, 0, FAR_Z - .95]}>
          <Door
            label={"Nature"}
            isNear={nearDoor}
            onInteract={() => onNavigate('/technology')}
          />
        </group>
        <group
          position={[0, 0, BACK_Z + .95]} >
          <Door
            isNear={nearDoor}
            onInteract={() => onNavigate('/lobby')}
          />
        </group>
      </Suspense>
    </group>
  )
}

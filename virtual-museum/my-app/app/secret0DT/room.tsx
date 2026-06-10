'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { Setting } from './settingobject'

const FAR_Z = -18
const BACK_Z = 18
const W = 16
const D = 38
const H = 5.6

interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {

  return (
    <group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[W, D / 2]} />
        <meshStandardMaterial color="#7f7f7f" roughness={0.9} />
      </mesh>


      {/* Back wall 
      <mesh position={[0, H / 2, 1]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#000000" />
      </mesh>*/}
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 10]}>
        <planeGeometry args={[D /2, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 10]}>
        <planeGeometry args={[D /2, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}
      <ambientLight intensity={0.95} />
      <Suspense fallback={null}>
        <group position={[3.5, 0, -94]} rotation={[0, -Math.PI * .5, 0]}>
          <Setting />
        </group>
      </Suspense>

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[0, 0, 120 - .95]}>
          <Door
            label={"Nature"}
            isNear={nearDoor}
            onInteract={() => onNavigate('/nature')}
          />
        </group>
        <group
          position={[0, 0, BACK_Z + .95]} >
          <Door
            isNear={nearDoor}
            onInteract={() => onNavigate('/mysteries')}
          />
        </group>
      </Suspense>

      {/* ── INVISIBLE DOOR ─ */}
      <group position={[0, 5.2, 12.27]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          onClick={() => onNavigate('/mysteries')}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = 'auto' }}
        >
          <boxGeometry args={[1.4, 2.5, 0.08]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  )
}

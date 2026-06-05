'use client'
import { useMemo, Suspense, useEffect } from 'react'
import { Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Door } from '../components/Door'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 30


const W = 16
const D = 38
const H = 5.6

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
    { x: 0, label: 'Exhibits', route: '/room-a' },
]

interface RoomProps {
    nearDoor: boolean
    onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
    return (
        <group>
            
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#7f7f7f" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}

      <ambientLight intensity={0.65} />
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.55} color="#fffef8" />
      <spotLight position={[-2.5, H - 0.15, -2.5]} target-position={[-6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[-2.5, H - 0.15,  2.5]} target-position={[-6, 1.8,  2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[ 2.5, H - 0.15, -2.5]} target-position={[ 6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[ 2.5, H - 0.15,  2.5]} target-position={[ 6, 1.8,  2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />

            {/* ── DOORS ───────────────────────────────────────────────── */}
            <Suspense fallback={null}>
                <group
                    position={[0, 0, FAR_Z -.95]}>
                    <Door
                        label={"Lobby"}
                        isNear={nearDoor}
                        onInteract={() => onNavigate('/lobby')}
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

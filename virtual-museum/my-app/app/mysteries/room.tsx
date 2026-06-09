'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { QuestionCloud } from './questioncloud'
import { ExhibitFrame } from '../components/ExhibitFrame'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 30


const W = 16
const D = 38
const H = 5.6

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
    { x: 0, label: 'Nature', route: '/nature' },
]

interface RoomProps {
    nearDoor: boolean
    onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
    const cubeRef2 = useRef<THREE.Mesh>(null)
    const cubeRef = useRef<THREE.Mesh>(null)

    const titleTexture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 256
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, 512, 256)
        ctx.textBaseline = 'top'
        ctx.font = '30px "Times New Roman", serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Persistent', 20, 12)
        ctx.font = 'italic 96px "Times New Roman", serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Mysteries', 35, 48)
        ctx.font = '26px Arial, sans-serif'
        ctx.fillStyle = '#9f9f9f'
        ctx.fillText("What we don't know may surprise you.", 20, 188)
        return new THREE.CanvasTexture(canvas)
    }, [])

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

      <mesh ref={cubeRef2} position={[-6, 2.7, 8]}>
        <boxGeometry args={[6, .5, .5]} />
        <meshStandardMaterial
          color={"#ececec"}
          roughness={0}
          metalness={0.25}
        />
      </mesh>

      <mesh ref={cubeRef} position={[-6, 0, 8]}>
        <boxGeometry args={[6, 5, .5]} />
        <meshStandardMaterial
          color={"#000000"}
          roughness={0}
          metalness={0.25}
        />
        {/* Title text as canvas texture — sits 0.02 units in front of the panel face */}
        <mesh position={[1.7, 1.5, 0.27]}>
          <planeGeometry args={[2.4, 1.2]} />
          <meshBasicMaterial map={titleTexture} transparent />
        </mesh>
      </mesh>

      <QuestionCloud />

      <ExhibitFrame
        position={[-7.97, 2.5, 13]}
        rotation={[0, Math.PI / 2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[-7.97, 2.5, -15]}
        rotation={[0, Math.PI / 2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[-7.97, 2.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[7.97, 2.5, -15]}
        rotation={[0, -Math.PI /2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[7.97, 2.5, 0]}
        rotation={[0, -Math.PI /2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[7.97, 2.5, 13]}
        rotation={[0, -Math.PI /2, 0]}
        content={{ type: 'placeholder' }}
      />


            {/* ── DOORS ───────────────────────────────────────────────── */}
            <Suspense fallback={null}>
                <group
                    position={[0, 0, FAR_Z -.95]}>
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
                        onInteract={() => onNavigate('/lobby')}
                    />
                </group>
            </Suspense>
        </group>
    )
}

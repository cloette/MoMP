'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
import { Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { ExhibitFrame } from '../components/ExhibitFrame'
import { FancyDoor } from './Door'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 30

const W = 16
const D = 38
const H = 5.6

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
  { x: 0, label: 'Science Lab', route: '/sci-lab' },
]

interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
  const cubeRef2 = useRef<THREE.Mesh>(null)
  const cubeRef = useRef<THREE.Mesh>(null)

  return (
    <group>

            {/* Baseboards */}
      <mesh position={[0, 0.08, -D / 2 + 0.04]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh position={[0, 0.08, D / 2 - 0.04]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2 + 0.04, 0.08, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[W / 2 - 0.04, 0.08, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh position={[0, H, -D / 2 + 0.04]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh position={[0, H, D / 2 - 0.04]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2 + 0.04, H, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[W / 2 - 0.04, H, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#c8c0b8" />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#c4f5ff" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#c4f5ff" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}

      <ambientLight intensity={0.99} />

      <mesh ref={cubeRef2} position={[-6, 2.7, 8]}>
        <boxGeometry args={[6, .5, .5]} />
        <meshStandardMaterial
          color={"#d2f6ff"}
          roughness={0}
          metalness={0.25}
        />
      </mesh>

      <mesh ref={cubeRef} position={[-6, 0, 8]}>
        <boxGeometry args={[6, 5, .5]} />
        <meshStandardMaterial
          color={"#ffffff"}
          roughness={0}
          metalness={0}
        />
        <group position={[1.9, 1.5, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.55, 0.75, 0.015]} />
            <meshStandardMaterial color="#3c7fa5" roughness={0.8} />
          </mesh>
          <Html center transform distanceFactor={5}>
            <div
              style={{
                width: '510px',
                padding: '10px 14px',
                fontFamily: 'Times New Roman, serif',
                textAlign: 'left',
                pointerEvents: 'none',
                userSelect: 'none',
                maxWidth: '520px',
                zIndex: 1,
              }}
            >
              <div style={{ fontSize: '20px', color: '#3c7fa5', lineHeight: .5 }}>
                {'Magical Phenomena in '}
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '60px',
                  marginBottom: '5px',
                  color: '#0c0c0c',
                  letterSpacing: '0em',
                  fontStyle: 'italic',
                  marginLeft: '20px',
                }}
              >
                {'Technology'}
              </div>
            </div>
          </Html>
        </group>
      </mesh>

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
        rotation={[0, -Math.PI / 2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[7.97, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        content={{ type: 'placeholder' }}
      />

      <ExhibitFrame
        position={[7.97, 2.5, 13]}
        rotation={[0, -Math.PI / 2, 0]}
        content={{ type: 'placeholder' }}
      />

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[5, 0, FAR_Z - 0.95]} rotation={[0, 0, 0]}>
          <FancyDoor
            isNear={nearDoor}
            onInteract={() => onNavigate('/sci-lab')}
          />
        </group>
        <group
          position={[-5, 0, BACK_Z +.95]} rotation={[0, Math.PI, 0]}>
          <FancyDoor
            isNear={nearDoor}
            onInteract={() => onNavigate('/lobby')}
          />
        </group>
      </Suspense>
    </group>
  )
}

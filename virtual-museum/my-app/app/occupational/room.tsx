'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
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
    { x: 0, label: 'Echoes Across Cultures', route: '/echoes-across-cultures' },
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
            
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#ebff34" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#ebff34" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ff7c73" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ff7c73" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#ff7c73" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#ff7c73" />
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
          color={"#570300"}
          roughness={0}
          metalness={0.25}
        />
      </mesh>

      <mesh ref={cubeRef} position={[-6, 0, 8]}>
        <boxGeometry args={[6, 5, .5]} />
        <meshStandardMaterial
          color={"#fff"}
          roughness={0}
          metalness={0.25}
        />
        <group position={[1.9, 1.5, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.55, 0.75, 0.015]} />
            <meshStandardMaterial color="#570300" roughness={0.8} />
          </mesh>
          <Html center transform occlude distanceFactor={5}>
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
              <div style={{ fontSize: '20px', color: '#570300', lineHeight: .5 }}>
                {'Magic as an '}
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
                {'Occupation'}
              </div>
            </div>
          </Html>
        </group>
      </mesh>

            {/* ── DOORS ───────────────────────────────────────────────── */}
            <Suspense fallback={null}>
                <group
                    position={[0, 0, FAR_Z -.95]}>
                    <Door
                        label={"Echoes Across Cultures"}
                        isNear={nearDoor}
                        onInteract={() => onNavigate('/echoes-across-cultures')}
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

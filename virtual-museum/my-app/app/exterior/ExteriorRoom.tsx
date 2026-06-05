'use client'
import { useMemo, Suspense } from 'react'
import { Environment, useGLTF } from '@react-three/drei'
import { Door } from './Door'
import { Cave } from './Cave'
import { TreeGreen } from './TreePine'
import { TreePink } from './TreeSakura'
import { TreePurple } from './TreeJakaranda'
import { GrassCluster } from './GrassCluster'

// Orb: two half-globes combined into a full sphere
// Adjust ORB_SCALE if the GLB's native radius differs from 1 unit
const ORB_SCALE = 9   // → ~7-unit diameter sphere
const ORB_Z    = -16    // z-position of orb+pedestal centre
const DOOR_Z   = -14    // z of door (front face of pedestal)

function HarlequinOrb() {
  const { scene } = useGLTF('/exhibitobjects/exterior/harlequin_orb.glb')
  // Clone so both halves are independent objects
  const topHalf    = useMemo(() => scene.clone(true), [scene])
  const bottomHalf = useMemo(() => scene.clone(true), [scene])

  return (
    // Sphere centre sits at y = pedestal top (3.5) + orb radius (5) = 7.0
    <group position={[0, 11.5, -20]}>
      {/* Top dome — default orientation, flat face downward */}
      <primitive object={topHalf} scale={ORB_SCALE} />
      {/* Bottom dome — flip 180° around X to complete the sphere */}
      <group rotation={[Math.PI, -2.51, 0]}>
        <primitive object={bottomHalf} scale={ORB_SCALE} />
      </group>
    </group>
  )
}

useGLTF.preload('/exhibitobjects/exterior/harlequin_orb.glb')

interface ExteriorRoomProps {
  nearDoor: boolean
  onDoorInteract: () => void
}

export function ExteriorRoom({ nearDoor, onDoorInteract }: ExteriorRoomProps) {
  return (
    <group>

      {/* ── BACKDROP ────────────────────────────────────────────── */}
      <Suspense fallback={null} >
          <Environment 
          files="/exhibitobjects/exterior/brighterbg2.jpg"
          background
        />
      </Suspense>

      {/* ── LIGHTING ────────────────────────────────────────────── */}
      {/* Sky-ground fill */}
      <hemisphereLight args={['#87ceeb', '#558633', 0.5]} />
      {/* Sun — position matches Sky sunPosition */}
      <directionalLight
        position={[80, 30, 100]}
        intensity={1.2}
        color="#fffcee"
        castShadow
      />
      {/* Soft ambient fill */}
      <ambientLight intensity={0.3} />

      {/* ── GROUND ──────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 120]} />
        <meshStandardMaterial color="#868a1a" roughness={0.9} />
      </mesh>

      {/* ── GRASS PERIMETER ─────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group position={[-8, -.15, 38]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, -.15, 38]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-8, -.15, 30]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, -.15, 30]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-7.5, -.15, 20]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[1.8, -.15, 20]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-7.5, -.15, 15]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[1.8, -.15, 15]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-8, -.15, 68]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, -.15, 68]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-8, -.15, 58]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, -.15, 58]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-8, 0, 55]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, 0, 55]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-12, 0, 55]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[6, 0, 55]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-12, 0, 65]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[6, 0, 65]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-16, 0, 55]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[10, 0, 55]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-8, -.15, 49]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, -.15, 49]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[-8, -.15, 43]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
        <group position={[2, -.15, 43]} rotation={[0, 0, 0]}>
          <GrassCluster />
        </group>
      </Suspense>

      {/* ── PEDESTAL + ORB + DOOR ───────────────────────────────── */}
      <mesh position={[0, 0, ORB_Z]} castShadow receiveShadow>
        <boxGeometry args={[9, 5.5, 4]} />
        <meshStandardMaterial color="#c4bfb0" roughness={0.95} />
      </mesh>

      {/* Stone cap / trim on top of pedestal */}
      <mesh position={[0, 2.68, ORB_Z]}>
        <boxGeometry args={[9.3, 0.12, 4.3]} />
        <meshStandardMaterial color="#b0aaa0" roughness={0.8} />
      </mesh>

      {/* Orb (loaded async — wrapped in Suspense by ExteriorScene) */}
      <Suspense fallback={null}>
        <HarlequinOrb />
      </Suspense>

      {/* Door embedded in front face of pedestal */}
      <Suspense fallback={null}>
        <group position={[0, 0, DOOR_Z - 0.02]}>
          <Door isNear={nearDoor} onInteract={onDoorInteract} />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <Cave />
      </Suspense>

      <Suspense fallback={null}>
        <group position={[6, -1, 28]}>
          <TreeGreen />
        </group>
        <group position={[-6, -1, 28]}>
          <TreeGreen />
        </group>
      </Suspense>
      
      <Suspense fallback={null}>
        <group position={[6.5, 0, 0]}>
          <TreePink />
        </group>
        <group position={[-6.5, 0, 0]}>
          <TreePink />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <group position={[7, 0, 7]}>
          <TreePurple />
        </group>
        <group position={[-7, 0, 7]}>
          <TreePurple />
        </group>
      </Suspense>

      <Suspense fallback={null}>
        <group position={[7, 0, 48]}>
          <TreeGreen />
        </group>
        <group position={[-7, 0, 48]}>
          <TreeGreen />
        </group>
        <group position={[17, -.2, 48]}>
          <TreeGreen />
        </group>
        <group position={[-17, -.2, 48]}>
          <TreeGreen />
        </group>
        <group position={[11.5, 0, 30]}>
          <TreeGreen />
        </group>
        <group position={[-11.5, 0, 30]}>
          <TreeGreen />
        </group>
        <group position={[7.5, 0, 20]}>
          <TreeGreen />
        </group>
        <group position={[-7.5, 0, 20]}>
          <TreeGreen />
        </group>
      </Suspense>

      {/* ── GARDEN (behind camera start, positive Z) ────────────── */}

      {/* Stone path strip from z≈1 to z≈19 */}
      {Array.from({ length: 35 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.05, -11.5 + i * 2.0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[1.6, 1.8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#b0a898' : '#b0a898'}
            roughness={0.97}
          />
        </mesh>
      ))}

      {/* Bench — left side (x=-3), facing path, around z=8 */}
      <group position={[3, 0, 8]}>
        {/* Seat */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.1, 1.8]} />
          <meshStandardMaterial color="#8b7355" roughness={0.8} />
        </mesh>
        {/* Legs */}
        <mesh position={[0, 0.25, -0.8]}>
          <boxGeometry args={[0.45, 0.5, 0.08]} />
          <meshStandardMaterial color="#7a6448" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0.8]}>
          <boxGeometry args={[0.45, 0.5, 0.08]} />
          <meshStandardMaterial color="#7a6448" roughness={0.8} />
        </mesh>
      </group>

      {/* Bench — right side (x=+3), facing path */}
      <group position={[-3, 0, 8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.1, 1.8]} />
          <meshStandardMaterial color="#8b7355" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, -0.8]}>
          <boxGeometry args={[0.45, 0.5, 0.08]} />
          <meshStandardMaterial color="#7a6448" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0.8]}>
          <boxGeometry args={[0.45, 0.5, 0.08]} />
          <meshStandardMaterial color="#7a6448" roughness={0.8} />
        </mesh>
      </group>

    </group>
  )
}

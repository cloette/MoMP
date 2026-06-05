'use client'
import { useMemo, Suspense, useEffect } from 'react'
import { Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 20         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 38

const CROSSBAR_X_EXTENT = 22 

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
  { x:  0, label: 'Exhibits', route: '/mysteries'    },
]

function SpaceBackdrop() {
  const texture = useTexture('/exhibitobjects/arthall/backgroundAH.jpg')
  const { scene } = useThree()
  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    return () => { scene.background = null }
  }, [scene, texture])
  return null
}

function RevealedText({ position, isNear }: { position: [number, number, number], isNear: boolean }) {
  if (!isNear) return null

  const textStyle: React.CSSProperties = {
    opacity: 0,
    animation: 'revealText 8s ease-in-out 4s both',
    fontFamily: 'sans-serif',
    textShadow: '0 0 5px #000, 0 0 10px #000, 0 0 20px #000, 0 0 30px #000, 0 0 40px #000, 0 0 55px #000, 0 0 75px #000',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }

  return (
    <Html position={position} center zIndexRange={[10, 20]}>
      <style>{`
        @keyframes revealText {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <div style={{ ...textStyle, color: '#f9f9f9', padding: '4px 12px', fontSize: '20px' }}>
        This is the Art Hall.
      </div>
      <div style={{ ...textStyle, color: '#ffffff', padding: '4px 2px 4px 12px', fontSize: '34px' }}>
        Right now it&lsquo;s just a big empty space, <br />
        but soon it will be filled with colorful, <br />
        interactive art installations.
      </div>
    </Html>
  )
}

// Door portal 
function DoorPortal({
  position,
  rotationY = 0,
  label,
  isNear,
  onInteract,
}: {
  position: [number, number, number]
  rotationY?: number
  label?: string
  isNear: boolean
  onInteract?: () => void
}) {
  const { scene } = useGLTF('/exhibitobjects/lobby/doorportal.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[-4.8, 1.9, -1]} rotation={[-1.6, 0, 0]}>
        <primitive object={cloned} scale={.14} />
      </group>

      { label && (
      <Html position={[0, 2.5, -2]} center zIndexRange={[10, 20]}>
        <div
          style={{
            background: '#000000',
            color: '#ffffff',
            padding: '4px 12px',
            fontFamily: 'sans-serif',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            border: '1px solid #444',
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        >
          {label}
        </div>
      </Html>
      )}

      {/* Interaction hint when near */}
      {isNear && onInteract && (
        <Html position={[0, -0.4, 0]} center zIndexRange={[10, 20]}>
          <div
            style={{
              background: 'rgba(0,0,0,0.82)',
              color: '#fff',
              padding: '5px 12px',
              fontSize: '12px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              fontFamily: 'sans-serif',
            }}
          >
            Click or press{' '}
            <kbd style={{ background: '#444', padding: '1px 5px', borderRadius: '3px' }}>
              Enter
            </kbd>
          </div>
        </Html>
      )}

      {/* Invisible click target */}
      {onInteract && (
        <mesh
          position={[0, 1.5, -2.5]}
          onClick={onInteract}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = 'auto' }}
        >
          <boxGeometry args={[2, 3.5, 0.5]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  )
}

function PathLayer({
  y, xSize, zSize, centerZ, color, emissive, emissiveIntensity,
}: {
  y: number; xSize: number; zSize: number; centerZ: number
  color: string; emissive?: string; emissiveIntensity?: number
}) {
  return (
    <mesh position={[0, y, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[xSize, zSize]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity ?? 0}
        roughness={1}
      />
    </mesh>
  )
}

interface ArtHallProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function ArtHallRoom({ nearDoor, onNavigate }: ArtHallProps) {
  return (
    <group>
      {/* ── BACKDROP ────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <SpaceBackdrop />
      </Suspense>

      {/* ── LIGHTING ────────────────────────────────────────────── */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} color="#aaddff" />

      {/* ── GROUND ──────────────────────────────────────────────── */}
      <mesh position={[0, -0.02, PATH_CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* ── PATH STEM (along Z) ──────────────────────────────────── */}
      <PathLayer y={0.02} xSize={3.5} zSize={PATH_LENGTH + 12} centerZ={PATH_CENTER_Z}
        color="#003300" emissive="#fe06b6" emissiveIntensity={2.5} />
      <PathLayer y={0.03} xSize={2.5} zSize={PATH_LENGTH + 10} centerZ={PATH_CENTER_Z}
        color="#000000" />

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        {FRONT_DOORS.map(({ x, label, route }, i) => (
          <DoorPortal
            key={i}
            position={[x, 0, FAR_Z]}
            rotationY={0}
            label={label}
            isNear={nearDoor}
            onInteract={() => onNavigate(route)}
          />
        ))}

        <RevealedText position={[0, 3, PATH_CENTER_Z - 20]} isNear={true} />

        <DoorPortal
          position={[0, 0, BACK_Z -2.1]}
          rotationY={Math.PI}
          label="Lobby"
          isNear={nearDoor}
          onInteract={() => onNavigate('/lobby')}
        />
      </Suspense>
    </group>
  )
}

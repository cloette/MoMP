'use client'
import { useMemo, Suspense, useEffect } from 'react'
import { Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const FAR_Z = -18         // far end: four front doors / T crossbar
const BACK_Z = 20         // back end: one rear door
const PATH_CENTER_Z = 1   // midpoint of 20 + (−18)
const PATH_LENGTH = 38

// T crossbar runs left/right at FAR_Z connecting the four doors
const CROSSBAR_X_EXTENT = 22  // ±8 from center

const FRONT_DOORS: { x: number; label: string; route: string }[] = [
  { x:  -6, label: 'Art Hall',  route: '/art-hall'  },
  { x:  -2, label: 'Exhibits', route: '/room-a'    },
  { x: 2, label: 'Library',   route: '/library'   },
  { x: 6, label: 'Wish Room', route: '/wish-room' },
]

function SpaceBackdrop() {
  const texture = useTexture('/exhibitobjects/lobby/spacebgtaller.jpg')
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
    animation: 'revealText 4s ease-in-out 5s both',
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
        There is a secret room in this museum.
      </div>
      <div style={{ ...textStyle, color: '#ffffff', padding: '4px 2px 4px 12px', fontSize: '34px' }}>
        Can you find it?
      </div>
    </Html>
  )
}

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

interface LobbyProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function LobbyRoom({ nearDoor, onNavigate }: LobbyProps) {
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
      <PathLayer y={0.01} xSize={5}   zSize={PATH_LENGTH + 14} centerZ={PATH_CENTER_Z}
        color="#0022aa" emissive="#0044ff" emissiveIntensity={2} />
      <PathLayer y={0.02} xSize={3.5} zSize={PATH_LENGTH + 12} centerZ={PATH_CENTER_Z}
        color="#003300" emissive="#00cc44" emissiveIntensity={2.5} />
      <PathLayer y={0.03} xSize={2.5} zSize={PATH_LENGTH + 10} centerZ={PATH_CENTER_Z}
        color="#000000" />

      {/* ── PATH CROSSBAR (along X at far end — forms the T) ────── */}
      <PathLayer y={0.01} xSize={CROSSBAR_X_EXTENT}     zSize={10}   centerZ={FAR_Z-3}
        color="#0022aa" emissive="#0044ff" emissiveIntensity={2} />
      <PathLayer y={0.02} xSize={CROSSBAR_X_EXTENT - 2} zSize={9} centerZ={FAR_Z-3}
        color="#003300" emissive="#00cc44" emissiveIntensity={2.5} />
      <PathLayer y={0.03} xSize={CROSSBAR_X_EXTENT - 4} zSize={8} centerZ={FAR_Z-3}
        color="#000000" />

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        {/* Four front doors at FAR_Z, facing +Z toward the approaching camera */}
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

        <RevealedText position={[0, 2.5, PATH_CENTER_Z - 20]} isNear={true} />

        {/* Rear door behind starting point → exterior */}
        <DoorPortal
          position={[0, 0, BACK_Z -2.1]}
          rotationY={Math.PI}
          label=""
          isNear={nearDoor}
          onInteract={() => onNavigate('/exterior')}
        />
      </Suspense>
    </group>
  )
}

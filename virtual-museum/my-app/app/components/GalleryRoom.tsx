'use client'
import { Frame } from './Frame'
import { InfoPanel } from './InfoPanel'
import { Pedestal } from './Pedestal'
import { Door } from './Door'

// Room dimensions
const W = 12     // width  (x: -6 to +6)
const D = 14     // depth  (z: -7 to +7)
const H = 3.6    // height (y:  0 to 3.6)

interface GalleryRoomProps {
  doorLabel: string
  nearDoor: boolean
  onDoorInteract: () => void
  pedestalColor?: string
  pedestalEmissive?: string
  exhibitPrefix?: string
}

export function GalleryRoom({
  doorLabel,
  nearDoor,
  onDoorInteract,
  pedestalColor = '#9b59b6',
  pedestalEmissive = '#6c3483',
  exhibitPrefix = 'A',
}: GalleryRoomProps) {
  return (
    <group>
      {/* ── BACKGROUND ──────────────────────────────────────────── */}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#e6e0d8" roughness={0.9} />
      </mesh>
      {/* Baseboard strip on floor edge */}
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

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Back wall (door end, z = -D/2) */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f7f5f2" />
      </mesh>
      {/* Front wall (start end, z = D/2) */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f7f5f2" />
      </mesh>
      {/* Left wall (x = -W/2) */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f4f1ed" />
      </mesh>
      {/* Right wall (x = W/2) */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f4f1ed" />
      </mesh>

      {/* Ceiling trim rails (track lighting effect) */}
      <mesh position={[-2.5, H - 0.05, 0]}>
        <boxGeometry args={[0.06, 0.06, D - 0.5]} />
        <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[2.5, H - 0.05, 0]}>
        <boxGeometry args={[0.06, 0.06, D - 0.5]} />
        <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}

      <ambientLight intensity={0.65} />
      {/* Main overhead directional */}
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.55} color="#fffef8" />
      {/* Track spot lights aimed at left-wall frames */}
      <spotLight
        position={[-2.5, H - 0.15, -2.5]}
        target-position={[-6, 1.8, -2.5]}
        angle={0.45}
        penumbra={0.6}
        intensity={1.0}
        color="#fff9ee"
      />
      <spotLight
        position={[-2.5, H - 0.15, 2.5]}
        target-position={[-6, 1.8, 2.5]}
        angle={0.45}
        penumbra={0.6}
        intensity={1.0}
        color="#fff9ee"
      />
      {/* Track spot lights aimed at right-wall frames */}
      <spotLight
        position={[2.5, H - 0.15, -2.5]}
        target-position={[6, 1.8, -2.5]}
        angle={0.45}
        penumbra={0.6}
        intensity={1.0}
        color="#fff9ee"
      />
      <spotLight
        position={[2.5, H - 0.15, 2.5]}
        target-position={[6, 1.8, 2.5]}
        angle={0.45}
        penumbra={0.6}
        intensity={1.0}
        color="#fff9ee"
      />

      {/* ── IN-ROOM OBJECTS ─────────────────────────────────────── */}

      {/* Central pedestal */}
      <Pedestal color={pedestalColor} emissive={pedestalEmissive} />

      {/* Left wall — back frame + panel */}
      <Frame position={[-5.86, 1.85, -2.6]} rotation={[0, Math.PI / 2, 0]} />
      <InfoPanel
        position={[-5.83, 0.85, -2.6]}
        rotation={[0, Math.PI / 2, 0]}
        title={`Exhibit ${exhibitPrefix}1`}
      />

      {/* Left wall — front frame + panel */}
      <Frame position={[-5.86, 1.85, 2.6]} rotation={[0, Math.PI / 2, 0]} />
      <InfoPanel
        position={[-5.83, 0.85, 2.6]}
        rotation={[0, Math.PI / 2, 0]}
        title={`Exhibit ${exhibitPrefix}2`}
      />

      {/* Right wall — back frame + panel */}
      <Frame position={[5.86, 1.85, -2.6]} rotation={[0, -Math.PI / 2, 0]} />
      <InfoPanel
        position={[5.83, 0.85, -2.6]}
        rotation={[0, -Math.PI / 2, 0]}
        title={`Exhibit ${exhibitPrefix}3`}
      />

      {/* Right wall — front frame + panel */}
      <Frame position={[5.86, 1.85, 2.6]} rotation={[0, -Math.PI / 2, 0]} />
      <InfoPanel
        position={[5.83, 0.85, 2.6]}
        rotation={[0, -Math.PI / 2, 0]}
        title={`Exhibit ${exhibitPrefix}4`}
      />

      {/* Door in back wall */}
      <group position={[0, 0, -D / 2 + 0.06]}>
        <Door label={doorLabel} isNear={nearDoor} onInteract={onDoorInteract} />
      </group>
    </group>
  )
}

'use client'
import { ExhibitFrame } from '../components/ExhibitFrame'
import { InfoPanel } from '../components/InfoPanel'
import { Pedestal } from '../components/Pedestal'
import { Door } from '../components/Door'

const W = 12
const D = 14
const H = 3.6

interface GalleryRoomBProps {
  doorLabel: string
  nearDoor: boolean
  onDoorInteract: () => void
  pedestalColor?: string
  pedestalEmissive?: string
}

const EXHIBITS = {
  B1: {
    title: 'Exhibit B1',
    body: 'An image.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/exterior/backdropcropped.jpg',
      alt: 'Museum exterior backdrop',
    },
  },
  B2: {
    title: 'Exhibit B2',
    body: 'Sample local video file.',
    content: {
      type: 'video' as const,
      src: '/localvideosample.mp4',
    },
  },
  B3: {
    title: 'Exhibit B3',
    body: 'YouTube embed.',
    content: {
      type: 'youtube' as const,
      // Replace with any YouTube video ID, e.g. 'dQw4w9WgXcQ'
      youtubeId: 'MfVc_EONCXw',
      title: 'Exhibit B3 – YouTube',
    },
  },
  B4: {
    title: 'Exhibit B4',
    body: undefined,
    content: { type: 'placeholder' as const },
  },
}

export function GalleryRoomB({
  doorLabel,
  nearDoor,
  onDoorInteract,
  pedestalColor = '#2ecc71',
  pedestalEmissive = '#1a7a42',
}: GalleryRoomBProps) {
  return (
    <group>
      {/* ── BACKGROUND ──────────────────────────────────────────── */}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#e6e0d8" roughness={0.9} />
      </mesh>
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

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f7f5f2" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f7f5f2" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f4f1ed" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f4f1ed" />
      </mesh>

      {/* Ceiling trim rails */}
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
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.55} color="#fffef8" />
      <spotLight position={[-2.5, H - 0.15, -2.5]} target-position={[-6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[-2.5, H - 0.15,  2.5]} target-position={[-6, 1.8,  2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[ 2.5, H - 0.15, -2.5]} target-position={[ 6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[ 2.5, H - 0.15,  2.5]} target-position={[ 6, 1.8,  2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />

      {/* ── IN-ROOM OBJECTS ─────────────────────────────────────── */}

      <Pedestal color={pedestalColor} emissive={pedestalEmissive} />

      {/* Left wall — back (B2: video) */}
      <ExhibitFrame position={[-5.86, 1.85, -2.6]} rotation={[0, Math.PI / 2, 0]} content={EXHIBITS.B2.content} />
      <InfoPanel    position={[-5.83, 0.85, -2.6]} rotation={[0, Math.PI / 2, 0]} title={EXHIBITS.B2.title} body={EXHIBITS.B2.body} />

      {/* Left wall — front (B1: image) */}
      <ExhibitFrame position={[-5.86, 1.85, 2.6]} rotation={[0, Math.PI / 2, 0]} content={EXHIBITS.B1.content} />
      <InfoPanel    position={[-5.83, 0.85, 2.6]} rotation={[0, Math.PI / 2, 0]} title={EXHIBITS.B1.title} body={EXHIBITS.B1.body} />

      {/* Right wall — back (B3: youtube) */}
      <ExhibitFrame position={[5.86, 1.85, -2.6]} rotation={[0, -Math.PI / 2, 0]} content={EXHIBITS.B3.content} />
      <InfoPanel    position={[5.83, 0.85, -2.6]} rotation={[0, -Math.PI / 2, 0]} title={EXHIBITS.B3.title} body={EXHIBITS.B3.body} />

      {/* Right wall — front (B4: placeholder) */}
      <ExhibitFrame position={[5.86, 1.85, 2.6]} rotation={[0, -Math.PI / 2, 0]} content={EXHIBITS.B4.content} />
      <InfoPanel    position={[5.83, 0.85, 2.6]} rotation={[0, -Math.PI / 2, 0]} title={EXHIBITS.B4.title} body={EXHIBITS.B4.body} />

      {/* Door */}
      <group position={[0, 0, -D / 2 + 0.06]}>
        <Door label={doorLabel} isNear={nearDoor} onInteract={onDoorInteract} />
      </group>
    </group>
  )
}

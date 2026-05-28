'use client'
import { Canvas } from '@react-three/fiber'
import { GalleryRoom } from './GalleryRoom'
import { RailCamera } from './RailCamera'

// Rail: camera starts at z=5.5 (front), moves toward z=-4.5 (near door)
const RAIL_MAX = 5.5
const RAIL_MIN = -4.5
const DOOR_THRESHOLD = -3.2   // z position at which "near door" activates

interface RoomSceneProps {
  doorLabel: string
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onDoorInteract: () => void
  pedestalColor?: string
  pedestalEmissive?: string
  exhibitPrefix?: string
}

export default function RoomScene({
  doorLabel,
  nearDoor,
  onNearDoor,
  onDoorInteract,
  pedestalColor,
  pedestalEmissive,
  exhibitPrefix,
}: RoomSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, RAIL_MAX], fov: 68, near: 0.1, far: 50 }}
      style={{ width: '100%', height: '100%', background: '#f0ede8' }}
    >
      <GalleryRoom
        doorLabel={doorLabel}
        nearDoor={nearDoor}
        onDoorInteract={onDoorInteract}
        pedestalColor={pedestalColor}
        pedestalEmissive={pedestalEmissive}
        exhibitPrefix={exhibitPrefix}
      />
      <RailCamera
        railMin={RAIL_MIN}
        railMax={RAIL_MAX}
        startZ={RAIL_MAX}
        doorThreshold={DOOR_THRESHOLD}
        onNearDoor={onNearDoor}
      />
    </Canvas>
  )
}

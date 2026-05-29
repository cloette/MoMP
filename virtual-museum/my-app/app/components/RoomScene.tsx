'use client'
import { Canvas } from '@react-three/fiber'
import { GalleryRoom } from './GalleryRoom'
import { RailCamera } from './RailCamera'
import type { PauseZone } from './RailCamera'

// Path progress at which "near door" activates (must be past all 4 pause zones)
const DOOR_T_PARAM = 0.93

interface RoomSceneProps {
  doorLabel: string
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onDoorInteract: () => void
  pedestalColor?: string
  pedestalEmissive?: string
  exhibitPrefix?: string
  path: readonly [number, number][]
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export default function RoomScene({
  doorLabel,
  nearDoor,
  onNearDoor,
  onDoorInteract,
  pedestalColor,
  pedestalEmissive,
  exhibitPrefix,
  path,
  autoWalk,
  autoWalkPaused,
  zones,
  onEnterZone,
}: RoomSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [path[0][0], 1.6, path[0][1]], fov: 68, near: 0.1, far: 50 }}
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
        path={path}
        doorTParam={DOOR_T_PARAM}
        onNearDoor={onNearDoor}
        autoWalk={autoWalk}
        autoWalkPaused={autoWalkPaused}
        zones={zones}
        onEnterZone={onEnterZone}
      />
    </Canvas>
  )
}

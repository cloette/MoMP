'use client'
import { Canvas } from '@react-three/fiber'
import { LibraryRoom } from './LibraryRoom'
import { RailCamera } from '../components/RailCamera'
import type { PauseZone } from '../components/RailCamera'
import type { CategoryName } from './CategoryModal'

const DOOR_T_PARAM = 0.93

interface LibrarySceneProps {
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onDoorInteract: () => void
  onLobbyDoorInteract: () => void
  onChamberDoorInteract: () => void
  onOpenCategory: (cat: CategoryName) => void
  path: readonly [number, number][]
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export default function LibraryScene({
  nearDoor,
  onNearDoor,
  onDoorInteract,
  onLobbyDoorInteract,
  onChamberDoorInteract,
  onOpenCategory,
  path,
  autoWalk,
  autoWalkPaused,
  zones,
  onEnterZone,
}: LibrarySceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [path[0][0], 1.4, path[0][1]], fov: 68, near: 0.1, far: 50 }}
      style={{ width: '100%', height: '100%', background: '#1a0000' }}
    >
      <LibraryRoom
        nearDoor={nearDoor}
        onDoorInteract={onDoorInteract}
        onLobbyDoorInteract={onLobbyDoorInteract}
        onChamberDoorInteract={onChamberDoorInteract}
        onOpenCategory={onOpenCategory}
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

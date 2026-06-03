'use client'
import { Canvas } from '@react-three/fiber'
import { WishRoomGeometry } from './WishRoomGeometry'
import { RailCamera } from '../components/RailCamera'

// nearDoor triggers at 92% along the path (close to exterior door)
const DOOR_T_PARAM = 0.92

interface WishRoomSceneProps {
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onDoorInteract: () => void
  onLobbyDoorInteract: () => void
  path: readonly [number, number][]
  autoWalk?: boolean
  onOpenDressUp: () => void
  onOpenStarStation: () => void
}

export default function WishRoomScene({
  nearDoor,
  onNearDoor,
  onDoorInteract,
  onLobbyDoorInteract,
  path,
  autoWalk,
  onOpenDressUp,
  onOpenStarStation,
}: WishRoomSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 6], fov: 68, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
    >
      <WishRoomGeometry
        nearDoor={nearDoor}
        onDoorInteract={onDoorInteract}
        lobbyDoorInteract={onLobbyDoorInteract}
        onOpenDressUp={onOpenDressUp}
        onOpenStarStation={onOpenStarStation}
      />
      <RailCamera
        path={path}
        startT={0}
        doorTParam={DOOR_T_PARAM}
        onNearDoor={onNearDoor}
        autoWalk={autoWalk}
      />
    </Canvas>
  )
}

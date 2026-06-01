'use client'
import { Canvas } from '@react-three/fiber'
import { LobbyRoom } from './LobbyRoom'
import { RailCamera } from '../components/RailCamera'
import type { PauseZone } from '../components/RailCamera'

const DOOR_T_PARAM = 0.93

interface LobbySceneProps {
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onDoorInteract: () => void
  startT?: number
  path: readonly [number, number][]
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export default function LobbyScene({
  nearDoor,
  onNearDoor,
  onDoorInteract,
  path,
  autoWalk,
  autoWalkPaused,
  zones,
  onEnterZone,
}: LobbySceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [path[0][0], 1.4, path[0][1]], fov: 68, near: 0.1, far: 50 }}
      style={{ width: '100%', height: '100%', background: '#f0ede8' }}
    >
      <LobbyRoom
        nearDoor={nearDoor}
        onDoorInteract={onDoorInteract}
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

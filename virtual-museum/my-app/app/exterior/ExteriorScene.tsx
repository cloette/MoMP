'use client'
import { Canvas } from '@react-three/fiber'
import { ExteriorRoom } from './ExteriorRoom'
import { RailCamera } from '../components/RailCamera'
import type { PauseZone } from '../components/RailCamera'

interface ExteriorSceneProps {
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onDoorInteract: () => void
  path: readonly [number, number][]
  startT?: number
  doorTParam?: number
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export default function ExteriorScene({
  nearDoor, onNearDoor, onDoorInteract,
  path, startT = 0, doorTParam = 0.82,
  autoWalk, autoWalkPaused,
  zones, onEnterZone,
}: ExteriorSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 0], fov: 68, near: 0.1, far: 1000 }}
      style={{ width: '100%', height: '100%', background: '#b8e4f8' }}
    >
      <ExteriorRoom
        nearDoor={nearDoor}
        onDoorInteract={onDoorInteract}
      />
      <RailCamera
        path={path}
        doorTParam={doorTParam}
        onNearDoor={onNearDoor}
        startT={startT}
        autoWalk={autoWalk}
        autoWalkPaused={autoWalkPaused}
        zones={zones}
        onEnterZone={onEnterZone}
      />
    </Canvas>
  )
}

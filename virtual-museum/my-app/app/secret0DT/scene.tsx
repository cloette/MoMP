'use client'
import { Canvas } from '@react-three/fiber'
import { Room } from './room'
import { RailCameraWithHeightControl } from '../components/RailCameraWithHeightControl'
import type { PauseZone } from '../components/RailCamera'

const DOOR_T_PARAM = 35 / 38

interface SceneProps {
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onNavigate: (route: string) => void
  startT?: number
  path: readonly [number, number, number][]
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export default function Scene({
  nearDoor,
  onNearDoor,
  onNavigate,
  path,
  startT = 0,
  autoWalk,
  autoWalkPaused,
  zones,
  onEnterZone,
}: SceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 0], fov: 68, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: '#000000' }}
    >
      <Room
        nearDoor={nearDoor}
        onNavigate={onNavigate}
      />
      <RailCameraWithHeightControl
        path={path}
        startT={startT}
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

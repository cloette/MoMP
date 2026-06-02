'use client'
import { Canvas } from '@react-three/fiber'
import { ArtHallRoom } from './ArtHallRoom'
import { RailCamera } from '../components/RailCamera'
import type { PauseZone } from '../components/RailCamera'

// 3 units before the front doors at z=-18: dist=35 of 38 total
const DOOR_T_PARAM = 35 / 38

interface ArtHallSceneProps {
  nearDoor: boolean
  onNearDoor: (near: boolean) => void
  onNavigate: (route: string) => void
  startT?: number
  path: readonly [number, number][]
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export default function ArtHallScene({
  nearDoor,
  onNearDoor,
  onNavigate,
  path,
  startT = 0,
  autoWalk,
  autoWalkPaused,
  zones,
  onEnterZone,
}: ArtHallSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 0], fov: 68, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: '#000000' }}
    >
      <ArtHallRoom
        nearDoor={nearDoor}
        onNavigate={onNavigate}
      />
      <RailCamera
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

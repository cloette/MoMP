'use client'
import { Canvas } from '@react-three/fiber'
import { ChamberRoom } from './ChamberRoom'
import { RailCamera } from '../components/RailCamera'

// Near-door trigger: last 10% of path (approaching the screen wall)
const DOOR_T_PARAM = 0.9

interface ChamberSceneProps {
  onNearDoor: (near: boolean) => void
  onLobby: () => void
  onBack: () => void
  path: readonly [number, number][]
  autoWalk?: boolean
}

export default function ChamberScene({
  onNearDoor, onLobby, onBack, path, autoWalk,
}: ChamberSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 5], fov: 68, near: 0.1, far: 100 }}
      style={{ width: '100%', height: '100%', background: '#070e1f' }}
    >
      <ChamberRoom onLobby={onLobby} onBack={onBack} />
      <RailCamera
        path={path}
        doorTParam={DOOR_T_PARAM}
        onNearDoor={onNearDoor}
        autoWalk={autoWalk}
      />
    </Canvas>
  )
}

'use client'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControlKeys } from './ControlsContext'

const MOVE_SPEED = 3.5
const PAN_SPEED = 1.8
const MAX_PAN = Math.PI / 3   // 60 degrees

interface RailCameraProps {
  railMin: number
  railMax: number
  startZ: number
  doorThreshold: number
  onNearDoor: (near: boolean) => void
}

export function RailCamera({ railMin, railMax, startZ, doorThreshold, onNearDoor }: RailCameraProps) {
  const { camera } = useThree()
  const keys = useControlKeys()
  const railZ = useRef(startZ)
  const panAngle = useRef(0)
  const wasNear = useRef(false)

  useEffect(() => {
    camera.position.set(0, 1.6, startZ)
    camera.lookAt(0, 1.6, startZ - 10)
  }, [camera, startZ])

  useFrame((_, delta) => {
    const k = keys.current

    if (k.has('ArrowUp') || k.has('w') || k.has('W')) {
      railZ.current = Math.max(railMin, railZ.current - MOVE_SPEED * delta)
    }
    if (k.has('ArrowDown') || k.has('s') || k.has('S')) {
      railZ.current = Math.min(railMax, railZ.current + MOVE_SPEED * delta)
    }
    if (k.has(',')) {
      panAngle.current = Math.max(-MAX_PAN, panAngle.current - PAN_SPEED * delta)
    }
    if (k.has('.')) {
      panAngle.current = Math.min(MAX_PAN, panAngle.current + PAN_SPEED * delta)
    }

    camera.position.z = railZ.current
    camera.position.y = 1.6

    const lx = Math.sin(panAngle.current)
    const lz = -Math.cos(panAngle.current)
    camera.lookAt(
      camera.position.x + lx,
      camera.position.y,
      camera.position.z + lz,
    )

    const isNear = railZ.current <= doorThreshold
    if (isNear !== wasNear.current) {
      wasNear.current = isNear
      onNearDoor(isNear)
    }
  })

  return null
}

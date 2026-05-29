'use client'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControlKeys } from './ControlsContext'

const MOVE_SPEED = 3.5       // units/sec, manual
const AUTO_WALK_SPEED = 1.2  // units/sec, auto-walk
const PAN_SPEED = 1.8
const MAX_PAN = Math.PI  // max left/right pan angle in radians, originally Math.PI / 3
const LOOK_AHEAD = 2.0       // units ahead on path for camera look direction

export interface PauseZone {
  t: number        // 0–1 path progress at which zone triggers
  audioSrc: string
}

interface PathData {
  totalLength: number
  segLengths: number[]
  cumLengths: number[]  // cumulative length at the START of each segment
}

function buildPathData(path: readonly [number, number][]): PathData {
  const segLengths: number[] = []
  const cumLengths: number[] = [0]
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1][0] - path[i][0]
    const dz = path[i + 1][1] - path[i][1]
    const len = Math.sqrt(dx * dx + dz * dz)
    segLengths.push(len)
    cumLengths.push(cumLengths[i] + len)
  }
  return { totalLength: cumLengths[cumLengths.length - 1], segLengths, cumLengths }
}

function posAtDist(
  dist: number,
  path: readonly [number, number][],
  pd: PathData,
): { x: number; z: number } {
  if (dist <= 0) return { x: path[0][0], z: path[0][1] }
  if (dist >= pd.totalLength) {
    const last = path[path.length - 1]
    return { x: last[0], z: last[1] }
  }
  for (let i = 0; i < pd.segLengths.length; i++) {
    if (dist < pd.cumLengths[i + 1]) {
      const localT = (dist - pd.cumLengths[i]) / pd.segLengths[i]
      return {
        x: path[i][0] + (path[i + 1][0] - path[i][0]) * localT,
        z: path[i][1] + (path[i + 1][1] - path[i][1]) * localT,
      }
    }
  }
  const last = path[path.length - 1]
  return { x: last[0], z: last[1] }
}

interface RailCameraProps {
  path: readonly [number, number][]
  doorTParam: number
  onNearDoor: (near: boolean) => void
  autoWalk?: boolean
  autoWalkPaused?: boolean
  zones?: PauseZone[]
  onEnterZone?: (index: number) => void
}

export function RailCamera({
  path, doorTParam, onNearDoor,
  autoWalk = false, autoWalkPaused = false,
  zones, onEnterZone,
}: RailCameraProps) {
  const { camera } = useThree()
  const keys = useControlKeys()
  const pathT = useRef(0)
  const pd = useRef(buildPathData(path))
  const panAngle = useRef(0)
  const wasNear = useRef(false)
  const autoWalkRef = useRef(autoWalk)
  const autoWalkPausedRef = useRef(autoWalkPaused)
  const onEnterZoneRef = useRef(onEnterZone)
  const zoneTriggered = useRef<boolean[]>((zones ?? []).map(() => false))

  useEffect(() => { autoWalkRef.current = autoWalk }, [autoWalk])
  useEffect(() => { autoWalkPausedRef.current = autoWalkPaused }, [autoWalkPaused])
  useEffect(() => { onEnterZoneRef.current = onEnterZone }, [onEnterZone])

  useEffect(() => {
    const start = path[0]
    camera.position.set(start[0], 1.6, start[1])
    const next = path.length > 1 ? path[1] : [start[0], start[1] - 1] as [number, number]
    camera.lookAt(next[0], 1.6, next[1])
  }, [camera, path])

  useFrame((_, delta) => {
    const k = keys.current
    const totalLen = pd.current.totalLength
    const hasMovementKey =
      k.has('ArrowUp') || k.has('w') || k.has('W') ||
      k.has('ArrowDown') || k.has('s') || k.has('S')

    if (k.has('ArrowUp') || k.has('w') || k.has('W')) {
      pathT.current = Math.min(1, pathT.current + MOVE_SPEED * delta / totalLen)
    }
    if (k.has('ArrowDown') || k.has('s') || k.has('S')) {
      pathT.current = Math.max(0, pathT.current - MOVE_SPEED * delta / totalLen)
    }
    if (!hasMovementKey && autoWalkRef.current && !autoWalkPausedRef.current) {
      pathT.current = Math.min(1, pathT.current + AUTO_WALK_SPEED * delta / totalLen)
    }

    if (k.has(',')) panAngle.current = Math.max(-MAX_PAN, panAngle.current - PAN_SPEED * delta)
    if (k.has('.')) panAngle.current = Math.min(MAX_PAN, panAngle.current + PAN_SPEED * delta)

    const dist = pathT.current * totalLen
    const pos = posAtDist(dist, path, pd.current)
    const ahead = posAtDist(dist + LOOK_AHEAD, path, pd.current)

    camera.position.x = pos.x
    camera.position.y = 1.6
    camera.position.z = pos.z

    const fdx = ahead.x - pos.x
    const fdz = ahead.z - pos.z
    const flen = Math.sqrt(fdx * fdx + fdz * fdz)

    if (flen > 0.001) {
      const fx = fdx / flen
      const fz = fdz / flen
      const pan = panAngle.current
      // rotate forward vector by pan around Y axis
      const lx = fx * Math.cos(pan) - fz * Math.sin(pan)
      const lz = fx * Math.sin(pan) + fz * Math.cos(pan)
      camera.lookAt(pos.x + lx, 1.6, pos.z + lz)
    }

    // Door detection
    const isNear = pathT.current >= doorTParam
    if (isNear !== wasNear.current) {
      wasNear.current = isNear
      onNearDoor(isNear)
    }

    // Pause zone detection: triggers on forward entry, resets on backward retreat
    if (zones && onEnterZoneRef.current) {
      for (let i = 0; i < zones.length; i++) {
        if (!zoneTriggered.current[i] && pathT.current >= zones[i].t) {
          zoneTriggered.current[i] = true
          onEnterZoneRef.current(i)
        } else if (zoneTriggered.current[i] && pathT.current < zones[i].t - 0.03) {
          zoneTriggered.current[i] = false
        }
      }
    }
  })

  return null
}

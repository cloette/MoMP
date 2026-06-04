'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

interface StarCandyProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  size?: number
}

function createStarShape(outerR: number, innerR: number, points: number) {
  const shape = new THREE.Shape()
  const step = (Math.PI * 2) / points
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const a = (i * step) / 2
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  shape.closePath()
  return shape
}

export function StarCandy({ position, rotation = [0, 0, 0], color, size = 0.022 }: StarCandyProps) {
  const geometry = useMemo(() => {
    const shape = createStarShape(size, size * 0.45, 5)
    return new THREE.ExtrudeGeometry(shape, {
      depth: size * 0.4,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: size * 0.08,
      bevelThickness: size * 0.08,
    })
  }, [size])

  return (
    <mesh position={position} rotation={rotation} geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

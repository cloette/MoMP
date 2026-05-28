'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

interface PedestalProps {
  color?: string
  emissive?: string
}

export function Pedestal({ color = '#9b59b6', emissive = '#6c3483' }: PedestalProps) {
  const cubeRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.6
      cubeRef.current.rotation.x += delta * 0.25
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* ── IN-ROOM OBJECTS ── pedestal base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.38, 0.5, 1.0, 12]} />
        <meshStandardMaterial color="#ccc8c2" roughness={0.45} metalness={0.1} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.01, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 12]} />
        <meshStandardMaterial color="#b8b4ae" roughness={0.3} />
      </mesh>
      {/* Glowing rotating cube */}
      <mesh ref={cubeRef} position={[0, 1.35, 0]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.25}
        />
      </mesh>
      {/* Glow light from cube */}
      <pointLight position={[0, 1.35, 0]} intensity={1.2} color={color} distance={6} decay={2} />
    </group>
  )
}

'use client'
import React from 'react'
import { Html } from "@react-three/drei"

export function CategoryPlaque({
  label,
  width,
  position,
  rotation,
  color
}: {
  label: string
  width: number
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer wooden frame */}
      <mesh>
        <boxGeometry args={[2.6+width, 0.55, 0.07]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Parchment inner panel */}
      <mesh position={[0, 0, 0.036]}>
        <boxGeometry args={[2.38+width, 0.38, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Text label */}
      <Html position={[0, 0, 0.09]} transform center>
        <div style={{
          fontSize: '9px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'bold',
          color: '#000000',
          whiteSpace: 'nowrap',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {label}
        </div>
      </Html>
    </group>
  )
}
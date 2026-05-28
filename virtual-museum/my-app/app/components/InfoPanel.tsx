'use client'
import { Html } from '@react-three/drei'

interface InfoPanelProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  title: string
  body?: string
}

export function InfoPanel({ position, rotation = [0, 0, 0], title, body }: InfoPanelProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Backing plate */}
      <mesh>
        <boxGeometry args={[1.55, 0.75, 0.015]} />
        <meshStandardMaterial color="#f2ede4" roughness={0.8} />
      </mesh>
      <Html center distanceFactor={6}>
        <div
          style={{
            width: '210px',
            padding: '10px 14px',
            fontFamily: 'Georgia, serif',
            textAlign: 'left',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '5px',
              color: '#2a2a2a',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
            {body ?? 'Placeholder exhibit description. Content coming soon.'}
          </div>
        </div>
      </Html>
    </group>
  )
}

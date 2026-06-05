'use client'
import { Html } from '@react-three/drei'

interface DoorProps {
  onInteract: () => void
  label?: string
}

export function InvisibleDoor({ onInteract, label }: DoorProps) {
  return (
    <group>
      {/* Room label sign above door */}
      {label && (
        <Html position={[0, 2.75, 0.12]} transform occlude center>
          <div
            style={{
              background: 'rgba(90, 62, 20, 0.92)',
              color: '#f5e6c0',
              padding: '3px 8px',
              fontFamily: 'Georgia, serif',
              fontSize: '8px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              letterSpacing: '0.05em',
              zIndex: 2,
            }}
          >
            {label}
          </div>
        </Html>
      )}

      {/* Invisible click target covering the door */}
      <mesh
        position={[0, 1.2, 0.2]}
        onClick={onInteract}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={[1.3, 2.5, 0.05]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

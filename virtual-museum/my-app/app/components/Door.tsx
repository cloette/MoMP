'use client'
import { Html } from '@react-three/drei'

interface DoorProps {
  label: string
  isNear: boolean
  onInteract: () => void
}

export function Door({ label, isNear, onInteract }: DoorProps) {
  return (
    // ── IN-ROOM OBJECTS ── door (positioned by parent group)
    <group>
      {/* Door frame surround */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.3, 2.5, 0.1]} />
        <meshStandardMaterial color="#8b6914" roughness={0.6} />
      </mesh>
      {/* Door surface */}
      <mesh position={[0, 1.2, 0.06]}>
        <boxGeometry args={[1.1, 2.3, 0.06]} />
        <meshStandardMaterial color="#a0793a" roughness={0.5} />
      </mesh>
      {/* Door panel detail top */}
      <mesh position={[0, 1.7, 0.1]}>
        <boxGeometry args={[0.88, 0.8, 0.03]} />
        <meshStandardMaterial color="#8f6c2e" roughness={0.6} />
      </mesh>
      {/* Door panel detail bottom */}
      <mesh position={[0, 0.7, 0.1]}>
        <boxGeometry args={[0.88, 0.8, 0.03]} />
        <meshStandardMaterial color="#8f6c2e" roughness={0.6} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.38, 1.2, 0.14]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* ── INTERACTIVE FEATURES ── */}
      {/* Room label sign above door */}
      <Html position={[0, 2.75, 0.12]} center>
        <div
          style={{
            background: 'rgba(90, 62, 20, 0.92)',
            color: '#f5e6c0',
            padding: '4px 14px',
            fontFamily: 'Georgia, serif',
            fontSize: '13px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      </Html>

      {/* Interact hint when near */}
      {isNear && (
        <Html position={[0, -0.25, 0.18]} center>
          <div
            style={{
              background: 'rgba(0,0,0,0.72)',
              color: '#fff',
              padding: '5px 12px',
              fontSize: '12px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              fontFamily: 'sans-serif',
            }}
          >
            Click door or press <kbd style={{ background: '#444', padding: '1px 5px', borderRadius: '3px' }}>Space</kbd>
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

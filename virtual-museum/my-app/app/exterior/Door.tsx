'use client'
import { useMemo } from 'react'
import { Html, useGLTF } from '@react-three/drei'

interface DoorProps {
  isNear: boolean
  onInteract: () => void
}

useGLTF.preload('/exhibitobjects/exterior/door.glb')

export function Door({ isNear, onInteract }: DoorProps) {
  const { scene } = useGLTF('/exhibitobjects/exterior/door.glb')
  const customDoor = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[.5,.5,2.6]} rotation={[0, 7.9, 0]}>
        <primitive object={customDoor} scale={.055} rotateZ={90} />
      </group>

      {/* Interact hint when near */}
      {isNear && (
        <Html position={[0, -0.25, 0.18]} center >
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

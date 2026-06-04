'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/wishroom/dressing_matrimonial.glb')

export function DressingShelf() {
  const { scene } = useGLTF('/exhibitobjects/wishroom/dressing_matrimonial.glb')
  const dressing = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, -1, 0]}>
        <primitive object={dressing} scale={.045} />
      </group>
    </group>
  )
}

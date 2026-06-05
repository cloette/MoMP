'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/wishroom/stand_mirror.glb')

export function Mirror() {
  const { scene } = useGLTF('/exhibitobjects/wishroom/stand_mirror.glb')
  const mirror = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 1, 0]}>
        <primitive object={mirror} scale={.2} />
      </group>
    </group>
  )
}

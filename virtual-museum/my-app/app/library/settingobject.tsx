'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/library/library.glb')

export function Setting() {
  const { scene } = useGLTF('/exhibitobjects/library/library.glb')
  const library = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[1.8, -6, 0]} rotation={[0, 0, 0]}>
        <primitive object={library} scale={3} />
      </group>
    </group>
  )
}

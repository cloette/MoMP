'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/library/bookcase.glb')

export function Bookcase() {
  const { scene } = useGLTF('/exhibitobjects/library/bookcase.glb')
  const bookcase = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <primitive object={bookcase} scale={.7} />
      </group>
    </group>
  )
}

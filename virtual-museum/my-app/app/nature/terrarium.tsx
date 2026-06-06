'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/nature/terrarium_basil_rosemary_and_coriander.glb')

export function Terrarium() {
  const { scene } = useGLTF('/exhibitobjects/nature/terrarium_basil_rosemary_and_coriander.glb')
  const dressing = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, -2, 0]}>
        <primitive object={dressing} scale={3} />
      </group>
    </group>
  )
}

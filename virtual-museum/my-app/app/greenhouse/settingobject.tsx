'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/nature/greenhouse_park_fbx_free.gl')

export function Setting() {
  const { scene } = useGLTF('/exhibitobjects/nature/greenhouse_park_fbx_free.glb')
  const greenhouse = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, -.2, 18]}>
        <primitive object={greenhouse} scale={1.2} />
      </group>
    </group>
  )
}

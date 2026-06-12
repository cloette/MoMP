'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/technology/sci-fi_lab.glb')

export function Setting() {
  const { scene } = useGLTF('/exhibitobjects/technology/sci-fi_lab.glb')
  const greenhouse = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, -.2, 0]}>
        <primitive object={greenhouse} scale={1.2} />
      </group>
    </group>
  )
}

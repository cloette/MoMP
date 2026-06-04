'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/wishroom/paper_stack.glb')

export function Paper() {
  const { scene } = useGLTF('/exhibitobjects/wishroom/paper_stack.glb')
  const paper = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[.9, 0.05, 0]} rotateOnAxis={[0, 360, 0]}>
        <primitive object={paper} scale={.01} />
      </group>
    </group>
  )
}

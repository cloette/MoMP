'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/occupational/curtain.glb')

export function Curtain() {
  const { scene } = useGLTF('/exhibitobjects/occupational/curtain.glb')
  const curtain = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 0, 0]}>
        <primitive object={curtain} scale={2.4} />
      </group>
    </group>
  )
}

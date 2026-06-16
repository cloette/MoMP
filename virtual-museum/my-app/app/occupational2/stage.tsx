'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/occupational/retro_style_stage.glb')

export function Stage() {
  const { scene } = useGLTF('/exhibitobjects/occupational/retro_style_stage.glb')
  const stage = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 0, 0]}>
        <primitive object={stage} scale={1} />
      </group>
    </group>
  )
}

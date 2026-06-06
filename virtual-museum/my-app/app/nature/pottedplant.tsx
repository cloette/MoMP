'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/nature/potted_plant___poly_foliage_game_ready.glb')

export function PottedPlant() {
  const { scene } = useGLTF('/exhibitobjects/nature/potted_plant___poly_foliage_game_ready.glb')
  const dressing = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 0, 5]}>
        <primitive object={dressing} scale={1} />
      </group>
    </group>
  )
}

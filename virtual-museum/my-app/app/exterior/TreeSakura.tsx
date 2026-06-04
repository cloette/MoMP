'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/exterior/sakura_tree_01_-_low_poly_model.glb')

export function TreePink() {
  const { scene } = useGLTF('/exhibitobjects/exterior/sakura_tree_01_-_low_poly_model.glb')
  const tree = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive object={tree} scale={26} />
  )
}

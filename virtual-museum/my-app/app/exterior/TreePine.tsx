'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/exterior/pine_tree_game-ready.glb')

export function TreeGreen() {
  const { scene } = useGLTF('exhibitobjects/exterior/pine_tree_game-ready.glb')
  const tree = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive object={tree} scale={.2} />
  )
}

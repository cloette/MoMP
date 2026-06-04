'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/exterior/realistic_hd_blue_jacaranda_940.glb')

export function TreePurple() {
  const { scene } = useGLTF('/exhibitobjects/exterior/realistic_hd_blue_jacaranda_940.glb')
  const tree = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive object={tree} scale={1.9} />
  )
}

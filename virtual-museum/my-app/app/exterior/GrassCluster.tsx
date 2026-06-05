'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/exhibitobjects/exterior/grass_claster__downoad__like_please.glb')

export function GrassCluster() {
  const { scene } = useGLTF('/exhibitobjects/exterior/grass_claster__downoad__like_please.glb')
  const grass = useMemo(() => {
    const clone = scene.clone(true)
    return clone
  }, [scene])
  return (
    <group position={[-75, 0, 0]}>
      <primitive object={grass} scale={2} />
  </group>
  )
}

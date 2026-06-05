'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/exterior/cave.glb')

export function Cave() {
  const { scene } = useGLTF('/exhibitobjects/exterior/cave.glb')
  const cave = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 0, 64]} rotation={[0, 3.4, 0]}>
        <primitive object={cave} scale={28} />
      </group>
    </group>
  )
}

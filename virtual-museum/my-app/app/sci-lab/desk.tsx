'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('exhibitobjects/technology/scifi_desk.glb')

export function Desk() {
  const { scene } = useGLTF('/exhibitobjects/technology/scifi_desk.glb')
  const desk = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 3, 0]} rotation={[0, 0, 0]}>
        <primitive object={desk} scale={1.5} />
      </group>
    </group>
  )
}

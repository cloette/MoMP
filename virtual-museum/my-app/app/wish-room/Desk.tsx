'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Paper } from './Paper'

useGLTF.preload('/exhibitobjects/wishroom/computer_desk.glb')

export function DeskWithPaper() {
  const { scene } = useGLTF('/exhibitobjects/wishroom/computer_desk.glb')
  const desk = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 1.2, 0]}>
        <primitive object={desk} scale={.6} />
        <Paper />
      </group>
    </group>
  )
}

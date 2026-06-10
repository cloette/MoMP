'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/exhibitobjects/other/abm_-_cc0_asset_pack.glb')

export function Setting() {
  const { scene } = useGLTF('/exhibitobjects/other/abm_-_cc0_asset_pack.glb')
  const park = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, -2, -90]}>
        <primitive object={park} scale={1.2} />
      </group>
    </group>
  )
}

'use client'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { StarCandy } from './star'

useGLTF.preload('/exhibitobjects/wishroom/glass_jar_with_wooden_cover.glb')

const CANDY_COLORS = ['#ffee44', '#ff88cc', '#88ee55', '#88ccff', '#cc99ff']

// Deterministic pseudo-random from seed
function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// 20 stars scattered in the jar's bottom third (inner radius ~0.12, y: 0.02–0.14)
const STARS = Array.from({ length: 20 }, (_, i) => {
  const r = sr(i * 3) * .85
  const angle = sr(i * 3 + 1) * Math.PI * 2
  const y = 0 - 0.8 + sr(i * 3 + 20) * .9
  return {
    position: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
    rotation: [
      sr(i * 5) * Math.PI,
      sr(i * 5 + 1) * Math.PI * 2,
      sr(i * 5 + 2) * Math.PI,
    ] as [number, number, number],
    color: CANDY_COLORS[i % CANDY_COLORS.length],
  }
})

export function GlassJar() {
  const { scene } = useGLTF('/exhibitobjects/wishroom/glass_jar_with_wooden_cover.glb')
  const jar = useMemo(() => scene.clone(true), [scene])

  return (
    <group>
      <group position={[0, 1.2, 0]}>
        <primitive object={jar} scale={1} />
        {STARS.map((s, i) => (
          <StarCandy key={i} position={s.position} rotation={s.rotation} color={s.color} size={.3} />
        ))}
      </group>
    </group>
  )
}

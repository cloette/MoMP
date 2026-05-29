'use client'

interface FrameProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
}

export function Frame({ position, rotation = [0, 0, 0], width = 1.4, height = 1.05 }: FrameProps) {
  const fw = 0.09   // frame border width
  const fd = 0.05   // frame depth

  return (
    <group position={position} rotation={rotation}>
      {/* Canvas mat */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[width, height, 0.01]} />
        <meshStandardMaterial color="#f9f5ef" />
      </mesh>
      {/* Top bar */}
      <mesh position={[0, height / 2 + fw / 2, 0]}>
        <boxGeometry args={[width + fw * 2, fw, fd]} />
        <meshStandardMaterial color="#5c3d1b" roughness={0.5} />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -(height / 2 + fw / 2), 0]}>
        <boxGeometry args={[width + fw * 2, fw, fd]} />
        <meshStandardMaterial color="#5c3d1b" roughness={0.5} />
      </mesh>
      {/* Left bar */}
      <mesh position={[-(width / 2 + fw / 2), 0, 0]}>
        <boxGeometry args={[fw, height, fd]} />
        <meshStandardMaterial color="#5c3d1b" roughness={0.5} />
      </mesh>
      {/* Right bar */}
      <mesh position={[width / 2 + fw / 2, 0, 0]}>
        <boxGeometry args={[fw, height, fd]} />
        <meshStandardMaterial color="#5c3d1b" roughness={0.5} />
      </mesh>
    </group>
  )
}

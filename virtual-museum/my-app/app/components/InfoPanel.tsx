'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

interface InfoPanelProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  title: string
  body?: string
  color?: string
}

export function InfoPanel({ position, rotation = [0, 0, 0], title, body, color = '#f5ffbc' }: InfoPanelProps) {
  const texture = useMemo(() => {
          const canvas = document.createElement('canvas')
          canvas.width = 640
          canvas.height = 980
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 640, 980)
          ctx.textBaseline = 'top'
  
          ctx.font = 'bold 40px "Times New Roman", serif'
          ctx.fillStyle = '#000000'
          const addLineBreaks = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, x: number, y: number) => {
            const words = text.split(' ')
            let line = ''
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' '
              const metrics = ctx.measureText(testLine)
              const testWidth = metrics.width
              if (testWidth > maxWidth && line !== '') {
                ctx.fillText(line, x, y)
                line = words[n] + ' '
                y += 38
              } else {
                line = testLine
              }
            }
            ctx.fillText(line, x, y)
          }
          addLineBreaks(ctx, title, 600, 20, 20)
  
          ctx.font = '22px Arial, sans-serif'
          ctx.fillStyle = '#171717'
          addLineBreaks(ctx, body ?? 'Placeholder description. Content coming soon.', 600, 20, 180)
  
          return new THREE.CanvasTexture(canvas)
      }, [title, body, color])

  return (
    <group position={position} rotation={rotation}>
      {/* Backing plate */}
      <mesh>
        <boxGeometry args={[3.4, 4.6, 0.015]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <group position={[0, 0, 0.01]}>
            <mesh>
                <planeGeometry args={[3.2, 4.4]} />
                <meshBasicMaterial map={texture} transparent />
            </mesh>
        </group>
    </group>
  )
}

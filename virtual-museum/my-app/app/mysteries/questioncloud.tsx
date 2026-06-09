'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

// Sits on the left wall (world x = -8), facing +x into the room.
export function QuestionCloud() {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 480
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, 640, 480)
        ctx.textBaseline = 'top'

        ctx.font = '40px "Times New Roman", serif'
        ctx.fillStyle = '#777777'
        const lines = [
            'Why? Always? When? Where? How?',
            'What area? What else? With what?',
            'Which ones? Says who? Since when?',
            'Or what? How so?',
        ]
        lines.forEach((line, i) => ctx.fillText(line, 20, 20 + i * 58))

        ctx.font = 'bold 52px Arial, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Stay curious.', 180, 300)

        return new THREE.CanvasTexture(canvas)
    }, [])

    return (
        <group position={[-7.97, 2.5, -5]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
                <planeGeometry args={[3.2, 2.4]} />
                <meshBasicMaterial map={texture} transparent />
            </mesh>
        </group>
    )
}

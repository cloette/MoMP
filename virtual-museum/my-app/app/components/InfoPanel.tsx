'use client'
import { Html } from '@react-three/drei'
import { useLanguage } from '../contexts/LanguageContext'

interface InfoPanelProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  title: string
  body?: string
}

export function InfoPanel({ position, rotation = [0, 0, 0], title, body }: InfoPanelProps) {
  const { t } = useLanguage()
  return (
    <group position={position} rotation={rotation}>
      {/* Backing plate */}
      <mesh>
        <boxGeometry args={[1.55, 0.75, 0.015]} />
        <meshStandardMaterial color="#f5ffbc" roughness={0.8} />
      </mesh>
      <Html center transform occlude distanceFactor={6}>
        <div
          style={{
            width: '210px',
            padding: '10px 14px',
            fontFamily: 'Georgia, serif',
            textAlign: 'left',
            pointerEvents: 'none',
            userSelect: 'none',
            maxWidth: '120px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              marginBottom: '5px',
              color: '#2a2a2a',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '8px', color: '#555', lineHeight: 1.5 }}>
            {body ?? t('infoPanel.placeholder')}
          </div>
        </div>
      </Html>
    </group>
  )
}

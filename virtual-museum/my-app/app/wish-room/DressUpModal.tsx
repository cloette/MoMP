'use client'
import { useState, useRef, useCallback, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useTexture } from '@react-three/drei'

// ── Data ──────────────────────────────────────────────────────────────────────

const ANIMALS = [
  { id: 'turtle',   name: 'Turtle',   color: '#015e04', headColor: '#3aa325' },
  { id: 'rabbit',  name: 'Rabbit',  color: '#edcae8', headColor: '#ddd8cc' },
  { id: 'whale',     name: 'Whale',     color: '#15bed8', headColor: '#4ab1e8' },
  { id: 'snake',    name: 'Snake',    color: '#008802', headColor: '#25f941' },
]

interface Acc {
  id: string
  name: string
  emoji: string
  color: string
  offset: [number, number, number]
  size: [number, number, number]
}

const ACCESSORIES: Acc[] = [
  { id: 'tophat',     name: 'Top Hat',  emoji: '🎩', color: '#1a1a1a', offset: [0,  1.5,  0   ], size: [0.4,  0.28, 0.4 ] },
  { id: 'strawhat',   name: 'Straw Hat',    emoji: '🧣', color: '#e5e235', offset: [0,  0.58, 0.3 ], size: [0.56, 0.14, 0.1 ] },
  { id: 'witchhat',   name: 'Witch Hat',    emoji: '🧣', color: '#e53935', offset: [0,  0.58, 0.3 ], size: [0.56, 0.14, 0.1 ] },
  { id: 'bow',     name: 'Bow Tie',  emoji: '🎀', color: '#e91e63', offset: [0,  0.72, 0.3 ], size: [0.34, 0.16, 0.06] },
  { id: 'pendant', name: 'Pendant',  emoji: '🕶️', color: '#44374f', offset: [0,  1.06, 0.38], size: [0.52, 0.12, 0.06] },
  { id: 'rune',    name: 'Rune',     emoji: '🎀', color: '#1f72a2', offset: [0,  0.3, -0.32], size: [0.78, 0.85, 0.06] },
  { id: 'staff',     name: 'Staff',      emoji: '', color: '#795548', offset: [0.62, 0.2, 0  ], size: [0.22, 0.28, 0.16] },
]

// ── Sub-components (must live inside Canvas) ──────────────────────────────────

function BannerTexture() {
  const tex = useTexture('/MoMP.png')
  return (
    <mesh position={[0, 2.8, -0.95]}>
      <planeGeometry args={[3.6, 1.1]} />
      <meshStandardMaterial map={tex} transparent />
    </mesh>
  )
}

function AnimalAndAccessories({
  animal,
  worn,
}: {
  animal: typeof ANIMALS[0]
  worn: Set<string>
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={animal.color} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={animal.headColor} roughness={0.7} />
      </mesh>
      {/* Label */}
      <Html position={[0, 2.05, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.65)', color: '#fff',
          padding: '2px 8px', borderRadius: '4px',
          fontSize: '11px', fontFamily: 'Georgia, serif',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {animal.name}
        </div>
      </Html>
      {/* Accessories */}
      {ACCESSORIES.filter(a => worn.has(a.id)).map(acc => (
        <mesh key={acc.id} position={acc.offset}>
          <boxGeometry args={acc.size} />
          <meshStandardMaterial color={acc.color} roughness={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function ClosetOrganizer({ worn, onToggle }: { worn: Set<string>; onToggle: (id: string) => void }) {
  return (
    <group position={[2.6, 0, 0]}>
      {/* Backing */}
      <mesh position={[0, 1.25, -0.08]}>
        <boxGeometry args={[1.2, 2.7, 0.07]} />
        <meshStandardMaterial color="#7b7b7b" roughness={0.8} />
      </mesh>
      {/* Three shelves */}
      {[0.3, 1.15, 2.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.1, 0.05, 0.28]} />
          <meshStandardMaterial color="#a4a4a4" roughness={0.7} />
        </mesh>
      ))}
      {/* Item slots: 3 rows × 2 cols */}
      {ACCESSORIES.map((acc, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = col === 0 ? -0.24 : 0.24
        const y = row === 0 ? 0.55 : row === 1 ? 1.4 : 2.25
        const active = worn.has(acc.id)
        return (
          <group key={acc.id} position={[x, y, 0.08]}>
            <mesh
              onClick={() => onToggle(acc.id)}
              onPointerOver={() => { document.body.style.cursor = 'pointer' }}
              onPointerOut={() => { document.body.style.cursor = 'auto' }}
            >
              <boxGeometry args={[0.34, 0.34, 0.1]} />
              <meshStandardMaterial
                color={active ? '#ffffff' : acc.color}
                emissive={acc.color}
                emissiveIntensity={active ? 0.6 : 0}
                roughness={0.45}
              />
            </mesh>
            <Html position={[0, -0.24, 0.1]} center>
              <div style={{
                fontSize: '9px', color: active ? '#ffff88' : '#ddd',
                fontFamily: 'sans-serif', whiteSpace: 'nowrap',
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              }}>
                {acc.emoji} {acc.name}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function Mirror() {
  return (
    <group position={[-2.7, 0, 0]}>
      <mesh position={[0, 1.65, 0]}>
        <boxGeometry args={[1.05, 2.1, 0.07]} />
        <meshStandardMaterial color="#7a5520" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.65, 0.05]}>
        <boxGeometry args={[0.85, 1.9, 0.02]} />
        <meshStandardMaterial color="#b8c8d0" metalness={1.0} roughness={0.04} />
      </mesh>
    </group>
  )
}

function SceneCapture({ captureRef }: { captureRef: React.MutableRefObject<(() => string) | null> }) {
  const { gl } = useThree()
  captureRef.current = () => gl.domElement.toDataURL('image/png')
  return null
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props { onClose: () => void }

export default function DressUpModal({ onClose }: Props) {
  const [animal, setAnimal]             = useState(ANIMALS[0])
  const [worn, setWorn]                 = useState<Set<string>>(new Set())
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const captureRef = useRef<(() => string) | null>(null)

  const toggleAcc = useCallback((id: string) => {
    setWorn(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleCapture = useCallback(() => {
    if (captureRef.current) setScreenshotUrl(captureRef.current())
  }, [])

  const handleDownload = useCallback(() => {
    if (!screenshotUrl) return
    const a = document.createElement('a')
    a.href = screenshotUrl
    a.download = `wish-room-portrait.png`
    a.click()
  }, [screenshotUrl])

  const panelStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 30,
    background: 'rgba(8, 4, 18, 0.97)',
    display: 'flex', flexDirection: 'column',
    fontFamily: 'Georgia, serif',
  }

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <h2 style={{ margin: 0, color: '#e0c8ff', fontSize: '17px', letterSpacing: '0.05em' }}>
          🪞 Dress-Up Studio
        </h2>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer', padding: '4px' }}>✕</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left sidebar: animal selector */}
        <div style={{
          width: '150px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          overflowY: 'auto', padding: '12px 10px',
        }}>
          <div style={{ color: '#888', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '8px' }}>CHOOSE ANIMAL</div>
          {ANIMALS.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => { setAnimal(a); setWorn(new Set()) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', textAlign: 'left',
                background: animal.id === a.id ? 'rgba(140,70,210,0.4)' : 'rgba(255,255,255,0.04)',
                border: animal.id === a.id ? '1px solid rgba(180,120,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', padding: '6px 10px', marginBottom: '5px',
                color: '#ccc', fontSize: '13px', cursor: 'pointer',
              }}
            >
              <span style={{
                display: 'inline-block', width: '10px', height: '10px',
                borderRadius: '50%', background: a.color, flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.2)',
              }} />
              {a.name}
            </button>
          ))}
        </div>

        {/* Center: 3D canvas */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <Canvas
            gl={{ preserveDrawingBuffer: true }}
            dpr={[1, 2]}
            camera={{ position: [0, 2, 5.5], fov: 58, near: 0.1, far: 100 }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={['#120820']} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 5, 4]} intensity={0.9} />
            <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#ddc8ff" />

            {/* Back wall */}
            <mesh position={[0, 2, -1]}>
              <planeGeometry args={[10, 6]} />
              <meshStandardMaterial color="#1a0a2e" />
            </mesh>

            {/* Museum banner */}
            <Suspense fallback={
              <mesh position={[0, 2.8, -0.95]}>
                <planeGeometry args={[3.6, 1.1]} />
                <meshStandardMaterial color="#2c1a4a" />
              </mesh>
            }>
              <BannerTexture />
            </Suspense>

            {/* Floor */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[12, 8]} />
              <meshStandardMaterial color="#1e1030" roughness={0.9} />
            </mesh>

            <AnimalAndAccessories animal={animal} worn={worn} />
            <ClosetOrganizer worn={worn} onToggle={toggleAcc} />
            <Mirror />

            <OrbitControls target={[0, 1.2, 0]} maxPolarAngle={Math.PI / 2} />
            <SceneCapture captureRef={captureRef} />
          </Canvas>

          {/* Photo button */}
          <button
            type="button"
            onClick={handleCapture}
            style={{
              position: 'absolute', bottom: '16px', right: '16px',
              background: 'rgba(130,60,200,0.92)',
              border: '1px solid rgba(200,150,255,0.5)',
              borderRadius: '8px', padding: '8px 18px',
              color: '#fff', fontSize: '13px', cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            📷 Take Photo
          </button>
        </div>
      </div>

      {/* Screenshot popup */}
      {screenshotUrl && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setScreenshotUrl(null)}
        >
          <div
            style={{
              background: '#fff', padding: '16px', borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
              maxWidth: '90vw',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={screenshotUrl}
              alt="Portrait"
              style={{ display: 'block', maxWidth: '80vw', maxHeight: '58vh', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button type="button" onClick={() => setScreenshotUrl(null)} style={{
                flex: 1, padding: '8px', background: '#eee', border: 'none', color: '#333',
                borderRadius: '6px', cursor: 'pointer', fontFamily: 'sans-serif', fontSize: '13px',
              }}>
                ← Back
              </button>
              <button type="button" onClick={handleDownload} style={{
                flex: 1, padding: '8px', background: '#7b2fa2', color: '#fff',
                border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontFamily: 'sans-serif', fontSize: '13px',
              }}>
                ⬇ Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

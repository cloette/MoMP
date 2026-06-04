'use client'
import { useState, useRef, useCallback, Suspense, useMemo, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF, useTexture } from '@react-three/drei'

// ── Preload all models ────────────────────────────────────────────────────────
const BASE = '/exhibitobjects/wishroom'
useGLTF.preload(`${BASE}/torti_-_stylized_turtle.glb`)
useGLTF.preload(`${BASE}/cute_little_bunny_pet.glb`)
useGLTF.preload(`${BASE}/low_poly_animated_cartoon_whale.glb`)
useGLTF.preload(`${BASE}/snake.glb`)
useGLTF.preload(`${BASE}/magician_top_hat.glb`)
useGLTF.preload(`${BASE}/luffys_straw_hat.glb`)
useGLTF.preload(`${BASE}/witch_hat_halooween.glb`)
useGLTF.preload(`${BASE}/red_bowtie.glb`)
useGLTF.preload(`${BASE}/sapphire_pendant_with_inner_fracture.glb`)
useGLTF.preload(`${BASE}/rune_pendant.glb`)
useGLTF.preload(`${BASE}/staff.glb`)

// ── Data ──────────────────────────────────────────────────────────────────────

interface Ani {
  id: string
  name: string
  color: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  glb: string
  scale?: number
}

const ANIMALS: Ani[] = [
  { id: 'turtle', name: 'Turtle', color: '#015e04', position: [0, .5, 0], rotation: [0, .5, 0], glb: `${BASE}/torti_-_stylized_turtle.glb`, scale: 2.5 },
  { id: 'rabbit', name: 'Rabbit', color: '#edcae8', position: [.2, 1, 0], rotation: [0, .5, 0], glb: `${BASE}/cute_little_bunny_pet.glb`, scale: .9 },
  { id: 'whale',  name: 'Whale',  color: '#15bed8', position: [0, 0, .3], rotation: [0, 4, 0],  glb: `${BASE}/Low_poly_animated_cartoon_whale.glb`, scale: .03 },
  { id: 'snake',  name: 'Snake',  color: '#008802', position: [-1.5, 0, 1.6], rotation: [0, 2.5, 0], glb: `${BASE}/snake.glb`, scale: .15 },
]

interface Acc {
  id: string
  name: string
  emoji: string
  color: string
  offset: [number, number, number]
  glb: string
  scale?: number
}

const ACCESSORIES: Acc[] = [
  { id: 'tophat',   name: 'Top Hat',   emoji: '🎩', color: '#1a1a1a', offset: [.4,    1.2,  1   ], glb: `${BASE}/magician_top_hat.glb`, scale: .15 },
  { id: 'strawhat', name: 'Straw Hat', emoji: '🧢', color: '#e5e235', offset: [0,    0, 0.3 ], glb: `${BASE}/luffys_straw_hat.glb` },
  { id: 'witchhat', name: 'Witch Hat', emoji: '🧙', color: '#220033', offset: [0,    0, 0.3 ], glb: `${BASE}/witch_hat_halooween.glb`, scale: 0.6 },
  { id: 'bow',      name: 'Bow Tie',   emoji: '🎀', color: '#e91e63', offset: [0,    0, 0.3 ], glb: `${BASE}/red_bowtie.glb`, scale: 0.0005 },
  { id: 'pendant',  name: 'Pendant',   emoji: '💎', color: '#44374f', offset: [0,    0, 0.38], glb: `${BASE}/sapphire_pendant_with_inner_fracture.glb`, scale: .1 },
  { id: 'rune',     name: 'Rune',      emoji: '🪬', color: '#1f72a2', offset: [0,    0, -0.32], glb: `${BASE}/rune_pendant.glb`, scale: 0.005 },
  { id: 'staff',    name: 'Staff',     emoji: '🪄', color: '#795548', offset: [0,    0,  0   ], glb: `${BASE}/staff.glb`, scale: 1 },
]

// ── Sub-components (must live inside Canvas) ──────────────────────────────────

function GlbModel({ path, scale, position, rotation, colorOverride }: {
  path: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  colorOverride?: string
}) {
  const { scene } = useGLTF(path)
  // Clone the scene AND its materials so color overrides don't bleed into other instances
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        obj.material = Array.isArray(obj.material)
          ? obj.material.map((m: any) => m.clone())
          : obj.material.clone()
      }
    })
    return c
  }, [scene])

  useEffect(() => {
    if (!colorOverride) return
    clone.traverse((obj: any) => {
      if (obj.isMesh) {
        const mats: any[] = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(mat => { if (mat.color) mat.color.set(colorOverride) })
      }
    })
  }, [clone, colorOverride])

  return <primitive object={clone} scale={scale ?? 1} position={position} rotation={rotation} />
}

function AnimalAndAccessories({
  animal,
  worn,
  accColors,
}: {
  animal: typeof ANIMALS[0]
  worn: Set<string>
  accColors: Record<string, string>
}) {
  return (
    <group position={[0, 0, 0]}>
      <Suspense fallback={null}>
        <GlbModel path={animal.glb} scale={animal.scale ?? 0.1} position={animal.position ?? [0, 0, 0]} rotation={animal.rotation ?? [0, 0, 0]}/>
      </Suspense>
      {ACCESSORIES.filter(a => worn.has(a.id)).map(acc => (
        <Suspense key={acc.id} fallback={null}>
          <GlbModel
            path={acc.glb}
            scale={acc.scale ?? 0.05}
            position={acc.offset}
            colorOverride={accColors[acc.id]}
          />
        </Suspense>
      ))}
    </group>
  )
}

function ClosetOrganizer({
  worn, onToggle, selectedAccId, onSelect, accColors,
}: {
  worn: Set<string>
  onToggle: (id: string) => void
  selectedAccId: string | null
  onSelect: (id: string) => void
  accColors: Record<string, string>
}) {
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
        const selected = selectedAccId === acc.id
        const displayColor = accColors[acc.id] ?? acc.color
        return (
          <group
            key={acc.id}
            position={[x, y, 0.08]}
            onClick={() => { onToggle(acc.id); onSelect(acc.id) }}
            onPointerOver={() => { document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { document.body.style.cursor = 'auto' }}
          >
            {/* Selection ring */}
            {selected && (
              <mesh>
                <boxGeometry args={[0.37, 0.37, 0.06]} />
                <meshStandardMaterial color="#ffffff" wireframe />
              </mesh>
            )}
            {/* Slot backing / worn highlight */}
            <mesh>
              <boxGeometry args={[0.34, 0.34, 0.04]} />
              <meshStandardMaterial
                color={active ? displayColor : '#555'}
                emissive={active ? displayColor : '#000000'}
                emissiveIntensity={active ? 0.5 : 0}
                roughness={0.7}
              />
            </mesh>
            <Suspense fallback={null}>
              <GlbModel
                path={acc.glb}
                scale={acc.scale ?? 0.05}
                position={[0, 0, 0.05]}
                colorOverride={accColors[acc.id]}
              />
            </Suspense>
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

function BannerTexture() {
  const tex = useTexture('/MoMP.png')
  return (
    <mesh position={[0, 2.6, -0.95]}>
      <planeGeometry args={[3.6, 1.1]} />
      <meshStandardMaterial map={tex} transparent />
    </mesh>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props { onClose: () => void }

export default function DressUpModal({ onClose }: Props) {
  const [animal, setAnimal]               = useState(ANIMALS[0])
  const [worn, setWorn]                   = useState<Set<string>>(new Set())
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null)
  const [accColors, setAccColors]         = useState<Record<string, string>>({})
  const captureRef = useRef<(() => string) | null>(null)

  const selectedAcc = ACCESSORIES.find(a => a.id === selectedAccId) ?? null

  const toggleAcc = useCallback((id: string) => {
    setWorn(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleCapture  = useCallback(() => {
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

          {selectedAcc && (
            <>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '12px 0 10px' }} />
              <div style={{ color: '#888', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '8px' }}>ACCESSORY COLOR</div>
              <div style={{ color: '#ccc', fontSize: '12px', fontFamily: 'sans-serif', marginBottom: '8px' }}>
                {selectedAcc.emoji} {selectedAcc.name}
              </div>
              <input
                type="color"
                value={accColors[selectedAcc.id] ?? selectedAcc.color}
                onChange={e => setAccColors(prev => ({ ...prev, [selectedAcc.id]: e.target.value }))}
                style={{
                  width: '100%', height: '38px', border: 'none',
                  borderRadius: '6px', cursor: 'pointer', padding: '2px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              />
              <button
                type="button"
                onClick={() => setAccColors(prev => { const n = { ...prev }; delete n[selectedAcc.id]; return n })}
                style={{
                  marginTop: '6px', width: '100%', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px',
                  color: '#888', fontSize: '11px', cursor: 'pointer', padding: '4px',
                  fontFamily: 'sans-serif',
                }}
              >
                Reset
              </button>
            </>
          )}
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

            {/* Museum banner — solid white */}
            <Suspense fallback={
              <mesh position={[0, 1.8, -0.95]}>
                <planeGeometry args={[3.6, 1.1]} />
                <meshStandardMaterial color="#fdfdfd" />
              </mesh>
            }>
              <BannerTexture />
            </Suspense>
            <mesh position={[0, 0.8, -0.98]}>
              <planeGeometry args={[3.6, 5.1]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Floor */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[12, 8]} />
              <meshStandardMaterial color="#1e1030" roughness={0.9} />
            </mesh>

            <AnimalAndAccessories animal={animal} worn={worn} accColors={accColors} />
            <ClosetOrganizer
              worn={worn} onToggle={toggleAcc}
              selectedAccId={selectedAccId} onSelect={setSelectedAccId}
              accColors={accColors}
            />
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

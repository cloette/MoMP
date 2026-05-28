'use client'
import { useControlKeys } from './ControlsContext'

interface MobileControlsProps {
  nearDoor: boolean
  onInteract: () => void
}

const btnBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.28)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '1px solid rgba(255,255,255,0.45)',
  borderRadius: '50%',
  width: '54px',
  height: '54px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  color: '#333',
  userSelect: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'none',
}

function VBtn({ label, keyName }: { label: string; keyName: string }) {
  const keys = useControlKeys()
  return (
    <div
      style={btnBase}
      onPointerDown={(e) => { e.preventDefault(); keys.current.add(keyName) }}
      onPointerUp={() => keys.current.delete(keyName)}
      onPointerLeave={() => keys.current.delete(keyName)}
    >
      {label}
    </div>
  )
}

export function MobileControls({ nearDoor, onInteract }: MobileControlsProps) {
  return (
    // ── INTERACTIVE FEATURES ── on-screen controls overlay
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 28px',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* D-pad */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', pointerEvents: 'all' }}>
        <VBtn label="▲" keyName="ArrowUp" />
        <div style={{ display: 'flex', gap: '6px' }}>
          <VBtn label="◁" keyName="," />
          <VBtn label="▼" keyName="ArrowDown" />
          <VBtn label="▷" keyName="." />
        </div>
      </div>

      {/* Enter button — only shown near door */}
      {nearDoor && (
        <div style={{ pointerEvents: 'all' }}>
          <div
            style={{
              ...btnBase,
              background: 'rgba(140, 80, 180, 0.55)',
              borderRadius: '12px',
              width: '68px',
              height: '68px',
              fontSize: '13px',
              color: '#fff',
              fontFamily: 'sans-serif',
              textAlign: 'center',
              lineHeight: '1.3',
              flexDirection: 'column',
            }}
            onClick={onInteract}
          >
            Enter
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'momp_welcome_seen'

export function WelcomePopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '36px 40px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        fontFamily: 'Georgia, serif',
      }}>
        <h2 style={{
          margin: '0 0 6px',
          fontSize: '20px',
          color: '#2d0050',
          letterSpacing: '0.02em',
          lineHeight: '1.3',
        }}>
          Welcome to the Museum of Magical Phenomena
        </h2>
        <p style={{
          margin: '0 0 24px',
          fontSize: '13px',
          color: '#888',
          fontFamily: 'sans-serif',
          fontStyle: 'italic',
        }}>
          This is a simplified proof-of-concept virtual museum built with React and Three.js. It helps demonstrate what is possible. It can be accessed in the browser or in a VR headset.
        </p>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <FeatureRow
            icon="🔇"
            title="Museum Audio"
            desc="Sound is off by default. Tap 🔇 in the top-right, or press / on your keyboard, to unmute. A welcome message plays once; exhibit audio triggers at each stop."
          />
          <FeatureRow
            icon="👣"
            title="Auto-Walk"
            desc="Tap ▶ in the top-right, or press Space, to let the camera guide you through the room. It pauses at each exhibit automatically. Press Space or ▶ again to stop."
          />
          <FeatureRow
            icon="📷"
            title="Camera Direction"
            desc="Use the left and right arrows to look around. The < and > keys have the same function."
          />
        </div>

        <button
          type="button"
          onClick={dismiss}
          style={{
            marginTop: '28px',
            width: '100%',
            background: '#6c3483',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '13px',
            fontSize: '15px',
            fontFamily: 'Georgia, serif',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Begin Your Visit
        </button>
        <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '12px', color: '#aaa', fontFamily: 'sans-serif' }}>
          Press Enter to continue
        </p>
      </div>
    </div>
  )
}

function FeatureRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <div style={{
        width: '38px', height: '38px', flexShrink: 0,
        borderRadius: '9px', background: '#f3eaff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '17px',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginBottom: '3px', fontFamily: 'sans-serif' }}>
          {title}
        </div>
        <div style={{ fontSize: '13px', color: '#666', fontFamily: 'sans-serif', lineHeight: '1.5' }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

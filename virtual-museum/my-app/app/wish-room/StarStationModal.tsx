'use client'
import { useState, useCallback } from 'react'

interface Props { onClose: () => void }

export default function StarStationModal({ onClose }: Props) {
  const [phase, setPhase]       = useState<'input' | 'video'>('input')
  const [wishText, setWishText] = useState('')

  const confirm = useCallback(() => {
    if (wishText.trim()) setPhase('video')
  }, [wishText])

  const reset = useCallback(() => {
    setPhase('input')
    setWishText('')
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 30,
      background: 'rgba(4, 8, 22, 0.97)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Georgia, serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <h2 style={{ margin: 0, color: '#c8e0ff', fontSize: '17px', letterSpacing: '0.05em' }}>
          ⭐ Paper Star Station
        </h2>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', gap: '20px', overflow: 'auto',
      }}>

        {phase === 'input' ? (
          /* ── Wish input ── */
          <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
            <p style={{ color: '#9bbcdd', margin: 0, textAlign: 'center', fontSize: '15px', lineHeight: 1.65 }}>
              Write a wish on the paper strip.<br />
              Then watch how to fold it into a lucky star!
            </p>

            {/* Paper strip */}
            <div style={{
              width: '100%',
              background: '#fffde7',
              borderRadius: '4px',
              padding: '12px 16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              <textarea
                value={wishText}
                onChange={e => setWishText(e.target.value)}
                // Stop propagation so the room's Space → auto-walk shortcut
                // does not intercept keystrokes typed inside this textarea.
                onKeyDown={e => e.stopPropagation()}
                maxLength={120}
                rows={2}
                placeholder="Write your wish here…"
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: 'Georgia, serif', fontSize: '15px', color: '#3e2723',
                  resize: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end', color: '#555', fontSize: '11px', marginTop: '-12px' }}>
              {wishText.length}/120
            </div>

            <button
              type="button"
              onClick={confirm}
              disabled={!wishText.trim()}
              style={{
                background: wishText.trim() ? 'rgba(80,140,210,0.92)' : 'rgba(60,60,80,0.5)',
                border: '1px solid rgba(140,190,255,0.4)',
                borderRadius: '8px', padding: '10px 32px',
                color: '#fff', fontSize: '14px',
                cursor: wishText.trim() ? 'pointer' : 'default',
                letterSpacing: '0.03em',
              }}
            >
              ✨ Confirm Wish
            </button>
          </div>

        ) : (
          /* ── Folding tutorial ── */
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>

            {/* Wish on paper strip */}
            <div style={{
              width: '100%',
              background: '#fffde7',
              borderRadius: '4px',
              padding: '10px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              textAlign: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: '15px',
              color: '#3e2723',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {wishText}
            </div>

            <p style={{ color: '#9bbcdd', margin: 0, textAlign: 'center', fontSize: '14px', lineHeight: 1.6 }}>
              Now fold your paper strip into a lucky star — follow along with the video below!
            </p>

            {/* YouTube embed */}
            <div style={{
              width: '100%', position: 'relative',
              paddingBottom: '56.25%', /* 16:9 */
              borderRadius: '10px', overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src="https://www.youtube.com/embed/p8VdVgkNtbI?start=21&autoplay=1"
                title="How to fold a lucky paper star"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <button
              type="button"
              onClick={reset}
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '8px', padding: '8px 24px',
                color: '#99aacc', fontSize: '13px', cursor: 'pointer',
              }}
            >
              ↩ Make Another Wish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

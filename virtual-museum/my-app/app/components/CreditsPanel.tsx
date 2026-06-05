'use client'
import React from 'react'

interface CreditsPanelProps {
  onClose: () => void
  children: React.ReactNode
}

export function CreditsPanel({ onClose, children }: CreditsPanelProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 20, pointerEvents: 'all',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.93)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(200,200,200,0.5)',
          borderRadius: '12px',
          padding: '28px 32px',
          maxWidth: '440px',
          width: '90vw',
          maxHeight: '70vh',
          overflowY: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '14px',
            background: 'none', border: 'none',
            fontSize: '16px', cursor: 'pointer',
            color: '#888', lineHeight: 1, padding: '4px',
          }}
          title="Close credits"
        >
          ✕
        </button>
        <h2 style={{ margin: '0 0 18px', fontSize: '17px', color: '#333', letterSpacing: '0.02em' }}>
          Credits
        </h2>
        {children}
      </div>
    </div>
  )
}

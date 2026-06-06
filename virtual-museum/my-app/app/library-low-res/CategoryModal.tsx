'use client'
import { useMemo } from 'react'

export interface LibraryItem {
  title: string
  description: string
  wtli: string
}

export type CategoryName = 'Books' | 'Comics/Manga' | 'Video' | 'Games' | 'Other'

interface CategoryModalProps {
  category: CategoryName
  items: LibraryItem[]
  onClose: () => void
}

export function CategoryModal({ category, items, onClose }: CategoryModalProps) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.title.localeCompare(b.title)),
    [items]
  )

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.72)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1e0e08',
          border: '2px solid #7a1010',
          borderRadius: '8px',
          width: 'min(92vw, 520px)',
          maxHeight: '78vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: '#2d1008',
          borderBottom: '1px solid #7a1010',
          flexShrink: 0,
        }}>
          <span style={{ color: '#f5e6c0', fontSize: '18px', letterSpacing: '0.06em' }}>
            {category}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#c8a880',
              fontSize: '20px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '8px 20px 20px', flex: 1 }}>
          {sorted.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 32 }}>
              No entries yet.
            </p>
          ) : (
            sorted.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 0',
                  borderBottom: i < sorted.length - 1 ? '1px solid rgba(122,16,16,0.25)' : 'none',
                }}
              >
                <div style={{ color: '#f5e6c0', fontWeight: 'bold', fontSize: '14px', marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ color: '#b89060', fontSize: '12px', marginBottom: 4, lineHeight: 1.5 }}>
                  {item.description}
                </div>
                <div style={{ color: '#8a6040', fontSize: '11px', fontStyle: 'italic' }}>
                  <span style={{ color: '#9a2020', fontStyle: 'normal', marginRight: 4 }}>WTLI:</span>
                  {item.wtli}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

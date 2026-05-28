'use client'
import { createContext, useRef, useEffect, useContext, type ReactNode, type MutableRefObject } from 'react'

const FALLBACK_KEYS: MutableRefObject<Set<string>> = { current: new Set() }
const ControlsContext = createContext<MutableRefObject<Set<string>>>(FALLBACK_KEYS)

export function ControlsProvider({ children }: { children: ReactNode }) {
  const keys = useRef(new Set<string>())

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
      keys.current.add(e.key)
    }
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.key)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  return <ControlsContext.Provider value={keys}>{children}</ControlsContext.Provider>
}

export function useControlKeys() {
  return useContext(ControlsContext)
}

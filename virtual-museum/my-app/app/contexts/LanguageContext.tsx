'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

type Messages = Record<string, string>

const STORAGE_KEY = 'momp_locale'

export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
]

const LanguageContext = createContext<{
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState('en')
  const [messages, setMessages] = useState<Messages>({})

  async function loadLocale(loc: string) {
    try {
      const res = await fetch(`/messages/${loc}.json`)
      if (!res.ok) throw new Error(`Failed to load ${loc}`)
      const data: Messages = await res.json()
      setMessages(data)
      setLocaleState(loc)
    } catch {
      if (loc !== 'en') {
        loadLocale('en')
      }
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const supported = SUPPORTED_LOCALES.map((l) => l.code)
    loadLocale(saved && supported.includes(saved) ? saved : 'en')
  }, [])

  function setLocale(loc: string) {
    localStorage.setItem(STORAGE_KEY, loc)
    loadLocale(loc)
  }

  const t = useCallback(
    (key: string): string => messages[key] ?? key,
    [messages]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

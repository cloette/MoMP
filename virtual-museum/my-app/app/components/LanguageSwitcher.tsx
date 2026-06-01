'use client'
import { useLanguage, SUPPORTED_LOCALES } from '../contexts/LanguageContext'

export function LanguageSwitcher({ style }: { style?: React.CSSProperties }) {
  const { locale, setLocale } = useLanguage()

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: '1px solid rgba(200,200,200,0.5)',
        borderRadius: '6px',
        padding: '5px 8px',
        fontSize: '13px',
        color: '#555',
        cursor: 'pointer',
        fontFamily: 'sans-serif',
        ...style,
      }}
    >
      {SUPPORTED_LOCALES.map(({ code, label }) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </select>
  )
}

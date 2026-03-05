import { useState, useEffect } from 'react'

const PASSWORD = 'powertec2026'
const STORAGE_KEY = 'ptec-dl-auth'

export default function BrowserBlock() {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') setUnlocked(true)
  }, [])

  function attempt() {
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') attempt()
    if (error) setError(false)
  }

  const card: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    padding: '40px 28px',
    maxWidth: 360,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    animation: shake ? 'shake 0.4s ease' : 'none',
  }

  if (unlocked) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={card}>
          <img src="/logo.jpg" alt="Powertec" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', margin: '0 auto 20px' }} />
          <h1 style={{ color: '#0f172a', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Powertec Contractor App</h1>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px' }}>Android app for Powertec contractors.</p>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1565C0', borderRadius: 99, padding: '4px 12px', fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
            Latest version
          </div>
          <a
            href="https://github.com/rorywood/pteccontractorapp/releases/latest/download/powertec-tools.apk"
            style={{ display: 'block', background: '#1565C0', color: 'white', textDecoration: 'none', borderRadius: 14, padding: '14px 20px', fontWeight: 700, fontSize: 15, marginBottom: 12 }}
          >
            ⬇ Download Android App
          </a>
          <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            After downloading, tap the file to install.<br />Allow installs from unknown sources if prompted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
      <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={card}>
          <img src="/logo.jpg" alt="Powertec" style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', margin: '0 auto 20px' }} />
          <h1 style={{ color: '#0f172a', fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Powertec Contractor App</h1>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 28px' }}>Enter the access password to continue</p>

          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            onKeyDown={onKey}
            autoFocus
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 12,
              border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 10,
              transition: 'border-color 0.15s',
              background: error ? '#fef2f2' : 'white',
            }}
          />

          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 10px', fontWeight: 600 }}>
              Incorrect password
            </p>
          )}

          <button
            onClick={attempt}
            style={{
              width: '100%',
              background: '#1565C0',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            Continue
          </button>

          <p style={{ color: '#cbd5e1', fontSize: 12, margin: 0 }}>
            For authorised Powertec contractors only
          </p>
        </div>
      </div>
    </>
  )
}

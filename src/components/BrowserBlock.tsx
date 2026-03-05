export default function BrowserBlock() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '40px 28px',
        maxWidth: 360,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <img
          src="/logo.jpg"
          alt="Powertec Telecommunications"
          style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', margin: '0 auto 20px' }}
        />
        <h1 style={{ color: '#0f172a', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>
          Powertec Tools
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
          This app is only available on Android.<br />
          Download the app to get started.
        </p>
        <a
          href="https://github.com/rorywood/pteccontractorapp/releases/latest/download/powertec-tools.apk"
          style={{
            display: 'block',
            background: '#1565C0',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 14,
            padding: '14px 20px',
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 12,
          }}
        >
          Download Android App
        </a>
        <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
          For Powertec Telecommunications contractors only.
        </p>
      </div>
    </div>
  )
}

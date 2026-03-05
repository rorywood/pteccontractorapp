import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400)
    const t2 = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-500"
      style={{
        background: '#1565C0',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <img
        src="/logo.jpg"
        alt="Powertec Telecommunications"
        className="w-64 h-64 object-contain"
        style={{ borderRadius: 24 }}
      />
      <p
        className="text-white/60 text-xs font-medium mt-6 tracking-widest uppercase"
        style={{ letterSpacing: '0.2em' }}
      >
        Contractor Portal
      </p>
    </div>
  )
}

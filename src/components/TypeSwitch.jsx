// Dev-only: flip the type system while looking at the real pages. Picking
// fonts off specimen cards is not the same as seeing them on the issue.
// Stripped from production builds.
import { useEffect, useState } from 'react'

const SETS = [
  ['1', 'Playfair · Pinyon · DM Sans'],
  ['2', 'Bodoni · Ms Madi · Jost'],
  ['3', 'Fraunces · Sacramento · Figtree'],
  ['4', 'Instrument Serif · Italianno · Instrument Sans'],
  ['5', 'Cormorant · Parisienne · DM Sans'],
  ['6', 'Newsreader · Ms Madi · Inter Tight'],
  ['7', 'Instrument Sans only · Ms Madi'],
  ['8', 'Prata · Ms Madi · Jost'],
]

export default function TypeSwitch() {
  const [set, setSet] = useState(() => {
    const q = new URLSearchParams(window.location.search).get('type')
    return q || localStorage.getItem('issue28-type') || '3'
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.type = set
    try {
      localStorage.setItem('issue28-type', set)
    } catch {
      // private window, no matter
    }
  }, [set])

  const current = SETS.find(([n]) => n === set)

  return (
    <div
      className="fixed z-[90]"
      style={{ left: 10, bottom: 'max(10px, env(safe-area-inset-bottom))', fontFamily: 'ui-monospace, monospace' }}
    >
      {open && (
        <div
          style={{
            background: 'rgba(28,25,23,0.94)',
            borderRadius: 8,
            padding: 6,
            marginBottom: 6,
            maxWidth: 232,
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          {SETS.map(([n, name]) => (
            <button
              key={n}
              onClick={() => setSet(n)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: n === set ? 'rgba(255,255,255,0.16)' : 'transparent',
                color: n === set ? '#fff' : 'rgba(255,255,255,0.72)',
                border: 0,
                borderRadius: 5,
                padding: '6px 8px',
                fontSize: 10.5,
                lineHeight: 1.3,
                cursor: 'pointer',
              }}
            >
              <b style={{ marginRight: 6 }}>{n}</b>
              {name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'rgba(28,25,23,0.9)',
          color: '#fff',
          border: 0,
          borderRadius: 999,
          padding: '7px 12px',
          fontSize: 11,
          cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
        }}
      >
        Aa {set}
        {open ? '' : ` · ${current ? current[1].split(' · ')[0] : ''}`}
      </button>
    </div>
  )
}

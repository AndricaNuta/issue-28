// The small printed details, kept in one place so the scenes stay about their
// own mechanics. Deliberately spare: a rule, a kicker, a barcode, a photo.
import { useState } from 'react'

export function Kicker({ children, color = 'var(--accent)', className = '', style }) {
  return (
    <p className={`kicker ${className}`} style={{ color, ...style }}>
      {children}
    </p>
  )
}

export function Rule({ style }) {
  return <div className="hair" style={style} aria-hidden="true" />
}

// Deterministic bar widths from a seed, so it never reshuffles between renders.
export function Barcode({ width = 78, height = 22, seed = 7, label, color = 'var(--ink)' }) {
  const bars = []
  let x = 0
  let n = seed
  while (x < width - 2) {
    n = (n * 1103515245 + 12345) & 0x7fffffff
    const w = 1 + (n % 3)
    const gap = 1 + ((n >> 5) % 2)
    bars.push({ x, w })
    x += w + gap
  }
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg width={width} height={height} aria-hidden="true">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />
        ))}
      </svg>
      {label && <span className="kicker" style={{ fontSize: 8, color: 'var(--ink-40)' }}>{label}</span>}
    </div>
  )
}

// Photos land in public/photos/ later. Until then, or if a filename is wrong,
// this draws a quiet placeholder instead of a broken image, so the layout is
// always testable.
export function Photo({ src, alt, className = '', style, placeholder = 'PHOTO', objectPosition = 'center' }) {
  const [failed, setFailed] = useState(false)
  const full = src ? import.meta.env.BASE_URL + src : null

  if (!full || failed) {
    return (
      <div
        className={`grid place-items-center ${className}`}
        style={{
          background: 'repeating-linear-gradient(45deg, #EFE7E0 0 10px, #E7DED6 10px 20px)',
          ...style,
        }}
        aria-label={alt}
      >
        <span className="kicker" style={{ fontSize: 9, color: 'rgba(26,20,24,0.32)' }}>
          {placeholder}
        </span>
      </div>
    )
  }

  return (
    <img
      src={full}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      style={{ objectFit: 'cover', objectPosition, ...style }}
    />
  )
}

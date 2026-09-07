import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useExperience, useCta } from '../experience.js'
import { CONFIG, PEOPLE } from '../config.js'
import { Barcode, Kicker, Rule } from '../components/Paper.jsx'
import { cannons } from '../lib/confetti.js'

// The masthead page: everyone who chipped in, printed as staff.
export default function Close() {
  const { go } = useExperience()
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  // Browsers only autoplay with sound once the page has been interacted with,
  // and iOS wants the gesture tied to the play call. By this page she has
  // tapped through the whole issue, so sound usually takes; when it does not,
  // it falls back to muted and offers a button.
  // the cannons go off as the last page arrives
  useEffect(() => {
    const t = setTimeout(() => cannons(1.6), 450)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.play().then(
      () => setMuted(false),
      () => {
        v.muted = true
        setMuted(true)
        v.play().catch(() => {})
      },
    )
  }, [])

  const unmute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {})
    setMuted(false)
  }
  useCta({ onClick: () => go('cover'), label: 'Back to the cover', ring: false }, [go])

  return (
    <div className="w-full max-w-[400px] mx-auto text-center">
      {CONFIG.closingVideo && (
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            ref={videoRef}
            src={import.meta.env.BASE_URL + CONFIG.closingVideo}
            poster={CONFIG.closingPoster ? import.meta.env.BASE_URL + CONFIG.closingPoster : undefined}
            loop
            playsInline
            autoPlay
            preload="auto"
            className="w-full block"
            style={{ aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 2 }}
          />

          {muted && (
            <button
              onClick={unmute}
              className="absolute flex items-center gap-2"
              style={{
                bottom: 10,
                left: 10,
                background: 'rgba(28,25,23,0.62)',
                backdropFilter: 'blur(4px)',
                border: 0,
                borderRadius: 999,
                padding: '8px 14px 8px 11px',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                <path d="M1 5 H4 L8 1.5 V12.5 L4 9 H1 Z" fill="#F6F1E8" />
                <path d="M11 4.5 Q13.4 7 11 9.5 M13 2.5 Q16.4 7 13 11.5" stroke="#F6F1E8" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              </svg>
              <span
                className="kicker"
                style={{ color: '#F6F1E8', fontSize: 9 }}
              >
                Sound
              </span>
            </button>
          )}
        </motion.div>
      )}

      <Kicker>{CONFIG.closingKicker}</Kicker>

      <h1 className="display mt-3" style={{ fontSize: 44 }}>
        Happy {CONFIG.age}th,
        <br />
        <em>{CONFIG.name}.</em>
      </h1>

      <p className="serif-it mt-3" style={{ fontSize: 17, color: 'var(--ink-60)' }}>
        {CONFIG.closing}
      </p>

      <Rule style={{ marginTop: 24, marginBottom: 16 }} />

      <p className="kicker" style={{ color: 'var(--ink-40)', fontSize: 9 }}>
        {CONFIG.creditsLabel}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-left">
        {PEOPLE.map((name, i) => (
          <motion.span
            key={name}
            style={{ fontSize: 13.5, color: 'var(--ink-60)' }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04, duration: 0.4 }}
          >
            {name}
          </motion.span>
        ))}
      </div>

      <Rule style={{ marginTop: 22, marginBottom: 18 }} />

      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-60)' }}>
        From all of us, with lots and lots of love
      </p>

     
    </div>
  )
}

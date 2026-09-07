import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG, PEOPLE } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'
import { popper } from '../lib/confetti.js'
import Next from '../components/Next.jsx'
import Action from '../components/Action.jsx'

// GIFT TWO, in three beats. The scratch card used to arrive with no reason
// behind it, which made an hour of massage look like a coupon. Now it is: why
// we are giving it, a petition the sixteen of us signed, then the card.
const W = 320
const H = 150

function Scratch({ onDone }) {
  const canvasRef = useRef(null)
  const lastRef = useRef(null)
  const ticks = useRef(0)
  const [scratching, setScratching] = useState(false)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = W * dpr
    c.height = H * dpr
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.scale(dpr, dpr)

    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#CFC5B8')
    g.addColorStop(0.32, '#EDE4D8')
    g.addColorStop(0.58, '#C3B8AA')
    g.addColorStop(0.82, '#E8DFD3')
    g.addColorStop(1, '#C9BFB1')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    for (let i = 0; i < 420; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.15})`
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2)
    }

    ctx.fillStyle = 'rgba(28,25,23,0.45)'
    ctx.textAlign = 'center'
    ctx.font = '700 10px "Figtree", system-ui'
    ctx.fillText('S C R A T C H   H E R E', W / 2, H / 2 - 6)
    ctx.font = '400 11px "Figtree", system-ui'
    ctx.fillText('use your finger', W / 2, H / 2 + 13)
  }, [])

  const scratch = (e) => {
    const c = canvasRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 34
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const last = lastRef.current
    if (last) {
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(x, y, 17, 0, Math.PI * 2)
    ctx.fill()
    lastRef.current = { x, y }

    // Sampling every frame would be wasteful; check the cleared share every
    // dozen moves instead.
    ticks.current += 1
    if (ticks.current % 12 !== 0) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const data = ctx.getImageData(0, 0, W * dpr, H * dpr).data
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 40) {
      total += 1
      if (data[i] < 40) clear += 1
    }
    if (clear / total > 0.5) onDone()
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ borderRadius: 3, touchAction: 'none', cursor: 'grab' }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // fine without it
        }
        setScratching(true)
        lastRef.current = null
        scratch(e)
      }}
      onPointerMove={(e) => scratching && scratch(e)}
      onPointerUp={() => {
        setScratching(false)
        lastRef.current = null
      }}
      onPointerCancel={() => {
        setScratching(false)
        lastRef.current = null
      }}
    />
  )
}

export default function Spa() {
  const { next } = useExperience()
  const [step, setStep] = useState(() => {
    if (import.meta.env.DEV) {
      const q = new URLSearchParams(window.location.search).get('step')
      if (q === 'petition' || q === 'card') return q
    }
    return 'note'
  })
  const [revealed, setRevealed] = useState(false)
  const v = CONFIG.voucher
  const finish = useCallback(() => {
    setRevealed(true)
    setTimeout(() => popper(), 220)
  }, [])

  // ---------- 1 · why ----------
  if (step === 'note') {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <h1 className="display mt-2" style={{ fontSize: 42, lineHeight: 1 }}>
          {v.noteTitle}
        </h1>
        <Rule style={{ marginTop: 16 }} />
        <p className="mt-4" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-60)' }}>
          {v.noteBody}
        </p>

        <div className="mt-6">
          <Photo
            src={CONFIG.photos.mask}
            alt="Mid-treatment"
            placeholder="MASK PHOTO"
            objectPosition="center 28%"
            className="w-full block"
            style={{ aspectRatio: '4 / 3', borderRadius: 2 }}
          />
          <p className="serif-it mt-2" style={{ fontSize: 14, color: 'var(--ink-40)', lineHeight: 1.45 }}>
            {v.caption}
          </p>
        </div>

        <div className="mt-7 flex justify-center">
          <Next onClick={() => setStep('petition')} label="So we did something" />
        </div>
      </div>
    )
  }

  // ---------- 2 · the petition ----------
  if (step === 'petition') {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <motion.div
          className="relative"
          style={{ background: 'var(--paper-card)', padding: '26px 22px 22px', borderRadius: 2, boxShadow: '0 14px 34px rgba(28,25,23,0.14)' }}
          initial={{ opacity: 0, y: 18, rotate: -0.8 }}
          animate={{ opacity: 1, y: 0, rotate: -0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="kicker text-center" style={{ color: 'var(--ink-40)', fontSize: 8.5 }}>
            To whom it may concern
          </p>
          <h1 className="script text-center mt-1" style={{ fontSize: 31, lineHeight: 1.1 }}>
            {v.petitionTitle}
          </h1>

          <Rule style={{ marginTop: 16, marginBottom: 16 }} />

          <p style={{ fontSize: 15.5, lineHeight: 1.7 }}>
            We, the undersigned, having watched {CONFIG.name} work herself into the ground
            for one entire year, formally demand that she{' '}
            <b style={{ color: 'var(--accent)' }}>{v.petitionDemand}</b>.
          </p>

          {/* sixteen signatures */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-6">
            {PEOPLE.map((name, i) => (
              <motion.span
                key={name}
                className="script"
                style={{
                  fontSize: 15,
                  color: 'var(--ink)',
                  transform: `rotate(${(i % 4) - 1.5}deg)`,
                  opacity: 0.85,
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 0.25 + i * 0.055, duration: 0.35 }}
              >
                {name}
              </motion.span>
            ))}
          </div>

          <Rule style={{ marginTop: 18, marginBottom: 14 }} />

          <div className="flex items-end justify-between gap-3">
            <p className="serif-it" style={{ fontSize: 13.5, color: 'var(--ink-40)', maxWidth: '14em', lineHeight: 1.45 }}>
              {v.petitionNote}
            </p>
            <motion.span
              className="kicker shrink-0"
              style={{
                color: 'var(--accent)',
                border: '2px solid var(--accent)',
                borderRadius: 3,
                padding: '7px 11px',
                fontSize: 11,
              }}
              initial={{ opacity: 0, scale: 1.7, rotate: -18 }}
              animate={{ opacity: 0.9, scale: 1, rotate: -7 }}
              transition={{ delay: 1.3, type: 'spring', stiffness: 170, damping: 12 }}
            >
              {v.petitionStamp}
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="mt-7 flex justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <Action onClick={() => setStep('card')} label="Claim it" icon="ticket" delay={0.2} />
        </motion.div>
      </div>
    )
  }

  // ---------- 3 · the card ----------
  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h1 className="display mt-2" style={{ fontSize: 34, lineHeight: 1.08 }}>
        One hour of
        <br />
        <em>doing nothing.</em>
      </h1>
      <Rule style={{ marginTop: 20, marginBottom: 18 }} />

      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <div
          className="absolute inset-0 grid place-items-center text-center px-4"
          style={{ borderRadius: 3, background: 'var(--paper-card)', boxShadow: 'inset 0 0 0 1px var(--hair)' }}
        >
          <div>
            <Kicker>Redeemable at</Kicker>
            <p className="display" style={{ fontSize: 24, marginTop: 5 }}>
              {v.place}
            </p>
            <p style={{ fontSize: 15, marginTop: 5, color: 'var(--ink-60)' }}>
              {v.treatment}
              {v.duration ? ` · ${v.duration}` : ''}
            </p>
            {(v.validUntil || v.code) && (
              <p className="kicker" style={{ fontSize: 9.5, color: 'var(--ink-60)', marginTop: 9 }}>
                {v.validUntil ? `Valid until ${v.validUntil}` : ''}
                {v.validUntil && v.code ? ' · ' : ''}
                {v.code ? `Code ${v.code}` : ''}
              </p>
            )}
            {v.codeNote && (
              <p style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 5 }}>
                {v.codeNote}
              </p>
            )}
          </div>
        </div>

        <AnimatePresence>{!revealed && <Scratch onDone={finish} />}</AnimatePresence>
      </div>

      {!revealed && (
        <div className="flex justify-center mt-5">
          <button className="link" onClick={finish}>
            just reveal it
          </button>
        </div>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="mt-5" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
              Book it. Actually book it, do not save it for a better week. There is never a
              better week.
            </p>

            {/* the actual gift card, to open or to keep */}
            {v.pdf && (
              <div className="flex justify-center mt-6">
                <motion.a
                  href={import.meta.env.BASE_URL + v.pdf}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-2.5"
                  style={{
                    background: 'var(--accent)',
                    color: '#F6F1E8',
                    borderRadius: 999,
                    padding: '14px 24px 14px 20px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 22px rgba(181,52,42,0.3)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="grid place-items-center" style={{ width: 22, height: 22 }} aria-hidden="true">
                    <svg width="20" height="16" viewBox="0 0 22 17">
                      <path
                        d="M1.5 4.5 A2 2 0 0 0 1.5 12.5 V15.5 H20.5 V12.5 A2 2 0 0 1 20.5 4.5 V1.5 H1.5 Z"
                        fill="none"
                        stroke="#F6F1E8"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      fontSize: 11.5,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {v.openLabel}
                  </span>
                </motion.a>
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <Next onClick={next} label="Last page" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

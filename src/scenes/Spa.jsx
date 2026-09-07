import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { Barcode, Kicker, Rule } from '../components/Paper.jsx'

// GIFT TWO, printed as the advertorial at the back, under a scratch panel.
const W = 320
const H = 150

export default function Spa() {
  const { go } = useExperience()
  const canvasRef = useRef(null)
  const lastRef = useRef(null)
  const ticks = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [scratching, setScratching] = useState(false)
  const v = CONFIG.voucher

  useEffect(() => {
    const c = canvasRef.current
    if (!c || revealed) return
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
    ctx.font = '700 10px "DM Sans", system-ui'
    ctx.fillText('S C R A T C H   H E R E', W / 2, H / 2 - 6)
    ctx.font = '400 11px "DM Sans", system-ui'
    ctx.fillText('use your finger', W / 2, H / 2 + 13)
  }, [revealed])

  const finish = useCallback(() => setRevealed(true), [])

  const scratch = (e) => {
    const c = canvasRef.current
    if (!c || revealed) return
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

    // Sampling every frame would be wasteful; check the cleared share
    // every dozen moves instead.
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
    if (clear / total > 0.5) finish()
  }

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <div className="flex items-baseline justify-between">
        <Kicker>Gift two of two</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          Advertorial
        </span>
      </div>

      <h1 className="display mt-2" style={{ fontSize: 38 }}>
        One hour of
        <br />
        <em>doing nothing.</em>
      </h1>
      <p className="serif-it mt-3" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-60)' }}>
        {v.note}
      </p>

      <Rule style={{ marginTop: 20, marginBottom: 18 }} />

      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <div
          className="absolute inset-0 grid place-items-center text-center px-4"
          style={{ borderRadius: 3, background: 'var(--paper-card)', boxShadow: 'inset 0 0 0 1px var(--hair)' }}
        >
          <div>
            <p className="kicker" style={{ fontSize: 9, color: 'var(--accent)' }}>
              Redeemable at
            </p>
            <p className="display" style={{ fontSize: 26, marginTop: 4 }}>
              {v.place}
            </p>
            <p style={{ fontSize: 14, marginTop: 5, color: 'var(--ink-60)' }}>
              {v.treatment}
              {v.duration ? ` · ${v.duration}` : ''}
            </p>
            {(v.validUntil || v.code) && (
              <p className="kicker" style={{ fontSize: 8.5, color: 'var(--ink-40)', marginTop: 8 }}>
                {v.validUntil ? `Valid until ${v.validUntil}` : ''}
                {v.validUntil && v.code ? ' · ' : ''}
                {v.code ? `Code ${v.code}` : ''}
              </p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {!revealed && (
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
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-end justify-between mt-5">
        <Barcode width={72} height={20} seed={91} label="ONE VOUCHER · NON-TRANSFERABLE" />
        {!revealed && (
          <button className="link" onClick={finish}>
            just reveal it
          </button>
        )}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="mt-5" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
              Book it. Actually book it, do not save it for a better week. The gym can wait an hour.
            </p>
            <div className="mt-6 flex justify-center">
              <button className="btn" onClick={() => go('close')}>
                Last page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

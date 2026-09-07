import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG, PACK, WISHES } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'

// Her real bag, open from above, and sixteen wishes to put in it. Four wait
// around it at a time and the slots refill, so the page never becomes a wall
// of sixteen cards. Dragging is the intended gesture but a plain tap also
// works: sixteen forced drags would be a chore, not a gift.
const TAP_SLOP = 9 // px of movement below which a drag counts as a tap

export default function Pack() {
  const { complete, go } = useExperience()
  const bagRef = useRef(null)
  const [packed, setPacked] = useState(() => new Set())
  const [drag, setDrag] = useState(null)
  const [last, setLast] = useState(null)
  const [missed, setMissed] = useState(false)

  const all = useMemo(() => WISHES.map((w, i) => ({ ...w, id: i })), [])
  const waiting = all.filter((w) => !packed.has(w.id))
  const slots = waiting.slice(0, 4)
  const full = packed.size === all.length

  const accept = (wish) => {
    setPacked((prev) => new Set(prev).add(wish.id))
    setLast(wish)
    setMissed(false)
  }

  const overMouth = (x, y) => {
    const el = bagRef.current
    if (!el) return false
    const r = el.getBoundingClientRect()
    const m = CONFIG.bagMouth
    const cx = r.left + (r.width * m.x) / 100
    const cy = r.top + (r.height * m.y) / 100
    // An ellipse roughly the shape of the opening, sized generously.
    const rx = (r.width * m.r) / 100
    const ry = rx * 0.95
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
  }

  const onDown = (wish, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // fine without it
    }
    setDrag({
      wish,
      x: e.clientX,
      y: e.clientY,
      sx: e.clientX,
      sy: e.clientY,
      ox: e.clientX - r.left,
      oy: e.clientY - r.top,
      w: r.width,
      h: r.height,
    })
  }

  const onMove = (e) => {
    if (!drag) return
    setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d))
  }

  const onUp = (e) => {
    if (!drag) return
    const moved = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy)
    const tapped = moved < TAP_SLOP
    if (tapped || overMouth(e.clientX, e.clientY)) accept(drag.wish)
    else setMissed(true)
    setDrag(null)
  }

  // ---------- the full bag ----------
  if (full) {
    return (
      <div className="w-full max-w-[400px] mx-auto">
        <Kicker>{packed.size} of {all.length}</Kicker>
        <h1 className="display mt-2" style={{ fontSize: 40 }}>
          {PACK.done}
        </h1>
        <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {PACK.doneBody}
        </p>

        <div className="mt-6">
          <Rule />
          {all.map((w) => (
            <div key={w.id}>
              <div style={{ padding: '14px 2px' }}>
                <p className="serif-it" style={{ fontSize: 16, lineHeight: 1.45 }}>
                  {w.wish}
                </p>
                <p className="kicker mt-1.5" style={{ color: 'var(--accent)', fontSize: 9.5 }}>
                  {w.name}
                </p>
              </div>
              <Rule />
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <button className="btn" onClick={() => complete('pack')}>
            Back to the list
          </button>
        </div>
      </div>
    )
  }

  // ---------- packing ----------
  return (
    <div className="w-full max-w-[400px] mx-auto" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="flex items-baseline justify-between">
        <Kicker>Fill the bag</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {packed.size} of {all.length} in
        </span>
      </div>

      <h1 className="display mt-2" style={{ fontSize: 31, maxWidth: '13em' }}>
        {PACK.title}
      </h1>
      <p className="mt-2.5" style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-60)' }}>
        {PACK.standfirst}
      </p>

      {/* the four waiting wishes */}
      <div className="grid grid-cols-2 gap-2.5 mt-5">
        <AnimatePresence initial={false}>
          {slots.map((w) => (
            <motion.button
              key={w.id}
              onPointerDown={(e) => onDown(w, e)}
              className="text-left cursor-grab"
              style={{
                background: 'var(--paper-card)',
                borderRadius: 3,
                padding: '12px 13px',
                boxShadow: 'inset 0 0 0 1px var(--hair)',
                border: 'none',
                touchAction: 'none',
                opacity: drag?.wish.id === w.id ? 0.25 : 1,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: drag?.wish.id === w.id ? 0.25 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35 }}
            >
              <span className="kicker block" style={{ fontSize: 9, color: 'var(--ink-40)' }}>
                A wish from
              </span>
              <span className="display block" style={{ fontSize: 19, marginTop: 3 }}>
                {w.name}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <p
        className="text-center kicker"
        style={{ color: missed ? 'var(--accent)' : 'var(--ink-40)', fontSize: 9, margin: '14px 0 4px' }}
      >
        {missed ? 'Not in the bag. Try again, or just tap one.' : 'Drag one into the bag · or tap it'}
      </p>

      {/* the bag itself */}
      <div ref={bagRef} className="relative w-full">
        <Photo
          src={CONFIG.photos.bagOpen}
          alt="The bag, open"
          placeholder="OPEN BAG PHOTO"
          className="w-full anim-float"
          style={{ aspectRatio: '779 / 900', objectFit: 'contain' }}
        />

        {/* a soft ring showing where things go, only while she is dragging */}
        <AnimatePresence>
          {drag && (
            <motion.span
              className="absolute pointer-events-none"
              style={{
                left: `${CONFIG.bagMouth.x}%`,
                top: `${CONFIG.bagMouth.y}%`,
                width: `${CONFIG.bagMouth.r * 2}%`,
                aspectRatio: '1 / 1',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.1)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* the last wish that went in */}
      <div style={{ minHeight: 86 }} className="mt-2">
        <AnimatePresence mode="wait">
          {last && (
            <motion.div
              key={last.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Rule />
              <p className="serif-it mt-3" style={{ fontSize: 17, lineHeight: 1.45 }}>
                {last.wish}
              </p>
              <p className="kicker mt-1.5" style={{ color: 'var(--accent)', fontSize: 9.5 }}>
                {last.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex justify-center">
        <button className="link" onClick={() => go('hub')}>
          back to the list
        </button>
      </div>

      {/* the card that follows her finger */}
      {drag && (
        <div
          className="fixed pointer-events-none z-[70]"
          style={{
            left: drag.x - drag.ox,
            top: drag.y - drag.oy,
            width: drag.w,
            background: 'var(--paper-card)',
            borderRadius: 3,
            padding: '12px 13px',
            boxShadow: '0 14px 30px rgba(26,20,24,0.22)',
            transform: 'rotate(-2deg) scale(1.04)',
          }}
        >
          <span className="kicker block" style={{ fontSize: 9, color: 'var(--ink-40)' }}>
            A wish from
          </span>
          <span className="display block" style={{ fontSize: 19, marginTop: 3 }}>
            {drag.wish.name}
          </span>
        </div>
      )}
    </div>
  )
}

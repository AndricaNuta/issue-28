import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG, PACK, WISHES } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'

// She has the bag by now, so this page is what goes in it: a polaroid of each
// of the sixteen, dragged into the open bag. Dropping one prints their wish.
// A plain tap works too, because sixteen forced drags would be a chore.
const TAP_SLOP = 9 // px of movement below which a drag counts as a tap
const TILTS = [-2.5, 1.8, -1.2, 2.6]

function Polaroid({ person, tilt = 0, width, dragging }) {
  return (
    <div
      style={{
        background: '#FFFDF9',
        padding: '7px 7px 0',
        width,
        transform: `rotate(${tilt}deg)`,
        boxShadow: dragging
          ? '0 18px 34px rgba(28,25,23,0.3)'
          : '0 5px 14px rgba(28,25,23,0.16)',
      }}
    >
      <Photo
        src={person.photo}
        alt={person.name}
        placeholder="PHOTO"
        className="w-full block"
        style={{ aspectRatio: '1 / 1' }}
      />
      <p
        className="script text-center"
        style={{ fontSize: 21, lineHeight: 1.5, color: 'var(--ink)', padding: '2px 0 4px' }}
      >
        {person.name}
      </p>
    </div>
  )
}

export default function Pack() {
  const { next } = useExperience()
  const bagRef = useRef(null)
  const [packed, setPacked] = useState(() => new Set())
  const [drag, setDrag] = useState(null)
  const [last, setLast] = useState(null)
  const [missed, setMissed] = useState(false)

  const all = useMemo(() => WISHES.map((w, i) => ({ ...w, id: i })), [])
  const waiting = all.filter((w) => !packed.has(w.id))
  const slots = waiting.slice(0, 4)
  const full = packed.size === all.length

  const accept = (person) => {
    setPacked((prev) => new Set(prev).add(person.id))
    setLast(person)
    setMissed(false)
  }

  const overMouth = (x, y) => {
    const el = bagRef.current
    if (!el) return false
    const r = el.getBoundingClientRect()
    const m = CONFIG.bagMouth
    const cx = r.left + (r.width * m.x) / 100
    const cy = r.top + (r.height * m.y) / 100
    const rx = (r.width * m.r) / 100
    const ry = rx * 0.95
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
  }

  const onDown = (person, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // fine without it
    }
    setDrag({
      person,
      x: e.clientX,
      y: e.clientY,
      sx: e.clientX,
      sy: e.clientY,
      ox: e.clientX - r.left,
      oy: e.clientY - r.top,
      w: r.width,
    })
  }

  const onMove = (e) => {
    if (!drag) return
    setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d))
  }

  const onUp = (e) => {
    if (!drag) return
    const moved = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy)
    if (moved < TAP_SLOP || overMouth(e.clientX, e.clientY)) accept(drag.person)
    else setMissed(true)
    setDrag(null)
  }

  // ---------- the full bag ----------
  if (full) {
    return (
      <div className="w-full max-w-[400px] mx-auto">
        <Kicker>{all.length} of {all.length}</Kicker>
        <h1 className="script mt-1" style={{ fontSize: 48, lineHeight: 1 }}>
          {PACK.done}
        </h1>
        <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {PACK.doneBody}
        </p>

        <div className="mt-7">
          <Rule />
          {all.map((w) => (
            <div key={w.id}>
              <div className="flex items-start gap-3.5" style={{ padding: '14px 2px' }}>
                <div className="shrink-0" style={{ width: 52 }}>
                  <Polaroid person={w} width={52} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="serif-it" style={{ fontSize: 16, lineHeight: 1.45 }}>
                    {w.wish}
                  </p>
                  <p className="kicker mt-1.5" style={{ color: 'var(--accent)', fontSize: 9 }}>
                    {w.name}
                  </p>
                </div>
              </div>
              <Rule />
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <button className="btn" onClick={next}>
            There is a second gift
          </button>
        </div>
      </div>
    )
  }

  // ---------- packing ----------
  return (
    <div
      className="w-full max-w-[400px] mx-auto"
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="flex items-baseline justify-between">
        <Kicker>Sixteen wishes</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {packed.size} of {all.length} in
        </span>
      </div>

      <h1 className="script mt-1" style={{ fontSize: 46, lineHeight: 1 }}>
        {PACK.title}
      </h1>
      <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-60)' }}>
        {PACK.standfirst}
      </p>

      {/* the polaroids waiting to go in */}
      <div className="grid grid-cols-2 gap-3 mt-5 justify-items-center">
        <AnimatePresence initial={false}>
          {slots.map((w, i) => (
            <motion.button
              key={w.id}
              onPointerDown={(e) => onDown(w, e)}
              className="border-0 p-0 bg-transparent cursor-grab"
              style={{ touchAction: 'none', width: '100%' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: drag?.person.id === w.id ? 0.2 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.22 } }}
              transition={{ duration: 0.35 }}
            >
              <Polaroid person={w} tilt={TILTS[i % TILTS.length]} width="100%" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <p
        className="text-center kicker"
        style={{ color: missed ? 'var(--accent)' : 'var(--ink-40)', fontSize: 9, margin: '18px 0 6px' }}
      >
        {missed ? 'Not in the bag. Try again, or just tap one.' : 'Drag us into the bag · or tap'}
      </p>

      {/* the bag */}
      <div ref={bagRef} className="relative w-full">
        <Photo
          src={CONFIG.photos.bagOpen}
          alt="The bag, open"
          placeholder="OPEN BAG PHOTO"
          className="w-full"
          style={{ aspectRatio: '779 / 900', objectFit: 'contain' }}
        />

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
                boxShadow: 'inset 0 0 0 1.5px rgba(246,241,232,0.85)',
                background: 'rgba(246,241,232,0.12)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* the wish that just went in */}
      <div style={{ minHeight: 88 }} className="mt-1">
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
              <p className="kicker mt-1.5" style={{ color: 'var(--accent)', fontSize: 9 }}>
                {last.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the polaroid that follows her finger */}
      {drag && (
        <div
          className="fixed pointer-events-none z-[70]"
          style={{ left: drag.x - drag.ox, top: drag.y - drag.oy, width: drag.w }}
        >
          <Polaroid person={drag.person} tilt={-3} width="100%" dragging />
        </div>
      )}
    </div>
  )
}

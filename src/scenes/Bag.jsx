import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { frameDistance, usePointerDrag } from '../lib/drag.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'

// GIFT ONE. It gets its own introduction page first: the previous version
// dropped her straight into a drag with no explanation, which read as broken
// rather than playful.
const TRAY = { x: 22, y: 84 } // where the bag waits, clear of her and of the type

export default function Bag() {
  const { go } = useExperience()
  const [step, setStep] = useState('intro') // intro · drag · done
  const frameRef = useRef(null)
  const [attempts, setAttempts] = useState(0)
  const [msg, setMsg] = useState(null)
  const [hint, setHint] = useState(false)
  const [placed, setPlaced] = useState(false)

  const t = CONFIG.bagTarget

  const onDrop = (p) => {
    const r = frameRef.current.getBoundingClientRect()
    const dist = frameDistance(p, t, r.height / r.width)

    if (dist <= t.tolerance) {
      setPos({ x: t.x, y: t.y })
      setPlaced(true)
      setMsg(null)
      setTimeout(() => setStep('done'), 1100)
      return
    }

    setAttempts((a) => a + 1)
    if (dist <= t.tolerance * 2.1) setMsg('Almost. A little higher, onto the shoulder.')
    else setMsg('Not there. Her shoulder, on the right.')
  }

  const { pos, setPos, dragging, handlers } = usePointerDrag(frameRef, { onDrop, initial: TRAY })

  // Nobody should be stuck on their own birthday.
  useEffect(() => {
    if (placed || step !== 'drag') return
    const timer = setTimeout(() => setHint(true), 18000)
    return () => clearTimeout(timer)
  }, [placed, step])
  useEffect(() => {
    if (attempts >= 2) setHint(true)
  }, [attempts])

  const placeForHer = () => {
    setPos({ x: t.x, y: t.y })
    setPlaced(true)
    setMsg(null)
    setTimeout(() => setStep('done'), 1100)
  }

  // ---------- the introduction ----------
  if (step === 'intro') {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <Kicker>Gift one of two</Kicker>
        <h1 className="display mt-2" style={{ fontSize: 40 }}>
          {CONFIG.bag.introTitle}
        </h1>
        <Rule style={{ marginTop: 18 }} />
        <p className="mt-4" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-60)' }}>
          {CONFIG.bag.introBody}
        </p>

        {/* what she is about to be asked to do, shown rather than described */}
        <div className="mt-6 flex items-center gap-4">
          <div style={{ width: 92 }}>
            <Photo
              src={CONFIG.photos.bag}
              alt="The bag"
              placeholder="BAG"
              className="w-full anim-float"
              style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
            />
          </div>
          <span className="display" style={{ fontSize: 26, color: 'var(--ink-40)' }}>
            →
          </span>
          <div style={{ width: 78 }}>
            <Photo
              src={CONFIG.photos.her}
              alt={CONFIG.name}
              placeholder="HER"
              objectPosition="center 25%"
              className="w-full"
              style={{ aspectRatio: '3 / 4', borderRadius: 2 }}
            />
          </div>
        </div>

        <p className="kicker mt-5" style={{ color: 'var(--accent)' }}>
          Your task · {CONFIG.bag.task}
        </p>

        <div className="mt-6 flex justify-center">
          <button className="btn btn-accent" onClick={() => setStep('drag')}>
            Open the cover shoot
          </button>
        </div>
      </div>
    )
  }

  // ---------- the payoff ----------
  if (step === 'done') {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative w-full">
            <Photo
              src={CONFIG.photos.her}
              alt={CONFIG.name}
              placeholder="HER PHOTO"
              objectPosition="center 30%"
              className="w-full"
              style={{ aspectRatio: '4 / 5', borderRadius: 3 }}
            />
            <div
              className="absolute"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: `${t.size}%`,
                transform: `translate(-50%, -50%) rotate(${t.rotation}deg)`,
              }}
            >
              <Photo
                src={CONFIG.photos.bag}
                alt="The bag"
                placeholder="BAG"
                className="w-full"
                style={{ aspectRatio: '1 / 1', objectFit: 'contain', filter: 'drop-shadow(0 8px 14px rgba(26,20,24,0.3))' }}
              />
            </div>
          </div>

          <Kicker className="mt-5">Cover complete</Kicker>
          <h1 className="display mt-2" style={{ fontSize: 40 }}>
            {CONFIG.bag.title}
          </h1>
          <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-60)' }}>
            {CONFIG.bag.body}
          </p>

          <div className="mt-7 flex justify-center">
            <button className="btn" onClick={() => go('spa')}>
              There is a second gift
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ---------- the drag ----------
  return (
    <div className="w-full max-w-[380px] mx-auto">
      <div className="flex items-baseline justify-between">
        <Kicker>The cover shoot</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {placed ? 'Complete' : 'Incomplete'}
        </span>
      </div>

      <p className="mt-2" style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-60)' }}>
        {CONFIG.bag.task}.
      </p>

      <div ref={frameRef} className="relative w-full mt-4" style={{ borderRadius: 3, overflow: 'hidden' }}>
        <Photo
          src={CONFIG.photos.her}
          alt={CONFIG.name}
          placeholder="HER PHOTO"
          objectPosition="center 30%"
          className="w-full"
          style={{ aspectRatio: '4 / 5' }}
        />

        {/* where it goes, shown only once she has been hunting a while */}
        <AnimatePresence>
          {!placed && hint && (
            <motion.span
              className="absolute anim-ring pointer-events-none"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: 64,
                height: 64,
                marginLeft: -32,
                marginTop: -32,
                borderRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.95)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* the bag */}
        <motion.div
          {...handlers}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${t.size}%`,
            translateX: '-50%',
            translateY: '-50%',
            touchAction: 'none',
            cursor: placed ? 'default' : dragging ? 'grabbing' : 'grab',
            zIndex: 30,
          }}
          animate={{ scale: dragging ? 1.08 : 1, rotate: placed ? t.rotation : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          <div
            className={!dragging && !placed ? 'anim-float' : ''}
            style={{
              filter: dragging
                ? 'drop-shadow(0 16px 20px rgba(26,20,24,0.42))'
                : 'drop-shadow(0 8px 14px rgba(26,20,24,0.3))',
            }}
          >
            <Photo
              src={CONFIG.photos.bag}
              alt="The bag"
              placeholder="BAG"
              className="w-full"
              style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
            />
          </div>

          {/* dev helper: read the coordinates off the screen for config.js */}
          {import.meta.env.DEV && !placed && (
            <span
              className="kicker absolute whitespace-nowrap"
              style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--accent)' }}
            >
              x {pos.x.toFixed(0)} · y {pos.y.toFixed(0)}
            </span>
          )}
        </motion.div>
      </div>

      <div style={{ minHeight: 52 }} className="mt-3 text-center">
        {placed ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kicker">
            That is the shot
          </motion.p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: msg ? 'var(--accent)' : 'var(--ink-40)' }}>
              {msg || 'Drag it up onto her shoulder.'}
            </p>
            {attempts >= 3 && (
              <button className="link" onClick={placeForHer}>
                do it for me
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

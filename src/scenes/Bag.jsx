import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { frameDistance, usePointerDrag } from '../lib/drag.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'

// GIFT ONE, in four beats: why, the drag onto her shoulder in the glossy shot,
// then "too much" and she rubs that version off to find the real photograph
// underneath, crocs and all, with the bag still on her.
const TRAY = { x: 22, y: 84 } // where the bag waits, clear of her and of the type

// Paint an image into a canvas the way CSS `object-fit: cover` with
// `object-position: center <focusY>` would, so the canvas layer lines up
// exactly with the photograph rendered behind it.
function drawCover(ctx, img, W, H, focusY = 0.3) {
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (W - dw) / 2, (H - dh) * focusY, dw, dh)
}

function Wipe({ src, focusY, onDone }) {
  const canvasRef = useRef(null)
  const lastRef = useRef(null)
  const ticks = useRef(0)
  const [rubbing, setRubbing] = useState(false)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const rect = c.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = Math.round(rect.width * dpr)
    c.height = Math.round(rect.height * dpr)
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.scale(dpr, dpr)

    const img = new Image()
    img.onload = () => drawCover(ctx, img, rect.width, rect.height, focusY)
    img.src = import.meta.env.BASE_URL + src
  }, [src, focusY])

  const rub = (e) => {
    const c = canvasRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 62
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
    ctx.arc(x, y, 31, 0, Math.PI * 2)
    ctx.fill()
    lastRef.current = { x, y }

    ticks.current += 1
    if (ticks.current % 10 !== 0) return
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 80) {
      total += 1
      if (data[i] < 40) clear += 1
    }
    if (clear / total > 0.62) onDone()
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none', cursor: 'grab', zIndex: 20 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // fine without it
        }
        setRubbing(true)
        lastRef.current = null
        rub(e)
      }}
      onPointerMove={(e) => rubbing && rub(e)}
      onPointerUp={() => {
        setRubbing(false)
        lastRef.current = null
      }}
      onPointerCancel={() => {
        setRubbing(false)
        lastRef.current = null
      }}
    />
  )
}

export default function Bag() {
  const { next } = useExperience()
  const [step, setStep] = useState(() => {
    if (import.meta.env.DEV) {
      const q = new URLSearchParams(window.location.search).get('step')
      if (q === 'drag' || q === 'oops' || q === 'done') return q
    }
    return 'intro'
  }) // intro · drag · oops · done
  const frameRef = useRef(null)
  const [attempts, setAttempts] = useState(0)
  const [msg, setMsg] = useState(null)
  const [hint, setHint] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [wiped, setWiped] = useState(false)

  const t = CONFIG.bagTarget

  const onDrop = (p) => {
    const r = frameRef.current.getBoundingClientRect()
    const dist = frameDistance(p, t, r.height / r.width)

    if (dist <= t.tolerance) {
      setPos({ x: t.x, y: t.y })
      setPlaced(true)
      setMsg(null)
      setTimeout(() => setStep('oops'), 1100)
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
    setTimeout(() => setStep('oops'), 1100)
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

  // ---------- "too much": rub the glossy version off ----------
  if (step === 'oops') {
    const tr = CONFIG.bagTargetReal
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <Kicker>{wiped ? 'Final' : 'Second thoughts'}</Kicker>
        <h1 className="display mt-2" style={{ fontSize: 36, lineHeight: 1.02 }}>
          {wiped ? CONFIG.bag.title : CONFIG.bag.oopsTitle}
        </h1>
        <p className="mt-2.5" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {wiped ? CONFIG.bag.body : CONFIG.bag.oopsBody}
        </p>

        <div
          className="relative w-full mt-5"
          style={{ borderRadius: 3, overflow: 'hidden', aspectRatio: '4 / 5' }}
        >
          {/* the real photograph, waiting underneath */}
          <Photo
            src={CONFIG.photos.herReal}
            alt={CONFIG.name}
            placeholder="THE REAL PHOTO"
            objectPosition="center center"
            className="absolute inset-0 w-full h-full"
          />

          {/* the bag: on her shoulder in the glossy shot, on her hand in the
              real one. It moves across when the glossy version comes off. */}
          <motion.div
            className="absolute"
            style={{ width: `${wiped ? tr.size : t.size}%`, zIndex: 30 }}
            animate={{
              left: `${wiped ? tr.x : t.x}%`,
              top: `${wiped ? tr.y : t.y}%`,
              rotate: wiped ? tr.rotation : t.rotation,
              x: '-50%',
              y: '-50%',
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: wiped ? 0.15 : 0 }}
          >
            <div style={{ filter: 'drop-shadow(0 8px 14px rgba(28,25,23,0.32))' }}>
              <Photo
                src={CONFIG.photos.bag}
                alt="The bag"
                placeholder="BAG"
                className="w-full"
                style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
              />
            </div>

            {import.meta.env.DEV && wiped && (
              <span
                className="kicker absolute whitespace-nowrap"
                style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--accent)' }}
              >
                real target · x {tr.x} · y {tr.y}
              </span>
            )}
          </motion.div>

          {/* the glossy version, painted on top to be rubbed away */}
          <AnimatePresence>
            {!wiped && (
              <Wipe src={CONFIG.photos.her} focusY={0.3} onDone={() => setWiped(true)} />
            )}
          </AnimatePresence>
        </div>

        <div style={{ minHeight: 58 }} className="mt-4 text-center">
          {!wiped ? (
            <>
              <motion.p
                className="script"
                style={{ fontSize: 28, color: 'var(--accent)' }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {CONFIG.bag.oopsCue}
              </motion.p>
              <button className="link" onClick={() => setWiped(true)}>
                or just take it off
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button className="btn" onClick={() => setStep('done')}>
                Now open it
              </button>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // ---------- the payoff ----------
  if (step === 'done') {
    const tr = CONFIG.bagTargetReal
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative w-full">
            <Photo
              src={CONFIG.photos.herReal}
              alt={CONFIG.name}
              placeholder="THE REAL PHOTO"
              objectPosition="center center"
              className="w-full"
              style={{ aspectRatio: '4 / 5', borderRadius: 3 }}
            />
            <div
              className="absolute"
              style={{
                left: `${tr.x}%`,
                top: `${tr.y}%`,
                width: `${tr.size}%`,
                transform: `translate(-50%, -50%) rotate(${tr.rotation}deg)`,
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
            <button className="btn" onClick={next}>
              Now open it
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

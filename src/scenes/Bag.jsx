import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { frameDistance, usePointerDrag } from '../lib/drag.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'
import Action from '../components/Action.jsx'
import Next from '../components/Next.jsx'

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

function Wipe({ src, focusY, onDone, onReady }) {
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
    img.onload = () => {
      drawCover(ctx, img, rect.width, rect.height, focusY)
      onReady?.()
    }
    img.src = import.meta.env.BASE_URL + src
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (q === 'drag' || q === 'oops' || q === 'shoot') return 'shoot'
    }
    return 'intro'
  }) // intro · shoot
  const frameRef = useRef(null)
  const [attempts, setAttempts] = useState(0)
  const [msg, setMsg] = useState(null)
  const [hint, setHint] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [wiped, setWiped] = useState(false)
  const [wipeReady, setWipeReady] = useState(false)
  const [shot, setShot] = useState(0)

  const t = CONFIG.bagTarget
  useCta(wiped ? { onClick: next, label: 'Look inside the bag' } : null, [wiped, next])

  const onDrop = (p) => {
    const r = frameRef.current.getBoundingClientRect()
    const dist = frameDistance(p, t, r.height / r.width)

    if (dist <= t.tolerance) {
      setPos({ x: t.x, y: t.y })
      setPlaced(true)
      setMsg(null)
        return
    }

    setAttempts((a) => a + 1)
    if (dist <= t.tolerance * 2.1) setMsg('Almost. A little higher, onto the shoulder.')
    else setMsg('Not there. Her shoulder, on the right.')
  }

  const { pos, setPos, dragging, handlers } = usePointerDrag(frameRef, { onDrop, initial: TRAY })

  // Nobody should be stuck on their own birthday.
  useEffect(() => {
    if (placed || step !== 'shoot') return
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
  }

  // ---------- the product page ----------
  // Framed as a listing rather than "finish the cover": that callback sat
  // eight pages away from its setup, which is too far to remember, and she
  // needs to see the thing clearly before it is handed over.
  if (step === 'intro') {
    const shots = CONFIG.photos.bagShots || [CONFIG.photos.bag]
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <Kicker>{CONFIG.bag.announceKicker}</Kicker>
        <h1 className="display mt-2" style={{ fontSize: 40, lineHeight: 1 }}>
          {CONFIG.bag.announceTitle}
        </h1>
        <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {CONFIG.bag.announceBody}
        </p>

        <div className="flex items-baseline justify-between mt-6">
          <span className="kicker" style={{ color: 'var(--ink-40)' }}>
            The one
          </span>
          <span className="kicker" style={{ color: 'var(--ink-40)' }}>
            {CONFIG.bag.brand}
          </span>
        </div>

        {/* the main shot */}
        <div
          className="relative w-full mt-3 overflow-hidden"
          style={{ background: '#EFECE7', borderRadius: 2, aspectRatio: '1 / 1' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={shot}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Photo
                src={shots[shot]}
                alt={CONFIG.bag.name}
                placeholder="THE BAG"
                className="w-full h-full"
                style={{ objectFit: 'contain', padding: '8%' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* thumbnails */}
        {shots.length > 1 && (
          <div className="flex gap-2 mt-2">
            {shots.map((src, i) => (
              <button
                key={i}
                onClick={() => setShot(i)}
                className="border-0 p-0 overflow-hidden"
                style={{
                  width: 54,
                  height: 54,
                  background: '#EFECE7',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: i === shot ? 'inset 0 0 0 1.5px var(--ink)' : 'inset 0 0 0 1px var(--hair)',
                }}
                aria-label={`View ${i + 1}`}
              >
                <Photo
                  src={src}
                  alt=""
                  placeholder=""
                  className="w-full h-full"
                  style={{ objectFit: 'contain', padding: 5 }}
                />
              </button>
            ))}
          </div>
        )}

        {/* the listing, kept to the name and one line */}
        <h2 className="display mt-5" style={{ fontSize: 27, lineHeight: 1.05 }}>
          {CONFIG.bag.name}
        </h2>

        <Rule style={{ marginTop: 16, marginBottom: 16 }} />

        <h2 className="script" style={{ fontSize: 29, lineHeight: 1.1 }}>
          {CONFIG.bag.introTitle}
        </h2>
        <p className="mt-3" style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {CONFIG.bag.introBody}
        </p>
        <p className="script mt-2" style={{ fontSize: 17, color: 'var(--accent)' }}>
          ({CONFIG.bag.status})
        </p>

        <div className="mt-7 flex justify-center">
          <Action onClick={() => setStep('shoot')} label={CONFIG.bag.task} icon="hand" delay={0.2} />
        </div>
      </div>
    )
  }
  // ---------- the shoot: drag, then wipe, in one view ----------
  // These used to be two steps that swapped, which unmounted the frame, the
  // photograph and the bag and put them straight back: a cut, not a change.
  // Nothing unmounts now, so the copy crossfades and the picture stays put.
  const tr = CONFIG.bagTargetReal
  const copies = [
    { key: 'try', title: `${CONFIG.bag.task}.`, body: `${CONFIG.bag.dragHint}.`, on: !placed },
    { key: 'oops', title: CONFIG.bag.oopsTitle, body: CONFIG.bag.oopsBody, on: placed && !wiped },
    { key: 'done', title: CONFIG.bag.title, body: CONFIG.bag.body, on: wiped },
  ]

  return (
    <div className="w-full max-w-[380px] mx-auto">
      {/* all three lines share one grid cell: the block is as tall as the
          tallest of them, so the photograph below never moves */}
      <div className="grid mt-2">
        {copies.map((c) => (
          <motion.div
            key={c.key}
            style={{ gridArea: '1 / 1' }}
            initial={{ opacity: c.on ? 1 : 0 }}
            animate={{ opacity: c.on ? 1 : 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            aria-hidden={!c.on}
          >
            <h1 className="display" style={{ fontSize: 36, lineHeight: 1.02 }}>
              {c.title}
            </h1>
            {c.body && (
              <p className="mt-2.5" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
                {c.body}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      <div
        ref={frameRef}
        className="relative w-full mt-4"
        style={{ borderRadius: 3, overflow: 'hidden', aspectRatio: '4 / 5' }}
      >
        {/* the daylight photograph, underneath the whole time */}
        <Photo
          src={CONFIG.photos.herReal}
          alt={CONFIG.name}
          placeholder="THE REAL PHOTO"
          objectPosition="center center"
          className="absolute inset-0 w-full h-full"
        />

        {/* the glossy one: an image while she drags, and a canvas to rub once
            the bag is on her. The image stays until the canvas has painted,
            or the daylight photo would flash through for a frame or two. */}
        {!wiped && (
          <img
            src={import.meta.env.BASE_URL + CONFIG.photos.her}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'center 30%',
              zIndex: 18,
              opacity: placed && wipeReady ? 0 : 1,
              transition: 'opacity 0.25s',
            }}
          />
        )}

        <AnimatePresence>
          {placed && !wiped && (
            <Wipe
              src={CONFIG.photos.her}
              focusY={0.3}
              onDone={() => setWiped(true)}
              onReady={() => setWipeReady(true)}
            />
          )}
        </AnimatePresence>

        {/* where it goes, once she has been hunting a while */}
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
                zIndex: 25,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* the bag: her finger while she drags, then the shoulder, then her
            hand in the daylight photograph */}
        <motion.div
          {...(placed ? {} : handlers)}
          className="absolute"
          style={{
            width: `${wiped ? tr.size : t.size}%`,
            translateX: '-50%',
            translateY: '-50%',
            touchAction: 'none',
            cursor: placed ? 'default' : dragging ? 'grabbing' : 'grab',
            zIndex: 30,
          }}
          initial={false}
          animate={{
            left: `${placed ? (wiped ? tr.x : t.x) : pos.x}%`,
            top: `${placed ? (wiped ? tr.y : t.y) : pos.y}%`,
            rotate: wiped ? tr.rotation : placed ? t.rotation : 0,
            scale: dragging ? 1.08 : 1,
          }}
          transition={placed ? { type: 'spring', stiffness: 120, damping: 16 } : { duration: 0 }}
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

          {/* dev helper: the coordinates to paste into config */}
          {import.meta.env.DEV && dragging && (
            <span
              className="kicker absolute whitespace-nowrap"
              style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--accent)' }}
            >
              x {pos.x.toFixed(0)} · y {pos.y.toFixed(0)}
            </span>
          )}
        </motion.div>
      </div>

      {/* what to do, or what just went wrong */}
      <div style={{ minHeight: 78 }} className="mt-3 text-center">
        <AnimatePresence mode="wait">
          {!placed ? (
            <motion.div key="drag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
              <p style={{ fontSize: 14, color: 'var(--accent)', minHeight: 21 }}>{msg || '\u00A0'}</p>
              {attempts >= 3 && (
                <button className="link" onClick={placeForHer}>
                  do it for me
                </button>
              )}
            </motion.div>
          ) : !wiped ? (
            <motion.div key="wipe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
              <motion.p
                className="script"
                style={{ fontSize: 19, lineHeight: 1.35, color: 'var(--accent)' }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {CONFIG.bag.oopsCue}
              </motion.p>
              <button className="link" onClick={() => setWiped(true)}>
                or just show me
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

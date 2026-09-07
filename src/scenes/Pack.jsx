import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience, useCta } from '../experience.js'
import { CONFIG, MEMORIES, PACK } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'
import Action from '../components/Action.jsx'

// A pile of photographs, the way they actually come out of a drawer: overlapping,
// at angles, top one first. She flicks through. Dragging each one into the bag
// and reading a caption each time was too much machinery for what this is.
const FLICK = 70 // px of travel that counts as a flick rather than a tap

// Deterministic scatter, so the pile never reshuffles on re-render.
const tiltFor = (i) => ((i * 37) % 15) - 7
const offsetFor = (i) => ({ x: ((i * 53) % 17) - 8, y: ((i * 29) % 13) - 6 })

function Polaroid({ memory, style, dragging, playing = false }) {
  const videoRef = useRef(null)

  // A clip has to be started and stopped by hand. The autoplay attribute is
  // only read when the element loads, and these mount at the back of the pile
  // where they are not playing yet, so by the time a card reaches the top
  // flipping the attribute does nothing at all.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [playing])

  return (
    <div
      style={{
        background: '#FFFDF9',
        padding: '9px 9px 0',
        boxShadow: dragging ? '0 22px 40px rgba(28,25,23,0.32)' : '0 6px 18px rgba(28,25,23,0.2)',
        ...style,
      }}
    >
      {memory.video ? (
        // Muted and looping, and only while it is the card on top: several
        // clips decoding at once for the sake of the pile behind is waste.
        <video
          ref={videoRef}
          src={import.meta.env.BASE_URL + memory.video}
          poster={import.meta.env.BASE_URL + memory.photo}
          muted
          loop
          playsInline
          preload="auto"
          className="w-full block"
          style={{ aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: memory.focus || 'center 35%' }}
        />
      ) : (
        <Photo
          src={memory.photo}
          alt={memory.caption || 'A photograph'}
          placeholder="PHOTO"
          objectPosition={memory.focus || 'center 35%'}
          className="w-full block"
          style={{ aspectRatio: '1 / 1' }}
        />
      )}
      {/* the white lip a polaroid has, carrying the occasion if there is one.
          No names: these are group shots, so one name on one of them only
          raises the question of which person it refers to. */}
      <div className="grid place-items-center" style={{ height: memory.caption ? 40 : 26 }}>
        {memory.caption && (
          <p className="script text-center" style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--ink)' }}>
            {memory.caption}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Pack() {
  const { next } = useExperience()
  const [step, setStep] = useState('empty') // empty · deck
  const [i, setI] = useState(0)
  // True for the first moment of the deck, so the photographs can be animated
  // up out of the bag instead of simply being there. Refills after that use
  // the ordinary settle.
  const [emerging, setEmerging] = useState(false)
  const all = useMemo(() => MEMORIES.map((m, idx) => ({ ...m, id: idx })), [])
  const done = step === 'deck' && i >= all.length
  // Only the page turn goes in the navigation slot; filling the bag is an
  // action and gets a labelled button of its own, next to the bag.
  useCta(done ? { onClick: next } : null, [done, next])

  const openDeck = () => {
    setStep('deck')
    setEmerging(true)
    setTimeout(() => setEmerging(false), 1200)
  }

  // ---------- the bag, empty ----------
  // Arriving straight at a deck of photographs after the reveal was abrupt:
  // this gives the bag a beat of its own, and something to be filled.
  if (step === 'empty') {
    return (
      <div className="w-full max-w-[380px] mx-auto text-center">
        <h1 className="script" style={{ fontSize: 30, lineHeight: 1.15 }}>
          {PACK.emptyTitle}
        </h1>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Photo
            src={CONFIG.photos.bagOpen}
            alt="The bag, open and empty"
            placeholder="OPEN BAG PHOTO"
            className="w-full anim-float"
            style={{ aspectRatio: '779 / 900', objectFit: 'contain' }}
          />
        </motion.div>

        <div className="flex justify-center mt-2">
          <Action onClick={openDeck} label={PACK.emptyCta} icon="plus" delay={0.5} />
        </div>
      </div>
    )
  }
  const visible = all.slice(i, i + 4)

  const advance = () => setI((n) => Math.min(all.length, n + 1))

  // ---------- through the whole pile ----------
  if (done) {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <Kicker>{all.length} of {all.length}</Kicker>
        <h1 className="script mt-1" style={{ fontSize: 29, lineHeight: 1.15 }}>
          {PACK.done}
        </h1>
        <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {PACK.doneBody}
        </p>

        <div className="relative mt-6">
          <Photo
            src={CONFIG.photos.bagOpen}
            alt="The bag, open"
            placeholder="OPEN BAG PHOTO"
            className="w-full"
            style={{ aspectRatio: '779 / 900', objectFit: 'contain' }}
          />

          {/* the pile, tucked into the mouth of the bag */}
          {all.slice(0, 5).map((p, n) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{
                left: `${CONFIG.bagMouth.x}%`,
                top: `${CONFIG.bagMouth.y}%`,
                width: '30%',
                zIndex: 5 - n,
              }}
              initial={{ x: '-50%', y: '-190%', rotate: tiltFor(n), opacity: 0 }}
              animate={{
                x: '-50%',
                y: `${-58 + n * 5}%`,
                rotate: tiltFor(n) * 0.7,
                opacity: 1,
              }}
              transition={{ delay: 0.35 + n * 0.11, type: 'spring', stiffness: 130, damping: 15 }}
            >
              <Polaroid memory={p} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <button className="link" onClick={() => setI(0)}>
            look through them again
          </button>
        </div>
      </div>
    )
  }

  // ---------- the pile ----------
  return (
    <div className="w-full max-w-[380px] mx-auto">
      <div className="flex items-baseline justify-between">
        <Kicker>Our memories</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {i + 1} / {all.length}
        </span>
      </div>

      <h1 className="script mt-1" style={{ fontSize: 26, lineHeight: 1.2 }}>
        {PACK.title}
      </h1>

      {/* the stack: four deep, scattered, top one live */}
      <div className="relative w-full mt-7" style={{ paddingBottom: '112%' }}>
        <AnimatePresence>
          {visible
            .map((p, depth) => {
              const isTop = depth === 0
              const off = offsetFor(p.id)
              return (
                <motion.div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: '6%',
                    right: '6%',
                    top: 0,
                    zIndex: 10 - depth,
                    cursor: isTop ? 'grab' : 'default',
                    touchAction: 'none',
                  }}
                  drag={isTop}
                  dragMomentum={false}
                  dragElastic={0.5}
                  onClick={() => isTop && advance()}
                  onDragEnd={(e, info) => {
                    if (!isTop) return
                    if (Math.hypot(info.offset.x, info.offset.y) > FLICK) advance()
                  }}
                  initial={
                    emerging
                      ? {
                          // out of the mouth of the bag, which sat below
                          opacity: 0,
                          y: 300,
                          scale: 0.4,
                          rotate: p.id % 2 ? 26 : -26,
                        }
                      : { opacity: 0, scale: 0.94 }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1 - depth * 0.02,
                    x: off.x * (depth + 1) * 0.5,
                    y: off.y * (depth + 1) * 0.5 + depth * 7,
                    rotate: tiltFor(p.id) * (depth ? 1 : 0.4),
                  }}
                  exit={{
                    x: (tiltFor(p.id) > 0 ? 1 : -1) * 340,
                    y: -70,
                    rotate: tiltFor(p.id) * 2.4,
                    opacity: 0,
                    transition: { duration: 0.38 },
                  }}
                  transition={
                    emerging
                      ? { type: 'spring', stiffness: 120, damping: 15, delay: (3 - depth) * 0.13 }
                      : { type: 'spring', stiffness: 200, damping: 22 }
                  }
                  whileDrag={{ scale: 1.03 }}
                >
                  <Polaroid memory={p} dragging={isTop} playing={isTop} />
                </motion.div>
              )
            })
            .reverse()}
        </AnimatePresence>
      </div>

      <Rule />
      <p className="kicker text-center mt-3" style={{ color: 'var(--ink-40)', fontSize: 9 }}>
        Tap or flick the top one away
      </p>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG, PACK, PEOPLE } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'
import Next from '../components/Next.jsx'

// A pile of photographs, the way they actually come out of a drawer: overlapping,
// at angles, top one first. She flicks through. Dragging each one into the bag
// and reading a caption each time was too much machinery for what this is.
const FLICK = 70 // px of travel that counts as a flick rather than a tap

// Deterministic scatter, so the pile never reshuffles on re-render.
const tiltFor = (i) => ((i * 37) % 15) - 7
const offsetFor = (i) => ({ x: ((i * 53) % 17) - 8, y: ((i * 29) % 13) - 6 })

function Polaroid({ person, style, dragging }) {
  return (
    <div
      style={{
        background: '#FFFDF9',
        padding: '9px 9px 0',
        boxShadow: dragging ? '0 22px 40px rgba(28,25,23,0.32)' : '0 6px 18px rgba(28,25,23,0.2)',
        ...style,
      }}
    >
      <Photo
        src={person.photo}
        alt={person.name || 'A photograph'}
        placeholder="PHOTO"
        objectPosition={person.focus || 'center 35%'}
        className="w-full block"
        style={{ aspectRatio: '1 / 1' }}
      />
      <div className="grid place-items-center" style={{ height: 44 }}>
        {person.name && (
          <p className="script text-center" style={{ fontSize: 22, lineHeight: 1, color: 'var(--ink)' }}>
            {person.name}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Pack() {
  const { next } = useExperience()
  const [i, setI] = useState(0)
  const all = useMemo(() => PEOPLE.map((p, idx) => ({ ...p, id: idx })), [])
  const done = i >= all.length
  const visible = all.slice(i, i + 4)

  const advance = () => setI((n) => Math.min(all.length, n + 1))

  // ---------- through the whole pile ----------
  if (done) {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <Kicker>{all.length} of {all.length}</Kicker>
        <h1 className="script mt-1" style={{ fontSize: 44, lineHeight: 1.05 }}>
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
              <Polaroid person={p} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Next onClick={next} tone="accent" label="One more gift" />
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
        <Kicker>Sixteen of us</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {i + 1} / {all.length}
        </span>
      </div>

      <h1 className="script mt-1" style={{ fontSize: 44, lineHeight: 1.05 }}>
        {PACK.title}
      </h1>
      <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-60)' }}>
        {PACK.standfirst}
      </p>

      {/* the stack: four deep, scattered, top one live */}
      <div className="relative w-full mt-7" style={{ paddingBottom: '112%' }}>
        <AnimatePresence initial={false}>
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
                  initial={{ opacity: 0, scale: 0.94 }}
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
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  whileDrag={{ scale: 1.03 }}
                >
                  <Polaroid person={p} dragging={isTop} />
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

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { TAROT } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'
import Next from '../components/Next.jsx'

// A three card spread for the year, plus one the deck insisted on. This page
// used to be three black boxes reading "Turn it over", which is a card trick
// with no cards in it.

// The back of the deck: cross-hatch and a rosette, printed like the fronts.
function CardBack() {
  return (
    <svg viewBox="0 0 100 172" className="w-full h-full block" aria-hidden="true">
      <defs>
        <pattern id="lattice" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H8 M0 4 H8" stroke="rgba(246,241,232,0.22)" strokeWidth="0.8" fill="none" />
          <path d="M0 0 V8 M4 0 V8" stroke="rgba(246,241,232,0.14)" strokeWidth="0.8" fill="none" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="172" fill="#F6F1E8" />
      <rect x="3" y="3" width="94" height="166" fill="#23201D" />
      <rect x="3" y="3" width="94" height="166" fill="url(#lattice)" />
      <rect x="8" y="8" width="84" height="156" fill="none" stroke="#F6F1E8" strokeWidth="0.7" opacity="0.5" />
      {/* rosette */}
      <g transform="translate(50 86)">
        <circle r="19" fill="none" stroke="#B5342A" strokeWidth="1.4" />
        <circle r="13" fill="none" stroke="#F6F1E8" strokeWidth="0.7" opacity="0.6" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d="M0 -19 L4 -6 L0 0 L-4 -6 Z"
            fill="#B5342A"
            opacity="0.85"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="3" fill="#F6F1E8" />
      </g>
    </svg>
  )
}

function Card({ card, flipped, onFlip, delay = 0 }) {
  return (
    <motion.button
      onClick={onFlip}
      className="relative w-full border-0 p-0 bg-transparent"
      style={{ aspectRatio: '100 / 172', cursor: flipped ? 'default' : 'pointer', perspective: 900 }}
      aria-label={flipped ? card.name : `Turn over: ${card.position}`}
      initial={{ opacity: 0, y: 14, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileTap={flipped ? undefined : { scale: 0.97 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', boxShadow: '0 6px 16px rgba(28,25,23,0.22)' }}
        >
          <CardBack />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#F6F1E8',
            padding: 3,
            boxShadow: '0 6px 16px rgba(28,25,23,0.22)',
          }}
        >
          <Photo
            src={card.image}
            alt={card.name}
            placeholder={card.name}
            className="w-full h-full block"
          />
        </div>
      </motion.div>
    </motion.button>
  )
}

export default function Year() {
  const { next } = useExperience()
  const [flipped, setFlipped] = useState(() => new Set())
  const [last, setLast] = useState(null)
  const [bonusFlipped, setBonusFlipped] = useState(false)

  const allFlipped = flipped.size === TAROT.cards.length

  const flip = (i) => {
    if (flipped.has(i)) {
      setLast(i)
      return
    }
    setFlipped((prev) => new Set(prev).add(i))
    setLast(i)
  }

  const shown = last === null ? null : TAROT.cards[last]

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Kicker>{TAROT.kicker}</Kicker>
      <h1 className="display mt-2" style={{ fontSize: 40, lineHeight: 1 }}>
        {TAROT.title}
      </h1>
      <p className="serif-it mt-3" style={{ fontSize: 16.5, lineHeight: 1.45, color: 'var(--ink-60)' }}>
        {TAROT.standfirst}
      </p>

      {/* the spread */}
      <div className="grid grid-cols-3 gap-2.5 mt-6">
        {TAROT.cards.map((c, i) => (
          <div key={i}>
            <Card card={c} flipped={flipped.has(i)} onFlip={() => flip(i)} delay={0.1 + i * 0.12} />
            <p
              className="kicker text-center mt-2"
              style={{ fontSize: 8, color: last === i ? 'var(--accent)' : 'var(--ink-40)' }}
            >
              {c.position}
            </p>
          </div>
        ))}
      </div>

      {/* the reading for whichever card she just turned */}
      <div style={{ minHeight: 132 }} className="mt-3">
        <AnimatePresence mode="wait">
          {shown ? (
            <motion.div
              key={last}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Rule />
              <p className="script mt-3" style={{ fontSize: 32, lineHeight: 1, color: 'var(--accent)' }}>
                {shown.name}
              </p>
              <p className="mt-2" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
                {shown.reading}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="cue"
              className="script text-center"
              style={{ fontSize: 26, color: 'var(--accent)', marginTop: 18 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
            >
              {TAROT.cue}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* the card nobody asked for */}
      <AnimatePresence>
        {allFlipped && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Rule />
            <p className="serif-it mt-4" style={{ fontSize: 16, color: 'var(--ink-60)' }}>
              {TAROT.bonus.intro}
            </p>

            <div className="flex items-start gap-4 mt-3">
              <div className="shrink-0" style={{ width: 96 }}>
                <Card
                  card={TAROT.bonus}
                  flipped={bonusFlipped}
                  onFlip={() => setBonusFlipped(true)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  {bonusFlipped ? (
                    <motion.div
                      key="read"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.45 }}
                    >
                      <p className="script" style={{ fontSize: 30, lineHeight: 1, color: 'var(--accent)' }}>
                        {TAROT.bonus.name}
                      </p>
                      <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-60)' }}>
                        {TAROT.bonus.reading}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="cue"
                      className="script"
                      style={{ fontSize: 24, color: 'var(--accent)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      this one too
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {bonusFlipped && (
              <motion.div
                className="mt-7 flex justify-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Next onClick={next} delay={0.1} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

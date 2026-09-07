import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { TAROT } from '../config.js'
import { Photo, Rule } from '../components/Paper.jsx'

// A deck rather than a row. Three cards across were too small to see the art
// and the extra card arriving at the end grew the page, which shifted the
// other three upward; a stack has a fixed footprint whatever is left in it.
//
// She taps the top card to turn it, taps again to send it away, and the one
// the deck insisted on turns itself.

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
      <g transform="translate(50 86)">
        <circle r="19" fill="none" stroke="#B5342A" strokeWidth="1.4" />
        <circle r="13" fill="none" stroke="#F6F1E8" strokeWidth="0.7" opacity="0.6" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d="M0 -19 L4 -6 L0 0 L-4 -6 Z" fill="#B5342A" opacity="0.85" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="3" fill="#F6F1E8" />
      </g>
    </svg>
  )
}

const tiltFor = (i) => ((i * 29) % 9) - 4

export default function Year() {
  const { next } = useExperience()
  const deck = useMemo(
    () => [...TAROT.cards, { ...TAROT.bonus, auto: true }],
    [],
  )
  const [i, setI] = useState(0)
  const [turned, setTurned] = useState(false)
  const timers = useRef([])

  const card = deck[i]
  const done = i >= deck.length
  const lastTurned = i === deck.length - 1 && turned

  useCta(lastTurned || done ? { onClick: next } : null, [lastTurned, done, next])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // the one the deck insisted on turns itself
  useEffect(() => {
    if (!card?.auto || turned) return
    const t = setTimeout(() => setTurned(true), 900)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [card, turned])

  const tap = () => {
    if (!card) return
    if (!turned) {
      setTurned(true)
      return
    }
    if (card.auto) return // the last one stays; the arrow takes her on
    setI((n) => n + 1)
    setTurned(false)
  }

  const visible = deck.slice(i, i + 3)

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h1 className="display" style={{ fontSize: 38, lineHeight: 1.05 }}>
        {TAROT.title}
      </h1>
      <p className="serif-it mt-3" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-60)' }}>
        {TAROT.standfirst}
      </p>

      {/* which card this is, or the line before the extra one */}
      <div className="mt-6 text-center" style={{ height: 22 }}>
        <AnimatePresence mode="wait">
          {card && (
            <motion.p
              key={i}
              className="kicker"
              style={{ color: card.auto ? 'var(--accent)' : 'var(--ink-40)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {card.position}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* the deck: one card live, the rest of it stacked behind */}
      <div className="relative mx-auto mt-3" style={{ width: '62%', paddingBottom: '107%' }}>
        <AnimatePresence>
          {visible
            .map((c, depth) => {
              const isTop = depth === 0
              return (
                <motion.button
                  key={c.name + (i + depth)}
                  onClick={isTop ? tap : undefined}
                  className="absolute inset-x-0 top-0 border-0 p-0 bg-transparent"
                  style={{
                    aspectRatio: '100 / 172',
                    zIndex: 10 - depth,
                    perspective: 1000,
                    cursor: isTop ? 'pointer' : 'default',
                  }}
                  aria-label={isTop ? (turned ? c.name : `Turn over: ${c.position}`) : undefined}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    y: depth * 7,
                    scale: 1 - depth * 0.03,
                    rotate: depth === 0 ? 0 : tiltFor(i + depth),
                  }}
                  exit={{ x: -300, y: -50, rotate: -18, opacity: 0, transition: { duration: 0.4 } }}
                  transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isTop && turned ? 180 : 0 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden', boxShadow: '0 8px 20px rgba(28,25,23,0.24)' }}
                    >
                      <CardBack />
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: '#F6F1E8',
                        padding: 4,
                        boxShadow: '0 8px 20px rgba(28,25,23,0.24)',
                      }}
                    >
                      <Photo src={c.image} alt={c.name} placeholder={c.name} className="w-full h-full block" />
                    </div>
                  </motion.div>
                </motion.button>
              )
            })
            .reverse()}
        </AnimatePresence>
      </div>

      {/* the reading, in a space kept clear for it so nothing shifts */}
      <div style={{ minHeight: 150 }} className="mt-5">
        <AnimatePresence mode="wait">
          {card && turned ? (
            <motion.div
              key={`read-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
            >
              <Rule />
              {card.auto && card.intro && (
                <p className="serif-it mt-3" style={{ fontSize: 15, color: 'var(--ink-40)' }}>
                  {card.intro}
                </p>
              )}
              <p className="script mt-2" style={{ fontSize: 22, lineHeight: 1.1, color: 'var(--accent)' }}>
                {card.name}
              </p>
              <p className="mt-2" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
                {card.reading}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key={`cue-${i}`}
              className="script text-center"
              style={{ fontSize: 17, color: 'var(--accent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
            >
              {TAROT.cue}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {card && turned && !card.auto && (
        <p className="kicker text-center" style={{ color: 'var(--ink-40)', fontSize: 8.5 }}>
          Tap it again for the next one
        </p>
      )}
    </div>
  )
}

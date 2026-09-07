import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { TAROT } from '../config.js'
import { Photo, Rule } from '../components/Paper.jsx'

// One card, big enough to actually look at, with the spread underneath as a
// strip she can tap back through. Laying all four out at once made each of
// them 78px wide, which is a stamp rather than a card, and gave her no way to
// go back to one she had already turned.

function CardBack({ shadow = true }) {
  return (
    <div className="w-full h-full" style={{ boxShadow: shadow ? '0 10px 26px rgba(28,25,23,0.26)' : 'none' }}>
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
    </div>
  )
}

export default function Year() {
  const { next } = useExperience()
  const deck = useMemo(() => [...TAROT.cards, { ...TAROT.bonus, auto: true }], [])
  const [shuffling, setShuffling] = useState(true)
  const [drawn, setDrawn] = useState(0)
  const [selected, setSelected] = useState(0)
  // The deck announces itself before it deals the last card, rather than
  // explaining afterwards in small print under the reading.
  const [insisting, setInsisting] = useState(false)
  const timers = useRef([])

  const all = drawn >= deck.length
  const nothingDrawn = drawn === 0
  const packEmpty = drawn >= deck.length
  const card = deck[Math.min(selected, deck.length - 1)]
  const bonusIndex = deck.length - 1

  useCta(all ? { onClick: next } : null, [all, next])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    const t = setTimeout(() => setShuffling(false), 1600)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [])

  // the last one turns itself over, once her three are down
  useEffect(() => {
    if (shuffling || drawn !== bonusIndex) return
    // long enough to read the third card, then it says its line, then it deals
    const t1 = setTimeout(() => setInsisting(true), 3200)
    const t2 = setTimeout(() => {
      setInsisting(false)
      setDrawn(deck.length)
      setSelected(bonusIndex)
    }, 5400)
    timers.current.push(t1, t2)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [shuffling, drawn, bonusIndex, deck.length])

  const drawNext = () => {
    if (shuffling || drawn >= bonusIndex) return
    setSelected(drawn)
    setDrawn((n) => n + 1)
  }

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h1 className="display" style={{ fontSize: 32, lineHeight: 1.06 }}>
        {TAROT.title}
      </h1>
      <motion.p
        className="serif-it"
        style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink-60)', overflow: 'hidden' }}
        animate={{
          maxHeight: nothingDrawn ? 120 : 0,
          opacity: nothingDrawn ? 1 : 0,
          marginTop: nothingDrawn ? 8 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {TAROT.standfirst}
      </motion.p>

      {/* The drawn card, big enough to read, with the pack beside it. The pack
          is the thing she taps: a text link asking her to draw was doing the
          job a deck should do. */}
      <div className="flex items-start justify-center gap-3 mt-4">
        {/* where the drawn card lands */}
        <div className="relative" style={{ width: '50%', aspectRatio: '100 / 172' }}>
          {nothingDrawn ? (
            <div
              className="absolute inset-0"
              style={{ border: '1px dashed rgba(28,25,23,0.18)', borderRadius: 2 }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                className="absolute inset-0"
                style={{ perspective: 1400 }}
                initial={{ x: 90, y: 30, scale: 0.4, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 110, damping: 16 }}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 180 }}
                  transition={{ duration: 0.7, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                    <CardBack />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: '#F6F1E8',
                      padding: 4,
                      boxShadow: '0 10px 26px rgba(28,25,23,0.26)',
                    }}
                  >
                    <Photo src={card.image} alt={card.name} placeholder={card.name} className="w-full h-full block" />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* the pack */}
        <motion.div
          className="relative"
          style={{ width: '25%', aspectRatio: '100 / 172', marginTop: 14 }}
          animate={{ opacity: packEmpty ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {shuffling
            ? Array.from({ length: 5 }).map((_, n) => {
                const dir = n % 2 ? 1 : -1
                return (
                  <motion.div
                    key={`shuffle-${n}`}
                    className="absolute inset-0"
                    style={{ zIndex: 10 - n }}
                    animate={{
                      x: [0, dir * (30 + n * 3), dir * -16, 0],
                      y: [0, -10 - n * 2, 5, n * 3],
                      rotate: [0, dir * (11 + n * 2), dir * -5, 0],
                    }}
                    transition={{ duration: 1.4, times: [0, 0.34, 0.68, 1], ease: 'easeInOut', delay: n * 0.05 }}
                  >
                    <CardBack shadow={n === 0} />
                  </motion.div>
                )
              })
            : deck.slice(drawn).map((c, n) => (
                <motion.button
                  key={`pack-${drawn + n}`}
                  onClick={n === 0 ? drawNext : undefined}
                  className="absolute inset-0 border-0 p-0 bg-transparent"
                  style={{
                    zIndex: 10 - n,
                    cursor: n === 0 && drawn < bonusIndex ? 'pointer' : 'default',
                  }}
                  aria-label={n === 0 ? 'Draw the next card' : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: n * 3, x: n * 2, rotate: n * 1.5 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                  whileTap={n === 0 && drawn < bonusIndex ? { scale: 0.96 } : undefined}
                >
                  <CardBack shadow={n === 0} />
                </motion.button>
              ))}

          {!shuffling && !packEmpty && (
            <div className="absolute text-center" style={{ top: '100%', left: -20, right: -20, marginTop: 8 }}>
              {nothingDrawn && (
                <motion.p
                  className="script"
                  style={{ fontSize: 17, color: 'var(--accent)' }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {TAROT.drawCue}
                </motion.p>
              )}
              <p className="kicker" style={{ color: 'var(--ink-40)', fontSize: 7.5, marginTop: nothingDrawn ? 2 : 0 }}>
                {deck.length - drawn} left
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* the reading for whichever one she is looking at */}
      <div style={{ minHeight: 104 }} className="mt-3">
        <AnimatePresence mode="wait">
          {insisting ? (
            <motion.div
              key="insist"
              className="grid place-items-center text-center"
              style={{ minHeight: 104 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45 }}
            >
              <p className="script" style={{ fontSize: 26, lineHeight: 1.2, color: 'var(--accent)' }}>
                {TAROT.bonus.intro}
              </p>
            </motion.div>
          ) : shuffling || nothingDrawn ? null : (
            <motion.div
              key={`read-${selected}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Rule />
              <p className="script mt-3" style={{ fontSize: 22, lineHeight: 1.1, color: 'var(--accent)' }}>
                {card.name}
              </p>
              <p className="mt-2" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
                {card.reading}
              </p>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* the spread, and how she moves between them */}
      <div
        className="grid gap-1.5 mt-4 mx-auto"
        style={{ gridTemplateColumns: `repeat(${deck.length}, 1fr)`, maxWidth: '62%' }}
      >
        {deck.map((c, idx) => {
          const isDown = idx < drawn
          const isHere = idx === selected
          return (
            <button
              key={idx}
              onClick={() => isDown && setSelected(idx)}
              className="border-0 p-0 bg-transparent"
              style={{ cursor: isDown ? 'pointer' : 'default' }}
              aria-label={isDown ? `Show ${c.name}` : `${c.position}, not drawn yet`}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio: '100 / 172',
                  border: isDown ? 'none' : '1px dashed rgba(28,25,23,0.18)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  opacity: isDown ? 1 : 0.55,
                  outline: isHere && isDown ? '1.5px solid var(--accent)' : 'none',
                  outlineOffset: 1,
                  transition: 'outline 0.25s, opacity 0.3s',
                }}
              >
                {isDown && (
                  <Photo src={c.image} alt="" placeholder="" className="w-full h-full block" />
                )}
              </div>
              <p
                className="kicker text-center mt-1"
                style={{
                  fontSize: 6.5,
                  lineHeight: 1.3,
                  color: isHere && isDown ? 'var(--accent)' : 'var(--ink-40)',
                }}
              >
                {c.position}
              </p>
            </button>
          )
        })}
      </div>

    </div>
  )
}

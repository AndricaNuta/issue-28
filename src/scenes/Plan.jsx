import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Kicker, Photo, Rule } from '../components/Paper.jsx'
import Next from '../components/Next.jsx'

// She asked to get her life in order this year, so the page grants the wish
// and produces the receipts. Each line taps to reveal the photographic proof
// and gets struck off; the last line was never anybody's to do.

// A hand-drawn strike, slightly off-level and bowed, so it reads as a pen.
function Strike({ show, seed = 0 }) {
  const dip = 2 + (seed % 3)
  const lift = (seed % 2 ? 1 : -1) * 1.5
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: -6, top: '50%', height: 16, width: 'calc(100% + 12px)', transform: 'translateY(-50%)' }}
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={`M2 ${8 + lift} Q150 ${8 + lift + dip} 298 ${8 - lift}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.34, ease: [0.4, 0, 0.3, 1] }}
      />
    </svg>
  )
}

function Underline({ show }) {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: -4, bottom: -7, height: 12, width: 'calc(100% + 8px)' }}
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M3 7 Q150 2 297 6"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export default function Plan() {
  const { next } = useExperience()
  const [struck, setStruck] = useState(() => new Set())
  const [shown, setShown] = useState(null)

  const allStruck = struck.size === PLAN.items.length
  const evidence = shown === null ? null : PLAN.items[shown]

  const tap = (i) => {
    setStruck((prev) => new Set(prev).add(i))
    setShown(i)
  }

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <div className="flex items-baseline justify-between">
        <Kicker>{PLAN.kicker}</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {struck.size} of {PLAN.items.length}
        </span>
      </div>

      <h1 className="display mt-2" style={{ fontSize: 40, lineHeight: 1 }}>
        {PLAN.title}
      </h1>
      <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
        {PLAN.standfirst}
      </p>
      <p className="script mt-3" style={{ fontSize: 32, lineHeight: 1.05, color: 'var(--accent)' }}>
        {PLAN.claim}
      </p>

      {/* the programme, struck off one line at a time */}
      <div className="mt-5">
        <Rule />
        {PLAN.items.map((item, i) => {
          const off = struck.has(i)
          return (
            <div key={i}>
              <button
                onClick={() => tap(i)}
                className="w-full text-left bg-transparent border-0 flex items-center gap-3"
                style={{ padding: '15px 2px', cursor: 'pointer' }}
              >
                <span className="relative inline-block flex-1 min-w-0">
                  <motion.span
                    className="block"
                    style={{ fontSize: 16.5, lineHeight: 1.35 }}
                    animate={{ color: off ? 'var(--ink-40)' : 'var(--ink)' }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.text}
                  </motion.span>
                  <Strike show={off} seed={i} />
                </span>

                {/* a thumbnail of the proof stays pinned to its line */}
                <AnimatePresence>
                  {off && (
                    <motion.span
                      className="shrink-0 block"
                      style={{ width: 34, background: '#FFFDF9', padding: 2, boxShadow: '0 2px 6px rgba(28,25,23,0.2)' }}
                      initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                      animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 3 : -3 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Photo
                        src={item.photo}
                        alt=""
                        placeholder=""
                        className="w-full block"
                        style={{ aspectRatio: '1 / 1' }}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <Rule />
            </div>
          )
        })}

        {/* the line nobody had to do anything about */}
        <div style={{ padding: '17px 2px 15px' }}>
          <span className="relative inline-block">
            <span className="display block" style={{ fontSize: 21, lineHeight: 1.2 }}>
              {PLAN.keep}
            </span>
            <Underline show={allStruck} />
          </span>
          {allStruck && (
            <motion.p
              className="script mt-1.5"
              style={{ fontSize: 24, color: 'var(--accent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {PLAN.keepNote}
            </motion.p>
          )}
        </div>
        <Rule />
      </div>

      {/* the proof for whichever line she just tapped */}
      <div style={{ minHeight: 150 }} className="mt-4">
        <AnimatePresence mode="wait">
          {evidence ? (
            <motion.div
              key={shown}
              className="flex items-start gap-3.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div
                className="shrink-0"
                style={{ width: 128, background: '#FFFDF9', padding: 6, boxShadow: '0 6px 16px rgba(28,25,23,0.18)', transform: 'rotate(-1.5deg)' }}
              >
                <Photo
                  src={evidence.photo}
                  alt={evidence.text}
                  placeholder="PROOF"
                  className="w-full block"
                  style={{ aspectRatio: '1 / 1' }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="kicker" style={{ color: 'var(--accent)', fontSize: 8.5 }}>
                  Exhibit {String(shown + 1).padStart(2, '0')}
                </p>
                <p className="serif-it mt-1.5" style={{ fontSize: 16, lineHeight: 1.4 }}>
                  {evidence.evidence}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="cue"
              className="script text-center"
              style={{ fontSize: 26, color: 'var(--accent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
            >
              {PLAN.cue}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {allStruck && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Rule />
            <p className="dropcap mt-4" style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-60)' }}>
              {PLAN.payoff}
            </p>
            <div className="mt-6 flex justify-center">
              <Next onClick={next} delay={1} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

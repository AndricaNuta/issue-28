import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Rule } from '../components/Paper.jsx'

// Her sentence opens the page. One tap crosses the whole programme off, which
// is what "completed" looks like on paper: lifting the lines away instead said
// nothing had happened. Then the page clears and her last line is left alone.

// A hand-drawn strike: off-level and slightly bowed, so it reads as a pen.
function Strike({ show, delay = 0, seed = 0 }) {
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
        transition={{ duration: 0.36, delay, ease: [0.4, 0, 0.3, 1] }}
      />
    </svg>
  )
}

export default function Plan() {
  const { next } = useExperience()
  const [phase, setPhase] = useState('list') // list · struck · truth
  const timers = useRef([])

  useCta(phase === 'truth' ? { onClick: next } : null, [phase, next])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const cross = () => {
    if (phase !== 'list') return
    setPhase('struck')
    timers.current.push(setTimeout(() => setPhase('truth'), 4200))
  }

  const struck = phase !== 'list'

  // Her sentence, with the half that matters printed in red.
  const [before, after] = PLAN.payoff.split(PLAN.payoffEmphasis)

  return (
    <div className="w-full max-w-[380px] mx-auto relative" style={{ minHeight: 560 }}>
      <AnimatePresence>
        {phase !== 'truth' && (
          <motion.div
            key="programme"
            className="absolute inset-x-0 top-0"
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
          >
            {/* her sentence, as the opening */}
            <p className="display" style={{ fontSize: 24, lineHeight: 1.32, fontWeight: 400 }}>
              {PLAN.standfirst}
            </p>

            <button
              onClick={cross}
              className="w-full text-left bg-transparent border-0 p-0 mt-6"
              style={{ cursor: phase === 'list' ? 'pointer' : 'default' }}
              aria-label="Cross the programme off"
            >
              <Rule />
              {PLAN.items.map((item, i) => (
                <div key={i}>
                  <div style={{ padding: '15px 2px' }}>
                    <span className="relative inline-block">
                      <motion.span
                        className="block"
                        style={{ fontSize: 16.5, lineHeight: 1.35 }}
                        animate={{ color: struck ? 'var(--ink-40)' : 'var(--ink)' }}
                        transition={{ delay: struck ? i * 0.16 : 0, duration: 0.4 }}
                      >
                        {item}
                      </motion.span>
                      <Strike show={struck} delay={i * 0.16} seed={i} />
                    </span>
                  </div>
                  <Rule />
                </div>
              ))}
            </button>

            {/* the cue, and then the wish in its place */}
            <div className="mt-5 text-center" style={{ minHeight: 82 }}>
              <AnimatePresence mode="wait">
                {phase === 'list' ? (
                  <motion.p
                    key="cue"
                    className="script"
                    style={{ fontSize: 27, color: 'var(--accent)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, -3, 0] }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
                  >
                    {PLAN.cue}
                  </motion.p>
                ) : (
                  <motion.p
                    key="claim"
                    className="script"
                    style={{ fontSize: 34, lineHeight: 1.15, color: 'var(--accent)' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.9 }}
                  >
                    {PLAN.claim}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* what is left, on an empty page */}
      <AnimatePresence>
        {phase === 'truth' && (
          <motion.p
            key="truth"
            className="absolute inset-x-0 text-center"
            style={{ fontSize: 25, lineHeight: 1.45, top: 150 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="serif-it" style={{ color: 'var(--ink-60)' }}>
              {before}
            </span>
            <span className="display" style={{ color: 'var(--accent)' }}>
              {PLAN.payoffEmphasis}
            </span>
            <span className="serif-it" style={{ color: 'var(--ink-60)' }}>
              {after}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

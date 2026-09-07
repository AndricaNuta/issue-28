import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Rule } from '../components/Paper.jsx'

// One list, all the way through. Her programme is crossed off and the line
// that was never hers to do is added to the foot of the same list, so the
// five struck rows and the one standing row are in view together. Putting
// that on a following screen threw the contrast away, and a line of
// commentary in between only delayed it.

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

function Underline({ delay = 0 }) {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: -4, bottom: -8, height: 12, width: 'calc(100% + 8px)' }}
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
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export default function Plan() {
  const { next } = useExperience()
  const [phase, setPhase] = useState('list') // list · struck · given
  const timers = useRef([])

  useCta(phase === 'given' ? { onClick: next } : null, [phase, next])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const lastStrike = (PLAN.items.length - 1) * 0.16 + 0.36

  const cross = () => {
    if (phase !== 'list') return
    setPhase('struck')
    timers.current.push(setTimeout(() => setPhase('given'), (lastStrike + 0.45) * 1000))
  }

  const struck = phase !== 'list'
  const given = phase === 'given'

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h1 className="display" style={{ fontSize: 38, lineHeight: 1.05 }}>
        {PLAN.title}
      </h1>
      <p className="mt-3" style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-60)' }}>
        {PLAN.standfirst}
      </p>

      <button
        onClick={cross}
        className="w-full text-left bg-transparent border-0 p-0 mt-5"
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

        {/* added to the foot of the same list, once the rest is crossed off */}
        <AnimatePresence>
          {given && (
            <motion.div
              key="given"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* whatever the sixteen decide to add goes in here first */}
              {PLAN.ours.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.26, duration: 0.55 }}
                >
                  <div className="flex items-baseline gap-3" style={{ padding: '15px 2px' }}>
                    <span className="numeral shrink-0" style={{ fontSize: 15, color: 'var(--accent)', width: 16 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 16.5, lineHeight: 1.35 }}>{line}</span>
                  </div>
                  <Rule />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + PLAN.ours.length * 0.26, duration: 0.7 }}
              >
                <div style={{ padding: '18px 2px 14px' }}>
                  <span className="relative inline-block">
                    <span className="display block" style={{ fontSize: 22, lineHeight: 1.25 }}>
                      {PLAN.finalWish}
                    </span>
                    <Underline delay={0.5 + PLAN.ours.length * 0.26 + 0.45} />
                  </span>
                </div>
                <Rule />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* her line while the pen is still wet, then the note under the list */}
      <div className="mt-5 text-center" style={{ minHeight: 76 }}>
        <AnimatePresence mode="wait">
          {phase === 'list' && (
            <motion.p
              key="cue"
              className="script"
              style={{ fontSize: 17, color: 'var(--accent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -3, 0] }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
            >
              {PLAN.cue}
            </motion.p>
          )}
          {given && (
            <motion.p
              key="note"
              className="script"
              style={{ fontSize: 20, lineHeight: 1.3, color: 'var(--accent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + PLAN.ours.length * 0.26 + 0.9, duration: 0.7 }}
            >
              {PLAN.finalNote}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

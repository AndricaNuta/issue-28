import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Rule } from '../components/Paper.jsx'

// Her homework, traded for our list.
//
// Every earlier version of this page only ever took something away: the lines
// were crossed off, then they vanished, and both messages were consolation.
// Nothing arrived, so there was no reward in it. Now the programme she asked
// for is crossed off and a different list writes itself into the space, which
// is a thing being given rather than a thing being removed.

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

function Underline({ show, delay = 0 }) {
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
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export default function Plan() {
  const { next } = useExperience()
  const [phase, setPhase] = useState('list') // list · struck · ours
  const timers = useRef([])

  useCta(phase === 'ours' ? { onClick: next } : null, [phase, next])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const cross = () => {
    if (phase !== 'list') return
    setPhase('struck')
    timers.current.push(setTimeout(() => setPhase('ours'), 2600))
  }

  const struck = phase !== 'list'
  const ours = phase === 'ours'

  return (
    <div className="w-full max-w-[380px] mx-auto relative" style={{ minHeight: 560 }}>
      <AnimatePresence>
        {!ours && (
          <motion.div
            key="programme"
            className="absolute inset-x-0 top-0"
            exit={{ opacity: 0, y: -16, transition: { duration: 0.7 } }}
          >
            <p className="display" style={{ fontSize: 24, lineHeight: 1.32, fontWeight: 400 }}>
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
            </button>

            <div className="mt-5 text-center" style={{ minHeight: 74 }}>
              <AnimatePresence mode="wait">
                {phase === 'list' ? (
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
                ) : (
                  <motion.p
                    key="claim"
                    className="script"
                    style={{ fontSize: 23, lineHeight: 1.3, color: 'var(--accent)' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.05, duration: 0.8 }}
                  >
                    {PLAN.claim}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* our list, writing itself into the space the other one left */}
      <AnimatePresence>
        {ours && (
          <motion.div
            key="ours"
            className="absolute inset-x-0 top-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <motion.p
              className="display"
              style={{ fontSize: 25, lineHeight: 1.3 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              {PLAN.ourTitle}
            </motion.p>

            <div className="mt-6">
              <Rule />
              {PLAN.ours.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-baseline gap-3" style={{ padding: '15px 2px' }}>
                    <span className="numeral shrink-0" style={{ fontSize: 15, color: 'var(--accent)', width: 18 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 16.5, lineHeight: 1.35 }}>{item}</span>
                  </div>
                  <Rule />
                </motion.div>
              ))}

              {/* the one that was never anybody's to do */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + PLAN.ours.length * 0.28 + 0.35, duration: 0.8 }}
              >
                <div style={{ padding: '19px 2px 16px' }}>
                  <span className="relative inline-block">
                    <span className="display block" style={{ fontSize: 23, lineHeight: 1.2 }}>
                      {PLAN.finalWish}
                    </span>
                    <Underline show delay={0.9 + PLAN.ours.length * 0.28 + 0.8} />
                  </span>
                  <motion.p
                    className="script mt-3"
                    style={{ fontSize: 18, color: 'var(--accent)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + PLAN.ours.length * 0.28 + 1.2, duration: 0.7 }}
                  >
                    {PLAN.finalNote}
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

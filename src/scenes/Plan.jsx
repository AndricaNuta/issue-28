import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Kicker, Rule } from '../components/Paper.jsx'
import Next from '../components/Next.jsx'

// Her wish, printed as the programme she asked for, then struck out with a red
// pen. One tap does the whole page. It used to be six checkboxes followed by a
// paragraph explaining the joke, which is a lecture with homework attached.

// A hand-drawn strike: slightly off-level and bowed, so it reads as a pen
// rather than a text-decoration.
function Strike({ show, delay = 0, seed = 0 }) {
  const dip = 2 + (seed % 3)
  const lift = (seed % 2 ? 1 : -1) * 1.5
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: -6, right: -6, top: '50%', height: 16, width: 'calc(100% + 12px)', transform: 'translateY(-50%)' }}
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
        transition={{ duration: 0.34, delay, ease: [0.4, 0, 0.3, 1] }}
      />
    </svg>
  )
}

// The one line the pen spares gets underlined instead.
function Underline({ show, delay = 0 }) {
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
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export default function Plan() {
  const { next } = useExperience()
  const [struck, setStruck] = useState(false)
  const lastDelay = PLAN.items.length * 0.16

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <Kicker>{PLAN.kicker}</Kicker>
      <h1 className="display mt-2" style={{ fontSize: 42, lineHeight: 1 }}>
        {PLAN.title}
      </h1>
      <p className="serif-it mt-3" style={{ fontSize: 16.5, lineHeight: 1.45, color: 'var(--ink-60)' }}>
        {PLAN.standfirst}
      </p>

      {/* the programme. one tap strikes the lot. */}
      <button
        onClick={() => setStruck(true)}
        className="w-full text-left bg-transparent border-0 p-0 mt-5"
        style={{ cursor: struck ? 'default' : 'pointer' }}
        aria-label={struck ? 'The plan, struck out' : 'Strike out the plan'}
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

        {/* the survivor */}
        <div style={{ padding: '17px 2px 15px' }}>
          <span className="relative inline-block">
            <span className="display block" style={{ fontSize: 21, lineHeight: 1.2 }}>
              {PLAN.keep}
            </span>
            <Underline show={struck} delay={lastDelay + 0.2} />
          </span>
        </div>
        <Rule />
      </button>

      {/* the cue, and then the margin note in its place */}
      <div className="mt-5" style={{ minHeight: 74 }}>
        <AnimatePresence mode="wait">
          {!struck ? (
            <motion.div
              key="cue"
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className="script"
                style={{ fontSize: 26, color: 'var(--accent)' }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {PLAN.cue}
              </motion.span>
              <motion.span
                style={{ color: 'var(--accent)', fontSize: 17 }}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                ↑
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="mark"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: lastDelay + 0.5, duration: 0.5 }}
            >
              <p
                className="script"
                style={{ fontSize: 32, color: 'var(--accent)', transform: 'rotate(-2deg)', lineHeight: 1 }}
              >
                {PLAN.mark}
              </p>
              <p className="dropcap mt-2" style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-60)' }}>
                {PLAN.signoff}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {struck && (
          <motion.div
            className="mt-4 flex justify-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: lastDelay + 0.9 }}
          >
            <Next onClick={next} delay={0.1} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

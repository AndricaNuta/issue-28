import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Kicker, Rule } from '../components/Paper.jsx'

// Her actual wish for this year, printed as the programme she asked for. The
// last line arrives already ticked and will not come off, which is the whole
// argument of the page, made as a mechanic rather than a speech.
function Tick({ show }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <motion.path
        d="M3.5 10.5 L7.5 14.5 L16.5 4.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.9"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export default function Plan() {
  const { complete, go } = useExperience()

  const lockedIdx = useMemo(
    () => PLAN.items.map((it, i) => (it.locked ? i : -1)).filter((i) => i >= 0),
    [],
  )
  const [ticked, setTicked] = useState(() => new Set(lockedIdx))
  const [openQuip, setOpenQuip] = useState(null)
  const [nudge, setNudge] = useState(null)

  const optional = PLAN.items.map((it, i) => (it.locked ? -1 : i)).filter((i) => i >= 0)
  const doneCount = optional.filter((i) => ticked.has(i)).length
  const allDone = doneCount === optional.length

  const toggle = (i) => {
    const item = PLAN.items[i]
    setOpenQuip(i)
    if (item.locked) {
      setNudge(i)
      setTimeout(() => setNudge(null), 650)
      return
    }
    setTicked((prev) => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })
  }

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="flex items-baseline justify-between">
        <Kicker>Wellness</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {doneCount} of {optional.length}
        </span>
      </div>

      <h1 className="display mt-2" style={{ fontSize: 40 }}>
        {PLAN.title}
      </h1>
      <p className="serif-it mt-3" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-60)' }}>
        {PLAN.standfirst}
      </p>

      <div className="mt-6">
        <Rule />
        {PLAN.items.map((item, i) => {
          const on = ticked.has(i)
          const isOpen = openQuip === i
          return (
            <div key={i}>
              <motion.button
                onClick={() => toggle(i)}
                className="w-full text-left flex items-start gap-3.5 bg-transparent border-0 cursor-pointer"
                style={{ padding: '15px 2px' }}
                animate={nudge === i ? { x: [0, -6, 5, -3, 0] } : { x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="relative grid place-items-center shrink-0"
                  style={{
                    width: 22,
                    height: 22,
                    marginTop: 2,
                    borderRadius: 2,
                    boxShadow: `inset 0 0 0 1px ${item.locked ? 'var(--accent)' : 'var(--hair)'}`,
                    background: item.locked ? 'var(--accent-soft)' : 'transparent',
                  }}
                >
                  <span className="absolute">
                    <Tick show={on} />
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: item.locked ? 500 : 400,
                      lineHeight: 1.4,
                      display: 'inline-block',
                      color: on && !item.locked ? 'var(--ink-40)' : 'var(--ink)',
                      textDecorationLine: on && !item.locked ? 'line-through' : 'none',
                      transition: 'color 0.3s',
                    }}
                  >
                    {item.text}
                  </span>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        className="block serif-it"
                        style={{
                          fontSize: 14.5,
                          color: item.locked ? 'var(--accent)' : 'var(--ink-40)',
                          marginTop: 3,
                        }}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.quip}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
              <Rule />
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            className="mt-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Kicker>From all sixteen of us</Kicker>
            <h2 className="display mt-2" style={{ fontSize: 29 }}>
              {PLAN.payoff.title}
            </h2>
            <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-60)' }}>
              {PLAN.payoff.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 flex flex-col items-center gap-1">
        {allDone ? (
          <button className="btn" onClick={() => complete('plan')}>
            Back to the list
          </button>
        ) : (
          <>
            <p className="serif-it text-center" style={{ fontSize: 14.5, color: 'var(--ink-40)' }}>
              Tick everything you are willing to commit to.
            </p>
            <button className="link" onClick={() => go('hub')}>
              back to the list
            </button>
          </>
        )}
      </div>
    </div>
  )
}

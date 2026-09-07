import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { PLAN } from '../config.js'
import { Kicker, Rule } from '../components/Paper.jsx'

// One gesture, three beats: the programme is printed, it lifts off the page,
// and her sentence is left alone on the empty space it leaves behind.
//
// Earlier versions of this page were a checklist with a paragraph explaining
// the joke, then red pen scribbles, then a photograph per line. All of them
// had furniture where the feeling should be.

export default function Plan() {
  const { next } = useExperience()
  const [phase, setPhase] = useState('list') // list · clearing · claim · truth
  const timers = useRef([])

  useCta(phase === 'truth' ? { onClick: next } : null, [phase, next])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const clear = () => {
    if (phase !== 'list') return
    setPhase('clearing')
    timers.current.push(setTimeout(() => setPhase('claim'), 1150))
    timers.current.push(setTimeout(() => setPhase('truth'), 3500))
  }

  const gone = phase !== 'list' && phase !== 'clearing'

  // Her sentence, with the half that matters printed in red.
  const [before, after] = PLAN.payoff.split(PLAN.payoffEmphasis)

  return (
    <div className="w-full max-w-[380px] mx-auto">
      {/* the header steps back once the page starts clearing */}
      <motion.div animate={{ opacity: gone ? 0.32 : 1 }} transition={{ duration: 0.9 }}>
        <Kicker>{PLAN.kicker}</Kicker>
        <h1 className="display mt-2" style={{ fontSize: 40, lineHeight: 1 }}>
          {PLAN.title}
        </h1>
        <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-60)' }}>
          {PLAN.standfirst}
        </p>
      </motion.div>

      {/* the stage: the list, then the claim, then the one line left */}
      <div className="relative mt-6" style={{ minHeight: 328 }}>
        <AnimatePresence>
          {!gone && (
            <motion.button
              key="list"
              onClick={clear}
              className="absolute inset-x-0 top-0 w-full text-left bg-transparent border-0 p-0"
              style={{ cursor: phase === 'list' ? 'pointer' : 'default' }}
              aria-label="Lift the programme off the page"
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
              <Rule />
              {PLAN.items.map((item, i) => (
                <motion.div
                  key={i}
                  animate={
                    phase === 'clearing'
                      ? { opacity: 0, y: -34, filter: 'blur(3px)' }
                      : { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }
                  transition={{ duration: 0.7, delay: phase === 'clearing' ? i * 0.11 : 0, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div style={{ padding: '15px 2px', fontSize: 16.5, lineHeight: 1.35 }}>{item}</div>
                  <Rule />
                </motion.div>
              ))}

              {phase === 'list' && (
                <motion.p
                  className="script text-center mt-5"
                  style={{ fontSize: 27, color: 'var(--accent)' }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {PLAN.cue}
                </motion.p>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* the claim, in the space the list has just left */}
        <AnimatePresence>
          {phase === 'claim' && (
            <motion.p
              key="claim"
              className="script absolute inset-x-0 text-center"
              style={{ top: 52, fontSize: 40, lineHeight: 1.1, color: 'var(--accent)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {PLAN.claim}
            </motion.p>
          )}
        </AnimatePresence>

        {/* what is left */}
        <AnimatePresence>
          {phase === 'truth' && (
            <motion.p
              key="truth"
              className="absolute inset-x-0 text-center"
              style={{ top: 24, fontSize: 25, lineHeight: 1.45 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
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
    </div>
  )
}

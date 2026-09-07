import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { YEAR } from '../config.js'
import { Kicker, Rule } from '../components/Paper.jsx'

// Three cards to turn over. Predictions about the year rather than claims
// about her, so there is nothing here that can land wrong.
export default function Year() {
  const { next } = useExperience()
  const [turned, setTurned] = useState(() => new Set())
  const all = turned.size === YEAR.cards.length

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="flex items-baseline justify-between">
        <Kicker>The forecast</Kicker>
        <span className="kicker" style={{ color: 'var(--ink-40)' }}>
          {turned.size} of {YEAR.cards.length}
        </span>
      </div>

      <h1 className="display mt-2" style={{ fontSize: 40 }}>
        {YEAR.title}
      </h1>
      <p className="serif-it mt-3" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-60)' }}>
        {YEAR.standfirst}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {YEAR.cards.map((c, i) => {
          const open = turned.has(i)
          return (
            <motion.button
              key={i}
              onClick={() => setTurned((prev) => new Set(prev).add(i))}
              className="w-full text-left border-0 cursor-pointer relative overflow-hidden"
              style={{
                background: open ? 'var(--paper-card)' : 'var(--ink)',
                borderRadius: 3,
                padding: '20px 18px',
                minHeight: 104,
                boxShadow: open ? 'inset 0 0 0 1px var(--hair)' : 'none',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <span
                className="kicker block"
                style={{ color: open ? 'var(--accent)' : 'rgba(255,255,255,0.5)', fontSize: 9.5 }}
              >
                {c.label}
              </span>

              {open ? (
                <motion.span
                  className="serif-it block mt-2"
                  style={{ fontSize: 18, lineHeight: 1.45 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {c.text}
                </motion.span>
              ) : (
                <span
                  className="display block mt-2"
                  style={{ fontSize: 22, color: 'rgba(255,255,255,0.92)' }}
                >
                  Turn it over
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <Rule style={{ marginTop: 26 }} />

      <div className="mt-6 flex flex-col items-center gap-1">
        {all && (
          <button className="btn" onClick={next}>
            Keep reading
          </button>
        )}
      </div>
    </div>
  )
}

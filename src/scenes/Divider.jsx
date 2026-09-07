import { motion } from 'framer-motion'
import { useCta, useExperience } from '../experience.js'
import { DIVIDERS } from '../config.js'
import { Rule } from '../components/Paper.jsx'

// A section divider: the way a magazine announces what is coming next. Four
// words and a numeral. An introduction does not have to be a paragraph.
export default function Divider() {
  const { route, next } = useExperience()
  const d = DIVIDERS[route] || {}

  useCta({ onClick: next, tone: 'accent' }, [route])

  return (
    <div className="w-full max-w-[360px] mx-auto text-center">
      <motion.p
        className="kicker"
        style={{ color: 'var(--accent)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {d.kicker}
      </motion.p>

      <motion.p
        className="numeral"
        style={{ fontSize: 190, lineHeight: 0.8, color: 'var(--ink)', marginTop: 10 }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {d.numeral}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        <Rule style={{ marginTop: 18, marginBottom: 18 }} />
        <h1 className="script" style={{ fontSize: 44, lineHeight: 1.05 }}>
          {d.title}
        </h1>
        {d.note && (
          <p className="kicker mt-3" style={{ color: 'var(--ink-40)' }}>
            {d.note}
          </p>
        )}
      </motion.div>
    </div>
  )
}

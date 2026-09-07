import { motion } from 'framer-motion'
import { useExperience, useCta } from '../experience.js'
import { CONFIG, PEOPLE } from '../config.js'
import { Barcode, Kicker, Rule } from '../components/Paper.jsx'

// The masthead page: everyone who chipped in, printed as staff.
export default function Close() {
  const { go } = useExperience()
  useCta({ onClick: () => go('cover'), label: 'Back to the cover', ring: false }, [go])

  return (
    <div className="w-full max-w-[400px] mx-auto text-center">
      <Kicker>{CONFIG.issueLabel} · masthead</Kicker>

      <h1 className="display mt-3" style={{ fontSize: 44 }}>
        Happy {CONFIG.age}th,
        <br />
        <em>{CONFIG.name}.</em>
      </h1>

      <p className="serif-it mt-3" style={{ fontSize: 17, color: 'var(--ink-60)' }}>
        {CONFIG.closing}
      </p>

      <Rule style={{ marginTop: 24, marginBottom: 16 }} />

      <p className="kicker" style={{ color: 'var(--ink-40)', fontSize: 9 }}>
        The editorial team
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-left">
        {PEOPLE.map((p, i) => (
          <motion.span
            key={i}
            style={{ fontSize: 13.5, color: 'var(--ink-60)' }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04, duration: 0.4 }}
          >
            {p.name}
          </motion.span>
        ))}
      </div>

      <Rule style={{ marginTop: 22, marginBottom: 18 }} />

      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-60)' }}>
        Two gifts, one very good year ahead. Whatever you tick off, we are coming with
        you.
      </p>

      <div className="mt-7 flex flex-col items-center gap-3">
        <Barcode width={80} height={22} seed={CONFIG.age + 11} label={`${CONFIG.issueLabel} · ONE OF ONE`} />
        <button className="link" onClick={() => go('cover')}>
          back to the cover
        </button>
      </div>
    </div>
  )
}

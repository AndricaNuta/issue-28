import { motion } from 'framer-motion'
import { CONTENTS, PAGES, useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { Kicker, Rule } from '../components/Paper.jsx'

// A real contents page. It exists so she can see what the issue holds and how
// far in the gifts are, without any of it being a chore to come back to: she
// reads straight through from here.
export default function Contents() {
  const { next } = useExperience()

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <Kicker>In this issue</Kicker>
      <h1 className="script mt-1" style={{ fontSize: 54, lineHeight: 1 }}>
        Contents
      </h1>

      <Rule style={{ marginTop: 16, background: 'var(--ink)', height: 1.5 }} />

      {CONTENTS.map((key, i) => {
        const page = PAGES[key]
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
          >
            <div className="flex items-start gap-3.5" style={{ padding: '15px 2px' }}>
              <span
                className="numeral shrink-0"
                style={{ fontSize: 21, color: 'var(--accent)', width: 26, lineHeight: 1.1 }}
              >
                {page.no}
              </span>

              <div className="min-w-0 flex-1">
                {page.redacted ? (
                  <span
                    className="inline-block"
                    style={{ background: 'var(--ink)', borderRadius: 1, padding: '3px 11px' }}
                  >
                    <span className="kicker" style={{ color: '#F6F1E8', fontSize: 9 }}>
                      Withheld
                    </span>
                  </span>
                ) : (
                  <span className="display" style={{ fontSize: 21 }}>
                    {page.title}
                  </span>
                )}
                <p className="serif-it" style={{ fontSize: 14, color: 'var(--ink-40)', marginTop: 2 }}>
                  {page.note}
                </p>
              </div>

              {page.redacted && (
                <span className="script shrink-0" style={{ fontSize: 17, color: 'var(--accent)' }}>
                  a gift
                </span>
              )}
            </div>
            <Rule />
          </motion.div>
        )
      })}

      <motion.p
        className="dropcap mt-6"
        style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-60)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Two of the pages are wrapped. Read to the back and they are yours.
      </motion.p>

      <motion.div
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button className="btn" onClick={next}>
          Turn to page {PAGES.plan.no}
        </button>
      </motion.div>

      <p className="kicker text-center mt-7" style={{ color: 'var(--ink-40)', fontSize: 8.5 }}>
        {CONFIG.magazineName} · {CONFIG.issueLabel} · one copy printed
      </p>
    </div>
  )
}

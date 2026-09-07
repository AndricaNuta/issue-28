// The way forward, everywhere. A round button with an arrow in it rather than
// a pill full of words: the labels were doing no work that the arrow does not
// do, and a reader who does not read still understands an arrow.
import { motion } from 'framer-motion'

export default function Next({
  onClick,
  label,            // optional micro-caption, used sparingly
  tone = 'ink',     // ink · accent
  icon = 'arrow',   // arrow · down · hand
  size = 62,
  ring = true,      // the pulse that draws the eye
  delay = 0,
}) {
  const bg = tone === 'accent' ? 'var(--accent)' : 'var(--ink)'

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="relative grid place-items-center">
        {ring && (
          <span
            className="absolute anim-ring pointer-events-none"
            style={{ width: size, height: size, borderRadius: '50%', border: `1.5px solid ${bg}` }}
            aria-hidden="true"
          />
        )}
        <motion.button
          onClick={onClick}
          className="relative grid place-items-center border-0"
          style={{ width: size, height: size, borderRadius: '50%', background: bg, cursor: 'pointer' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={label || 'Continue'}
        >
          {icon === 'arrow' && (
            <svg width="24" height="16" viewBox="0 0 24 16" aria-hidden="true">
              <path
                d="M1 8 H22 M15.5 1.5 L22 8 L15.5 14.5"
                fill="none"
                stroke="#F6F1E8"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {icon === 'down' && (
            <svg width="18" height="24" viewBox="0 0 18 24" aria-hidden="true">
              <path
                d="M9 1 V22 M2.5 15.5 L9 22 L15.5 15.5"
                fill="none"
                stroke="#F6F1E8"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {icon === 'hand' && (
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <path
                d="M10 15 V6.5 a1.6 1.6 0 0 1 3.2 0 V13 m0 -2 a1.6 1.6 0 0 1 3.2 0 v2 m0 -1.4 a1.6 1.6 0 0 1 3.2 0 V17 c0 3.3 -2.4 6 -5.6 6 h-2 c-3 0 -4.6 -2 -5.6 -4.4 l-2 -4.6 a1.6 1.6 0 0 1 2.7 -1.6 L10 15"
                fill="none"
                stroke="#F6F1E8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.button>
      </div>

      {/* The caption slot is always present, empty or not. Rendering it only
          when there is a label made this bottom-anchored stack taller on some
          pages, which moved the circle up by the height of the caption. */}
      <span
        className="kicker"
        style={{ fontSize: 8, color: 'var(--ink-40)', height: 11, lineHeight: '11px' }}
      >
        {label || '\u00A0'}
      </span>
    </motion.div>
  )
}

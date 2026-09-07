// Press this to make something happen on this page. Deliberately unlike the
// round arrow, which only ever means "turn the page": an action needs naming,
// so it is a labelled pill in the accent colour, sitting in the content where
// the action applies rather than down in the navigation position.
import { motion } from 'framer-motion'

export default function Action({ onClick, label, icon = 'hand', delay = 0 }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2.5"
      style={{
        background: 'var(--accent)',
        color: '#F6F1E8',
        border: 0,
        borderRadius: 999,
        padding: '14px 24px 14px 20px',
        cursor: 'pointer',
        boxShadow: '0 8px 22px rgba(181,52,42,0.3)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="grid place-items-center" style={{ width: 22, height: 22 }} aria-hidden="true">
        {icon === 'hand' && (
          <svg width="20" height="20" viewBox="0 0 26 26">
            <path
              d="M10 15 V6.5 a1.6 1.6 0 0 1 3.2 0 V13 m0 -2 a1.6 1.6 0 0 1 3.2 0 v2 m0 -1.4 a1.6 1.6 0 0 1 3.2 0 V17 c0 3.3 -2.4 6 -5.6 6 h-2 c-3 0 -4.6 -2 -5.6 -4.4 l-2 -4.6 a1.6 1.6 0 0 1 2.7 -1.6 L10 15"
              fill="none"
              stroke="#F6F1E8"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {icon === 'plus' && (
          <svg width="17" height="17" viewBox="0 0 17 17">
            <path d="M8.5 1 V16 M1 8.5 H16" stroke="#F6F1E8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        {icon === 'ticket' && (
          <svg width="20" height="16" viewBox="0 0 22 17">
            <path
              d="M1.5 4.5 A2 2 0 0 0 1.5 12.5 V15.5 H20.5 V12.5 A2 2 0 0 1 20.5 4.5 V1.5 H1.5 Z"
              fill="none"
              stroke="#F6F1E8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 11.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </motion.button>
  )
}

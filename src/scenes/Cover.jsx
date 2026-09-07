import { motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { Barcode, Photo } from '../components/Paper.jsx'

// The cover, full bleed, with the type over the photograph the way a real one
// is printed. There is no button: the magazine itself is the button, and the
// curled corner is what says so.
const rise = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.11, ease: [0.22, 1, 0.36, 1] },
  }),
}

const CREAM = '#F6F1E8'

export default function Cover() {
  const { next } = useExperience()

  return (
    <div className="w-full max-w-[366px] mx-auto">
      <motion.button
        onClick={() => next()}
        aria-label="Open the issue"
        className="relative w-full block text-left border-0 p-0 cursor-pointer overflow-hidden"
        style={{ aspectRatio: '3 / 4', background: '#14100F', borderRadius: 2, boxShadow: '0 20px 50px rgba(28,25,23,0.28)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.006 }}
        whileTap={{ scale: 0.994 }}
      >
        <Photo
          src={CONFIG.photos.her}
          alt={CONFIG.name}
          placeholder="HER PHOTO"
          objectPosition="center 34%"
          className="absolute inset-0 w-full h-full"
        />

        {/* just enough at the top and the foot for the type to hold */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,16,15,0.55) 0%, rgba(20,16,15,0.12) 26%, rgba(20,16,15,0) 48%, rgba(20,16,15,0.35) 78%, rgba(20,16,15,0.72) 100%)',
          }}
        />

        {/* ---------- masthead ---------- */}
        <div className="absolute left-0 right-0 top-0 px-4 pt-3">
          <motion.p
            className="script"
            style={{ fontSize: 15, color: CREAM, marginBottom: 2, letterSpacing: '0.04em', marginLeft: 3 }}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0}
          >
            Your
          </motion.p>

          <motion.h1
            className="masthead"
            style={{ fontSize: 'clamp(37px, 13vw, 52px)', color: CREAM }}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
          >
            Birthday
          </motion.h1>

          <motion.p
            className="script text-right"
            style={{ fontSize: 14, color: CREAM, marginTop: 2, letterSpacing: '0.04em', marginRight: 2 }}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
          >
            Magazine
          </motion.p>
        </div>

        {/* ---------- cover lines, and the age ---------- */}
        <motion.div
          className="absolute left-4 right-4"
          style={{ top: '21%' }}
          variants={rise}
          initial="hidden"
          animate="show"
          custom={3}
        >
          <div className="flex items-start justify-between gap-3">
            <div style={{ textShadow: '0 1px 12px rgba(20,16,15,0.75)' }}>
              <p className="coverline" style={{ fontSize: 13.5, color: CREAM }}>
                {CONFIG.issueDate}
              </p>
              <p className="coverline mt-1" style={{ fontSize: 10.5, color: 'rgba(246,241,232,0.8)' }}>
                {CONFIG.edition}
              </p>

              <p className="script mt-3" style={{ fontSize: 13, color: CREAM }}>
                Inside
              </p>
              <div className="mt-0.5 flex flex-col gap-1">
                {CONFIG.coverLines.map((l, i) => (
                  <p key={i} className="coverline" style={{ fontSize: 11.5, color: CREAM, maxWidth: '15em' }}>
                    {l}
                  </p>
                ))}
              </div>
            </div>

            <span
              className="numeral shrink-0"
              style={{
                fontSize: 72,
                lineHeight: 0.8,
                color: CREAM,
                textShadow: '0 2px 18px rgba(20,16,15,0.6)',
              }}
            >
              {CONFIG.age}
            </span>
          </div>
        </motion.div>

        {/* ---------- her name ---------- */}
        <motion.div
          className="absolute left-4 right-4"
          style={{ bottom: 25 }}
          variants={rise}
          initial="hidden"
          animate="show"
          custom={4}
        >
          {CONFIG.coverKicker && (
            <p className="script" style={{ fontSize: 13, color: 'rgba(246,241,232,0.75)', marginBottom: 1 }}>
              {CONFIG.coverKicker}
            </p>
          )}
          <p
            className="script"
            style={{
              fontSize: 'clamp(40px, 13vw, 54px)',
              color: CREAM,
              textShadow: '0 2px 20px rgba(20,16,15,0.6)',
              lineHeight: 1,
            }}
          >
            {CONFIG.name}
          </p>

        </motion.div>

        {/* the foot of the cover: just the barcode */}
        <motion.div
          className="absolute right-4 flex items-end"
          style={{ bottom: 15 }}
          variants={rise}
          initial="hidden"
          animate="show"
          custom={5}
        >
          <span style={{ filter: 'invert(1)', opacity: 0.9, marginRight: 26 }}>
            <Barcode width={52} height={18} seed={CONFIG.age} />
          </span>
        </motion.div>

        {/* ---------- the curled corner: this is the "open me" ---------- */}
        <motion.div
          className="absolute"
          style={{ right: 0, bottom: 0, width: 46, height: 46 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <motion.div
            className="w-full h-full"
            animate={{ y: [0, -2.5, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
              {/* the page beneath, showing through */}
              <path d="M46 46 L46 6 L6 46 Z" fill={CREAM} opacity="0.16" />
              {/* the lifted corner itself */}
              <path d="M46 46 L46 14 L14 46 Z" fill={CREAM} />
              <path d="M46 14 L14 46" stroke="rgba(28,25,23,0.18)" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.button>

      <motion.p
        className="script text-center mt-4"
        style={{ fontSize: 14, color: 'var(--ink-40)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        tap the cover to open
      </motion.p>
    </div>
  )
}

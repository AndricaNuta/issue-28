import { motion } from 'framer-motion'
import { useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { Barcode, Photo } from '../components/Paper.jsx'

// The cover, built the way a real one is: a masthead band, a photograph with
// the cover lines over it, and the cover star's name below in script. Three
// bands rather than free-floating type, so any photograph stays legible.
const rise = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Cover() {
  const { go } = useExperience()

  return (
    <div className="w-full max-w-[370px] mx-auto">
      <motion.div
        className="relative w-full overflow-hidden"
        style={{
          background: 'var(--paper-card)',
          borderRadius: 2,
          boxShadow: '0 18px 44px rgba(28,25,23,0.18)',
        }}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ---------- masthead band ---------- */}
        <div className="relative px-4 pt-3.5 pb-2">
          <motion.p
            className="script"
            style={{ fontSize: 26, color: 'var(--ink)', marginBottom: -8, marginLeft: 2 }}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0}
          >
            Your
          </motion.p>

          <motion.h1
            className="masthead"
            style={{ fontSize: 'clamp(36px, 12.8vw, 50px)' }}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={1}
          >
            Birthday
          </motion.h1>

          <motion.p
            className="script text-right"
            style={{ fontSize: 20, color: 'var(--ink)', marginTop: -4, marginRight: 2 }}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
          >
            Magazine
          </motion.p>
        </div>

        {/* ---------- photograph, with the cover lines over it ---------- */}
        <motion.div className="relative w-full" variants={rise} initial="hidden" animate="show" custom={2}>
          <Photo
            src={CONFIG.photos.her}
            alt={CONFIG.name}
            placeholder="HER PHOTO"
            objectPosition="center 24%"
            className="w-full block"
            style={{ aspectRatio: '1 / 1' }}
          />

          {/* just enough shading on the left for the type to hold */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(100deg, rgba(28,25,23,0.55) 0%, rgba(28,25,23,0.22) 42%, rgba(28,25,23,0) 66%)',
            }}
          />

          <div className="absolute left-4 top-3.5 right-4 flex items-start justify-between gap-3">
            <div style={{ textShadow: '0 1px 10px rgba(28,25,23,0.5)' }}>
              <p className="coverline" style={{ fontSize: 15, color: '#fff' }}>
                {CONFIG.issueDate}
              </p>
              <p className="coverline mt-1" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)' }}>
                {CONFIG.edition}
              </p>

              <p className="kicker mt-4" style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>
                Inside
              </p>
              <div className="mt-1.5 flex flex-col gap-1">
                {CONFIG.coverLines.map((l, i) => (
                  <p key={i} className="coverline" style={{ fontSize: 12, color: '#fff', maxWidth: '12em' }}>
                    {l}
                  </p>
                ))}
              </div>
            </div>

            {/* the age, big, like every cover does it */}
            <span
              className="numeral shrink-0"
              style={{
                fontSize: 74,
                lineHeight: 0.82,
                color: '#fff',
                textShadow: '0 2px 16px rgba(28,25,23,0.45)',
              }}
            >
              {CONFIG.age}
            </span>
          </div>

          <p
            className="coverline absolute"
            style={{ left: 16, bottom: 12, fontSize: 12, color: '#fff', textShadow: '0 1px 8px rgba(28,25,23,0.6)' }}
          >
            It&rsquo;s her birthday
          </p>
        </motion.div>

        {/* ---------- her name, and the barcode ---------- */}
        <motion.div
          className="relative px-4 pt-3 pb-3.5 flex items-end justify-between gap-3"
          variants={rise}
          initial="hidden"
          animate="show"
          custom={3}
        >
          <div className="min-w-0">
            <p className="script" style={{ fontSize: 'clamp(34px, 11vw, 44px)', color: 'var(--accent)' }}>
              {CONFIG.name}
            </p>
            <p className="kicker mt-1" style={{ fontSize: 8.5, color: 'var(--ink-40)' }}>
              {CONFIG.coverLine}
            </p>
          </div>
          <div className="shrink-0" style={{ marginBottom: 2 }}>
            <Barcode width={58} height={26} seed={CONFIG.age} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 flex justify-center"
        variants={rise}
        initial="hidden"
        animate="show"
        custom={4}
      >
        <button className="btn" onClick={() => go('pass')}>
          Open the issue
        </button>
      </motion.div>
    </div>
  )
}

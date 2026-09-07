import { motion } from 'framer-motion'
import { useExperience, useCta } from '../experience.js'
import { CONFIG } from '../config.js'
import { Photo } from '../components/Paper.jsx'

// A laminated all-access pass, issued rather than earned. This page used to be
// a four digit code, which was neither a puzzle nor a joke: she knows her own
// birthday. Now it just hands her the pass and gets out of the way.
function Field({ label, value, script }) {
  return (
    <div className="flex items-end gap-2.5">
      <span className="kicker shrink-0" style={{ fontSize: 7.5, color: 'var(--ink-40)', marginBottom: 3 }}>
        {label}
      </span>
      <span
        className="flex-1 min-w-0"
        style={{ borderBottom: '1px dashed rgba(28,25,23,0.4)', paddingBottom: 2 }}
      >
        <span
          className={script ? 'script' : 'display'}
          style={{ fontSize: script ? 25 : 17, color: 'var(--ink)', display: 'block', lineHeight: 1.3, paddingLeft: 2 }}
        >
          {value}
        </span>
      </span>
    </div>
  )
}

export default function Pass() {
  const { next } = useExperience()
  useCta({ onClick: next, label: 'Enter the issue' }, [next])

  return (
    <div className="w-full max-w-[330px] mx-auto">
      {/* the lanyard clip */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="46" height="40" viewBox="0 0 46 40" aria-hidden="true">
          <rect x="15" y="1" width="16" height="12" rx="6" fill="none" stroke="rgba(28,25,23,0.45)" strokeWidth="2.5" />
          <rect x="17" y="12" width="12" height="20" rx="2" fill="rgba(28,25,23,0.28)" />
          <rect x="14" y="30" width="18" height="9" rx="2" fill="rgba(28,25,23,0.38)" />
        </svg>
      </motion.div>

      {/* the laminate */}
      <motion.div
        className="relative"
        style={{
          marginTop: -6,
          padding: 13,
          borderRadius: 10,
          background: 'linear-gradient(150deg, rgba(255,255,255,0.85) 0%, rgba(240,236,229,0.7) 45%, rgba(255,255,255,0.8) 100%)',
          boxShadow: '0 14px 34px rgba(28,25,23,0.2), inset 0 0 0 1px rgba(255,255,255,0.9)',
        }}
        initial={{ opacity: 0, y: 18, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* the punch hole */}
        <span
          className="absolute"
          style={{
            top: 20,
            left: '50%',
            marginLeft: -22,
            width: 44,
            height: 9,
            borderRadius: 5,
            background: 'rgba(28,25,23,0.14)',
            boxShadow: 'inset 0 1px 2px rgba(28,25,23,0.2)',
          }}
          aria-hidden="true"
        />

        <div style={{ background: 'var(--paper-card)', borderRadius: 3, padding: '38px 18px 20px' }}>
          <h1
            style={{
              fontFamily: 'Figtree, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 27,
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
            }}
          >
            This is who
            <br />
            turns {CONFIG.age}
          </h1>

          <div className="mt-4 flex justify-center">
            <div style={{ width: '74%' }}>
              <Photo
                src={CONFIG.photos.baby}
                alt={CONFIG.name}
                placeholder="CHILDHOOD PHOTO"
                objectPosition="center 45%"
                className="w-full block"
                style={{ aspectRatio: '1 / 1', borderRadius: 1 }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3.5">
            <Field label="Name" value={CONFIG.name} script />
            <Field label="Occupation" value={CONFIG.occupation} />
          </div>

          <div className="flex items-center justify-between mt-5">
            <span className="kicker" style={{ fontSize: 8, color: 'var(--accent)' }}>
              {CONFIG.passStatus}
            </span>
            <span className="kicker" style={{ fontSize: 8, color: 'var(--ink-40)' }}>
              {CONFIG.issueLabel}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-7 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
      </motion.div>
    </div>
  )
}

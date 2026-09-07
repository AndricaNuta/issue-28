import { useState } from 'react'
import { motion } from 'framer-motion'
import { TASKS, useExperience } from '../experience.js'
import { CONFIG } from '../config.js'
import { Photo } from '../components/Paper.jsx'

// The hub, as a little browser window with its right-click menu already open.
// The menu is the checklist: it is a plain list of what is left, and it is also
// the whole navigation. Left open by default because a hidden menu is not a
// list, and right-click does not exist on a phone.

function Chrome() {
  return (
    <div style={{ borderBottom: '1.5px solid var(--ink)' }}>
      <div className="flex items-center gap-2 px-2.5" style={{ height: 38 }}>
        <span style={{ color: 'var(--ink-60)', fontSize: 13, letterSpacing: '0.08em' }} aria-hidden="true">
          &lsaquo; &rsaquo;
        </span>

        <div
          className="flex-1 flex items-center gap-1.5 px-2 min-w-0"
          style={{ height: 22, border: '1.5px solid var(--ink)', borderRadius: 3 }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true" className="shrink-0">
            <circle cx="5.5" cy="5.5" r="4.6" fill="none" stroke="var(--ink)" strokeWidth="1" />
            <ellipse cx="5.5" cy="5.5" rx="2" ry="4.6" fill="none" stroke="var(--ink)" strokeWidth="0.8" />
            <line x1="0.9" y1="5.5" x2="10.1" y2="5.5" stroke="var(--ink)" strokeWidth="0.8" />
          </svg>
          <span
            className="truncate"
            style={{ fontSize: 10, color: 'var(--ink-60)', letterSpacing: '0.04em' }}
          >
            {CONFIG.magazineName.toLowerCase()}.co/the-bag
          </span>
        </div>

        <span style={{ fontSize: 12, color: 'var(--ink-60)' }} aria-hidden="true">
          &#9734;
        </span>
        <span style={{ fontSize: 12, color: 'var(--ink-60)' }} aria-hidden="true">
          &#10005;
        </span>
      </div>
    </div>
  )
}

export default function Hub() {
  const { go, done, allDone } = useExperience()
  const [menuOpen, setMenuOpen] = useState(true)

  const gifts = [
    { id: 'wear', label: 'Wear it', route: 'bag' },
    { id: 'book', label: 'Book it', route: 'spa' },
  ]

  const firstOpen = TASKS.find((t) => !done.has(t.id))

  const Item = ({ label, note, isDone, locked, onClick, cursor }) => (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className="w-full text-left flex items-center gap-2 group"
      style={{
        padding: '9px 12px',
        background: 'transparent',
        border: 'none',
        cursor: locked ? 'default' : 'pointer',
      }}
    >
      <span className="flex-1 min-w-0">
        <span
          className="block"
          style={{
            fontSize: 14.5,
            color: locked ? 'var(--ink-40)' : 'var(--ink)',
            textDecorationLine: isDone ? 'line-through' : 'none',
            textDecorationColor: 'var(--accent)',
          }}
        >
          {label}
        </span>
        {note && (
          <span className="block" style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 1 }}>
            {note}
          </span>
        )}
      </span>

      {isDone && (
        <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0">
          <path d="M2 7 L5 10 L11 3" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      {locked && (
        <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true" className="shrink-0">
          <rect x="1" y="5.5" width="9" height="7" rx="1.2" fill="none" stroke="var(--ink-40)" strokeWidth="1.1" />
          <path d="M3 5.5 V3.6 a2.5 2.5 0 0 1 5 0 V5.5" fill="none" stroke="var(--ink-40)" strokeWidth="1.1" />
        </svg>
      )}
      {cursor && !isDone && !locked && (
        <span className="shrink-0" style={{ fontSize: 12, color: 'var(--accent)' }} aria-hidden="true">
          ▸
        </span>
      )}
    </button>
  )

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* ---------- the window ---------- */}
      <motion.div
        className="relative mt-6"
        style={{
          border: '1.5px solid var(--ink)',
          borderRadius: 6,
          background: 'var(--paper-card)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Chrome />

        <div
          className="relative"
          onContextMenu={(e) => {
            e.preventDefault()
            setMenuOpen(true)
          }}
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: '#EAE7E1', cursor: 'context-menu' }}
        >
          <Photo
            src={CONFIG.photos.bag}
            alt="The bag"
            placeholder="THE BAG"
            className="w-full anim-float"
            style={{ aspectRatio: '1 / 1', objectFit: 'contain', padding: '14px 26px' }}
          />

          {/* faux scrollbar, purely decorative */}
          <span
            className="absolute"
            style={{ right: 5, top: 10, bottom: 10, width: 5, background: 'rgba(28,25,23,0.1)', borderRadius: 3 }}
            aria-hidden="true"
          >
            <span
              className="absolute"
              style={{ top: 0, left: 0, right: 0, height: '38%', background: 'var(--ink)', borderRadius: 3 }}
            />
          </span>
        </div>
      </motion.div>

      {/* ---------- the menu ---------- */}
      <motion.div
        className="relative"
        style={{
          marginTop: -18,
          marginLeft: 10,
          marginRight: 42,
          border: '1px solid rgba(28,25,23,0.55)',
          borderRadius: 2,
          background: '#F4F2EE',
          boxShadow: '0 12px 26px rgba(28,25,23,0.16)',
          zIndex: 20,
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, scale: 0.97, originX: 0, originY: 0 }}
        animate={{ opacity: menuOpen ? 1 : 0, scale: menuOpen ? 1 : 0.97 }}
        transition={{ duration: 0.24 }}
      >
        <p
          className="kicker"
          style={{ fontSize: 8.5, color: 'var(--ink-40)', padding: '8px 12px 4px' }}
        >
          Do these first
        </p>

        {TASKS.map((t) => (
          <Item
            key={t.id}
            label={t.label}
            note={done.has(t.id) ? 'done · open it again' : t.hint}
            isDone={done.has(t.id)}
            onClick={() => go(t.route)}
            cursor={firstOpen?.id === t.id}
          />
        ))}

        <div style={{ height: 1, background: 'rgba(28,25,23,0.25)', margin: '4px 0' }} />

        {gifts.map((g) => (
          <Item
            key={g.id}
            label={g.label}
            note={allDone ? 'yours' : 'finish the list first'}
            locked={!allDone}
            onClick={() => go(g.route)}
          />
        ))}
      </motion.div>

      <p
        className="text-center mt-7"
        style={{ fontSize: 13, color: 'var(--ink-40)', lineHeight: 1.5 }}
      >
        {allDone
          ? 'Both of them are yours. Take them in either order.'
          : 'Three things, then the menu unlocks.'}
      </p>
    </div>
  )
}

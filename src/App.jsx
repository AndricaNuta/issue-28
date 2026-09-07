import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ExperienceContext, PAGES, ROUTES, bgFor } from './experience.js'
import { CONFIG } from './config.js'

import Next from './components/Next.jsx'
import TypeSwitch from './components/TypeSwitch.jsx'
import Cover from './scenes/Cover.jsx'
import Pass from './scenes/Pass.jsx'
import Divider from './scenes/Divider.jsx'
import Pack from './scenes/Pack.jsx'
import Plan from './scenes/Plan.jsx'
import Year from './scenes/Year.jsx'
import Bag from './scenes/Bag.jsx'
import Spa from './scenes/Spa.jsx'
import Close from './scenes/Close.jsx'

const SCENES = { cover: Cover, pass: Pass, plan: Plan, year: Year, gift1: Divider, bag: Bag, pack: Pack, gift2: Divider, spa: Spa, close: Close }

// Pages turn about the spine: forward, the outgoing page swings away to the
// left around its own left edge; backward, it mirrors.
const page = {
  enter: (d) => ({ rotateY: d > 0 ? 20 : -20, x: d > 0 ? 30 : -30, opacity: 0 }),
  center: { rotateY: 0, x: 0, opacity: 1 },
  exit: (d) => ({ rotateY: d > 0 ? -100 : 100, x: 0, opacity: 0 }),
}

export default function App() {
  const params = import.meta.env.DEV ? new URLSearchParams(window.location.search) : null

  // Dev-only shortcuts: ?p=<route> opens a page directly, ?done=1 pretends the
  // checklist is finished. Both are stripped from production builds.
  const [route, setRoute] = useState(() => {
    const p = params?.get('p')
    return p && SCENES[p] ? p : 'cover'
  })
  const [dir, setDir] = useState(1)

  const go = useCallback(
    (target) => {
      if (!SCENES[target]) return
      setDir(ROUTES.indexOf(target) >= ROUTES.indexOf(route) ? 1 : -1)
      setRoute(target)
    },
    [route],
  )

  const next = useCallback(() => {
    const i = ROUTES.indexOf(route)
    if (i < ROUTES.length - 1) {
      setDir(1)
      setRoute(ROUTES[i + 1])
    }
  }, [route])

  // The current page's forward action. Held here so the arrow can be pinned
  // to one place on screen rather than trailing each page's content.
  const [cta, setCta] = useState(null)
  const ctx = useMemo(() => ({ route, go, next, setCta }), [route, go, next])

  const Active = SCENES[route]
  const showChrome = route !== 'cover'
  const folio = PAGES[route]?.no

  return (
    <MotionConfig reducedMotion="user">
      <ExperienceContext.Provider value={ctx}>
        <div className="fixed inset-0 overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={route}
              className="absolute inset-0"
              style={{ backgroundImage: bgFor(route) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* the binding edge */}
          <div
            className="absolute inset-y-0 left-0 z-[2] pointer-events-none"
            style={{ width: 18, background: 'linear-gradient(90deg, rgba(26,20,24,0.09), rgba(26,20,24,0))' }}
            aria-hidden="true"
          />

          {/* running head: masthead left, progress right */}
          {showChrome && (
            <div
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
              style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
            >
              <span className="kicker" style={{ color: 'var(--ink-40)' }}>
                {CONFIG.magazineName} · {CONFIG.issueLabel}
              </span>
              <span className="kicker" style={{ color: 'var(--ink-40)' }}>
                Page {String(folio).padStart(2, '0')}
              </span>
            </div>
          )}

          <AnimatePresence>
            {cta && (
              <motion.div
                key={route}
                className="fixed left-0 right-0 z-[60] flex justify-center pointer-events-none"
                style={{ bottom: 'max(26px, env(safe-area-inset-bottom))' }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.32 }}
              >
                <div className="pointer-events-auto">
                  <Next
                    onClick={cta.onClick}
                    label={cta.label}
                    tone={cta.tone}
                    icon={cta.icon}
                    ring={cta.ring !== false}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {import.meta.env.DEV && <TypeSwitch />}

          <div className="absolute inset-0 z-10" style={{ perspective: 1500 }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.section
                key={route}
                custom={dir}
                variants={page}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: [0.36, 0.06, 0.2, 1] }}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar"
                style={{
                  transformOrigin: dir > 0 ? 'left center' : 'right center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  className="min-h-full flex items-center justify-center"
                  style={{ padding: '68px 22px 124px' }}
                >
                  <Active />
                </div>
              </motion.section>
            </AnimatePresence>
          </div>
        </div>
      </ExperienceContext.Provider>
    </MotionConfig>
  )
}

import confetti from 'canvas-confetti'

const PARTY = ['#FF3D7F', '#FFD84D', '#B98CFF', '#6FE3C4', '#FF7A45', '#ffffff']

// The big one — used when a gift lands.
export function party() {
  const end = Date.now() + 800
  ;(function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.9 }, colors: PARTY, zIndex: 80, scalar: 1.1 })
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.9 }, colors: PARTY, zIndex: 80, scalar: 1.1 })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
  confetti({ particleCount: 130, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors: PARTY, zIndex: 80, scalar: 1.1 })
}

// A quick pop — small wins (unlocking, finishing a game).
export function popper(origin = { x: 0.5, y: 0.5 }) {
  confetti({ particleCount: 70, spread: 80, startVelocity: 35, origin, colors: PARTY, zIndex: 80, scalar: 1 })
}

// Sideways glitter, for the spa page — softer, slower, no bang.
export function shimmer() {
  confetti({
    particleCount: 60,
    spread: 120,
    startVelocity: 18,
    gravity: 0.5,
    decay: 0.94,
    ticks: 260,
    origin: { y: 0.45 },
    colors: ['#ffffff', '#FFE9B0', '#D9F5EA', '#FFD6E2'],
    zIndex: 80,
    scalar: 0.9,
  })
}

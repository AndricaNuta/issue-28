import confetti from 'canvas-confetti'

// Bright, and fired upward from the bottom corners, the way Alex's was. The
// paper-toned version I tried first was too polite to read as celebration.
const PARTY = ['#FF5D8F', '#FFD23F', '#7C8CFF', '#2BC4A8', '#FF9A3D', '#ffffff']

// Two cannons at floor level firing up and inward, for as long as asked.
// Emitting every third frame rather than every frame: at 60fps a continuous
// jet buries the page in a few hundred pieces.
export function cannons(seconds = 1.6) {
  const end = Date.now() + seconds * 1000
  let tick = 0
  ;(function frame() {
    tick += 1
    if (tick % 3 === 0) {
      confetti({
      particleCount: 4,
        angle: 60,
        spread: 70,
        startVelocity: 58,
        origin: { x: 0, y: 0.96 },
        colors: PARTY,
        zIndex: 80,
        scalar: 1.05,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        startVelocity: 58,
        origin: { x: 1, y: 0.96 },
        colors: PARTY,
        zIndex: 80,
        scalar: 1.05,
      })
    }
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

// A gift landing: the cannons, plus one burst up through the middle.
export function party() {
  cannons(0.8)
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 52,
    origin: { x: 0.5, y: 0.9 },
    colors: PARTY,
    zIndex: 80,
    scalar: 1.05,
  })
}

// A smaller one, for a reveal that is not a gift.
export function popper(origin = { x: 0.5, y: 0.9 }) {
  confetti({ particleCount: 70, spread: 80, startVelocity: 45, origin, colors: PARTY, zIndex: 80 })
}

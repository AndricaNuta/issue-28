import { useCallback, useRef, useState } from 'react'

// Shared pointer-drag plumbing for the two pages that need it: packing wishes
// into the bag, and putting the bag on her arm. Positions are percentages of a
// reference frame, so a target set on a phone still holds on a laptop.
export function usePointerDrag(frameRef, { onDrop, initial = null } = {}) {
  const grab = useRef({ dx: 0, dy: 0 })
  const [pos, setPos] = useState(initial)
  const [dragging, setDragging] = useState(false)

  const pct = useCallback(
    (e) => {
      const r = frameRef.current.getBoundingClientRect()
      return {
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      }
    },
    [frameRef],
  )

  const onPointerDown = useCallback(
    (e) => {
      if (!frameRef.current) return
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // Without capture the drag still tracks while the pointer stays on the
        // element, which is good enough.
      }
      const p = pct(e)
      const start = pos ?? p
      grab.current = { dx: start.x - p.x, dy: start.y - p.y }
      setDragging(true)
    },
    [frameRef, pct, pos],
  )

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging) return
      const p = pct(e)
      setPos({ x: p.x + grab.current.dx, y: p.y + grab.current.dy })
    },
    [dragging, pct],
  )

  const onPointerUp = useCallback(
    (e) => {
      if (!dragging) return
      setDragging(false)
      const p = pct(e)
      onDrop?.({ x: p.x + grab.current.dx, y: p.y + grab.current.dy })
    },
    [dragging, pct, onDrop],
  )

  return {
    pos,
    setPos,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
}

// Distance between two points expressed in percentages of a frame's WIDTH, so
// the hit area is a circle on screen instead of an oval.
export function frameDistance(a, b, aspect) {
  return Math.hypot(a.x - b.x, (a.y - b.y) * aspect)
}

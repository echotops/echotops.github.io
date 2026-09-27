import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// Matches the cardOut animation's own duration in each page's CSS module
// (0.25s) — cards should be removed from the DOM right as their fade
// finishes, not before (cutting it off) or noticeably after.
const EXIT_MS = 250

// Enter/exit bookkeeping for a filtered grid. The instant a card starts
// leaving, it's measured and immediately pulled out of grid flow
// (position:absolute, pinned at that exact spot via the returned
// leavingRects — see .card[data-leaving] in the page's own CSS module)
// instead of staying a grid item until it's actually removed exitMs later.
// Left in flow, the remaining cards couldn't reflow into its space until
// the whole fade finished, which read as a delay between clicking a filter
// and anything visibly moving. Pulling it out immediately lets the grid —
// and so useGridFlip — react at click time; the leaving card just fades
// out independently at its last known position.
// One shared timer per filter change (not one per removed card): several
// cards can leave from the same click, and separate setTimeout callbacks —
// even with an identical delay — fire as separate macrotasks, each
// triggering its own render. Batching avoids firing useGridFlip repeatedly
// in quick succession, which can let one run interrupt another's pending
// double-rAF reset before it has a chance to animate. Timers are tracked
// per-batch (a Set, not one overwritten ref) so a second filter click while
// the first batch is still fading out doesn't cancel and lose track of it.
// Rescue handling: if a card that's mid-leave becomes wanted again before
// its timer fires (the user flips between filters faster than exitMs), it's
// removed from leavingIds immediately, restoring it to normal grid flow.
// Each batch's timer also re-checks shownRef at execution time instead of
// trusting its captured `removed` list — without that, a rescued card's
// original removal timer would still fire later and delete it anyway,
// since it has no way to know the card was rescued in the meantime.
export function useRenderedIds(shownIds, gridRef, exitMs = EXIT_MS) {
  const [renderedIds, setRenderedIds] = useState(() => new Set(shownIds))
  const [leavingIds, setLeavingIds] = useState(() => new Set())
  const [leavingRects, setLeavingRects] = useState({})
  const renderedRef = useRef(renderedIds)
  renderedRef.current = renderedIds
  const shownRef = useRef(new Set(shownIds))
  const timers = useRef(new Set())

  useEffect(() => {
    const nextShown = new Set(shownIds)
    shownRef.current = nextShown
    const prevRendered = renderedRef.current
    const removed = [...prevRendered].filter((id) => !nextShown.has(id))

    if (removed.length && gridRef.current) {
      // Measured while still a normal grid item, relative to the grid
      // container (not the viewport) so the pinned position is correct
      // regardless of the container's own position on the page.
      const gridRect = gridRef.current.getBoundingClientRect()
      const rects = {}
      removed.forEach((id) => {
        const el = gridRef.current.querySelector(`[data-card-id="${id}"]`)
        if (el) {
          const r = el.getBoundingClientRect()
          rects[id] = { top: r.top - gridRect.top, left: r.left - gridRect.left, width: r.width, height: r.height }
        }
      })
      setLeavingRects((prev) => ({ ...prev, ...rects }))
    }

    setRenderedIds(new Set([...prevRendered, ...nextShown]))

    setLeavingIds((prevLeaving) => {
      const next = new Set(prevLeaving)
      removed.forEach((id) => next.add(id))
      nextShown.forEach((id) => next.delete(id))
      return next
    })

    if (removed.length) {
      const id = setTimeout(() => {
        timers.current.delete(id)
        const stillRemoved = removed.filter((rid) => !shownRef.current.has(rid))
        setRenderedIds((r) => {
          const next = new Set(r)
          stillRemoved.forEach((rid) => next.delete(rid))
          return next
        })
        setLeavingIds((l) => {
          const next = new Set(l)
          stillRemoved.forEach((rid) => next.delete(rid))
          return next
        })
        setLeavingRects((prev) => {
          const next = { ...prev }
          stillRemoved.forEach((rid) => delete next[rid])
          return next
        })
      }, exitMs)
      timers.current.add(id)
    }
  }, [shownIds.join('|')])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  return { renderedIds, leavingIds, leavingRects }
}

// True layout position for one element: decode whatever translate offset is
// currently rendered (via computed style) and subtract it out of the
// measured rect, converting to document coordinates. Correct regardless of
// whether the element is at rest, mid-invert, or mid-transition, since
// renderedPosition = trueLayoutPosition + currentTransformOffset always
// holds — see the long comment on useGridFlip below for why this matters.
function measureTrueRect(el, scrollX, scrollY) {
  const computed = getComputedStyle(el).transform
  let offsetX = 0
  let offsetY = 0
  if (computed && computed !== 'none') {
    const matrix = new DOMMatrix(computed)
    offsetX = matrix.m41
    offsetY = matrix.m42
  }
  const rect = el.getBoundingClientRect()
  return { left: rect.left - offsetX + scrollX, top: rect.top - offsetY + scrollY }
}

// FLIP: after every commit, compare each still-visible card's true layout
// position to the one recorded on the previous run and, if it moved
// (because other cards were added/removed around it and the grid
// reflowed), replay that jump as a transform animation instead of letting
// it snap. Cards with no previous rect (just entered) or marked
// data-leaving are skipped — they already have their own opacity
// animation (or, for leaving cards, their own pinned absolute position),
// and layering a position-transform on top of that would fight it.
// Rects are recorded in document coordinates (rect + scroll offset), not
// raw getBoundingClientRect() viewport coordinates: scrolling the page
// between two runs shifts every element's viewport position identically
// without anything actually reflowing, and comparing raw viewport rects
// would read that scroll delta as every card having moved.
// This effect fires more than once per interaction (once when cards are
// pulled from flow, again later when they're actually deleted), and the
// second firing can land while the first's animation is still playing.
// getComputedStyle always reports the actual rendered transform matrix
// regardless of what state the animation is in, and subtracting its
// decoded translate out of the measured rect always yields the true,
// untransformed layout position — true whether the element is at rest,
// mid-invert, or mid-transition. When no new delta is found, the element
// is left completely untouched so anything already animating just keeps
// playing natively.
export function useGridFlip(gridRef, dep) {
  const prevRects = useRef(new Map())
  const pending = useRef(new Map())
  const zIndexCleanup = useRef(new Map())

  const runFlip = useCallback(() => {
    const cards = gridRef.current ? gridRef.current.querySelectorAll('[data-card-id]') : []
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    cards.forEach((el) => {
      const id = el.dataset.cardId

      if (el.dataset.leaving !== undefined) {
        // Leaving cards are pinned via their own absolute position and
        // don't participate in FLIP — drop any recorded position instead
        // of refreshing it, so that if this id is later filtered back in,
        // it's measured fresh (no `prev`) and treated as a plain entrance
        // (cardIn only). Without this, a stale rect from right before it
        // left would still be sitting in the map — this hook doesn't get
        // another chance to update it while the card is actually removed
        // from the DOM ~exitMs later, since that removal doesn't change
        // the in-flow id list this hook depends on — so a re-entering
        // card would be measured against that long-gone position and
        // misread as "moving" from it, wrongly picking up the moving-card
        // z-index lift below on what's really just a fade-in.
        prevRects.current.delete(id)
        return
      }

      const docRect = measureTrueRect(el, scrollX, scrollY)
      const prev = prevRects.current.get(id)

      let dx = 0
      let dy = 0
      if (prev) {
        dx = prev.left - docRect.left
        dy = prev.top - docRect.top
      }

      if (dx || dy) {
        const pendingIds = pending.current.get(id)
        if (pendingIds) {
          pendingIds.forEach((rafId) => cancelAnimationFrame(rafId))
          pending.current.delete(id)
        }
        const oldCleanup = zIndexCleanup.current.get(id)
        if (oldCleanup) oldCleanup()

        el.style.transition = 'none'
        el.style.transform = `translate(${dx}px, ${dy}px)`
        // Lifted above fading (entering/leaving) cards for the duration of
        // the slide, so a moving card doesn't visually tuck itself behind
        // a neighbor mid-flight. Cleared on transitionend, not when the
        // transform is reset to identity below — that reset is itself
        // what's animating, so clearing z-index at the same moment would
        // drop it back down while still visibly sliding.
        el.style.zIndex = '2'
        el.getBoundingClientRect()
        const raf1 = requestAnimationFrame(() => {
          const raf2 = requestAnimationFrame(() => {
            el.style.transition = 'transform 0.35s ease-out'
            el.style.transform = ''
            const clearZ = () => {
              el.style.zIndex = ''
              // The inline transition set above only lists `transform` —
              // left in place, it permanently overrides the CSS class's
              // own transition (translate/border-color/box-shadow, for the
              // hover lift), since an inline shorthand replaces the whole
              // declaration rather than merging with it. Clearing it once
              // the slide is done hands control back to the stylesheet, so
              // a card that has been FLIP'd at least once doesn't lose its
              // smooth hover transition forever after.
              el.style.transition = ''
              el.removeEventListener('transitionend', onTransitionEnd)
              clearTimeout(fallbackId)
              zIndexCleanup.current.delete(id)
            }
            const onTransitionEnd = (e) => {
              if (e.propertyName !== 'transform') return
              clearZ()
            }
            // transitionend isn't guaranteed to fire (an interrupted
            // transition, prefers-reduced-motion collapsing it to zero
            // duration, etc.) — a timeout matched to the transition's own
            // duration is the reliable backstop, same idea as EXIT_MS
            // backstopping the exit fade above.
            const fallbackId = setTimeout(clearZ, 400)
            el.addEventListener('transitionend', onTransitionEnd)
            zIndexCleanup.current.set(id, () => {
              el.removeEventListener('transitionend', onTransitionEnd)
              clearTimeout(fallbackId)
            })
            pending.current.delete(id)
          })
          pending.current.set(id, [raf1, raf2])
        })
        pending.current.set(id, [raf1])
      }
      // else: no new delta — the element is left entirely alone, so
      // whatever's currently happening (settled, or still transitioning)
      // continues completely undisturbed.

      prevRects.current.set(id, docRect)
    })
  }, [gridRef])

  useLayoutEffect(() => {
    runFlip()
  }, [dep, runFlip])

  // Resizing the window changes the grid's column count (auto-fill),
  // reflowing every card without dep changing (same cards, same ids) — so
  // prevRects would otherwise sit stale at the pre-resize positions. The
  // bug that caused: resize the window, then apply a filter, and the FLIP
  // animation would invert from wherever cards were *before* the resize,
  // not their actual current position.
  // This isn't a full runFlip pass, deliberately — resizing shouldn't
  // itself trigger a visible slide, just keep the reference point current.
  // It re-measures every in-flow card's true position and updates
  // prevRects directly, with no transform/transition/pending touched at
  // all, so nothing animates here — only the *next* real reflow (a filter
  // change) does, correctly, from the right position.
  useEffect(() => {
    const onResize = () => {
      const cards = gridRef.current ? gridRef.current.querySelectorAll('[data-card-id]') : []
      const scrollX = window.scrollX
      const scrollY = window.scrollY
      cards.forEach((el) => {
        if (el.dataset.leaving !== undefined) return
        prevRects.current.set(el.dataset.cardId, measureTrueRect(el, scrollX, scrollY))
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [gridRef])
}

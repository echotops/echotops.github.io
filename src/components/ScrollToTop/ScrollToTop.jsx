import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// useLayoutEffect (not useEffect): runs before paint and before any page's
// own useLayoutEffect that reads scroll position on mount — otherwise that
// page computes its initial state from the previous page's stale scroll
// position, then visibly snaps once this resets scroll and fires a
// 'scroll' event.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

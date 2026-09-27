import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import Hero from '../../components/Hero/Hero'
import ProjectsGrid from '../../components/ProjectsGrid/ProjectsGrid'
import { useNavSection } from '../../context/NavSectionContext'
import styles from './home.module.css'

// How far down the viewport (0 = very top, 100 = very bottom) the grid's
// top edge needs to cross before the navbar switches from highlighting
// "Home" to highlighting "Projects" (and back, the other way, as it
// crosses back down past this same line on the way up). This is the
// number to change — nothing else in this file encodes the crossing
// point.
const SECTION_VIEWPORT_PERCENT = 50

export default function Home() {
  const location = useLocation()
  const { setSection } = useNavSection()
  const workRef = useRef(null)

  // "/projects" and "/" both render this component (see App.jsx) —
  // landing directly on "/projects" (a bookmark, a shared link, a nav
  // click from elsewhere) jumps straight to the grid instead of the top.
  // ScrollToTop's own scrollTo(0, 0) (it runs first, see that file) gets
  // overridden here when that's the case.
  //
  // setSection here too, not just the scroll: NavSectionProvider lives
  // above <Routes> (see App.jsx), so it isn't remounted by this navigation
  // and its section state is whatever it was left at — stale, if the last
  // page shown was Software/Digital (which never touch it) or the other
  // half of this same unified page. Without this, the navbar would render
  // one frame in that stale state (its home/projects link and logo, per
  // Navbar.jsx's isHome) before the IntersectionObserver effect below gets
  // to run and correct it — a visible glitch, flashing the wrong navbar
  // state right after a click before snapping to the right one. Setting
  // it synchronously here, in the same layout effect as the scroll and
  // before the browser paints, means the first paint is already correct;
  // the observer's own mandatory initial callback just confirms it.
  useLayoutEffect(() => {
    const onProjects = location.pathname === '/projects'
    setSection(onProjects ? 'projects' : 'home')
    if (onProjects) {
      workRef.current?.scrollIntoView()
    }
  }, [])

  // Home and Projects used to be two separate routes connected by a
  // scroll-driven navigate() between them — the swap always introduced a
  // small stutter (React fully unmounting one page's component tree and
  // mounting the other's is real work, even when the content is visually
  // identical) that turned out not to be worth chasing further. This is
  // the replacement: one page, and the navbar's active link tracks scroll
  // position instead of the route — see NavSectionContext and Navbar.jsx.
  //
  // IntersectionObserver, not a scroll listener manually comparing
  // getBoundingClientRect() on every event: shrinking the observer's root
  // turns "element top crosses X% of the viewport" into a plain
  // intersection check the browser tracks natively (off the main thread,
  // no polling), which is both more efficient and more reliable than
  // hand-rolled scroll math.
  //
  // Shrinking the BOTTOM of the root (not the top): #work is a tall
  // element that extends well past the bottom of the viewport, so
  // shrinking the root's top does nothing useful for it — the moment any
  // sliver of it becomes visible at the very bottom edge of the screen,
  // it already overlaps that shrunk region regardless of the percentage.
  // Shrinking the bottom instead anchors a line near the TOP of the
  // viewport, and #work only starts overlapping that once its own top
  // edge actually reaches it — which is the crossing we actually want to
  // detect, in both directions (scrolling down past it, or back up past
  // it again).
  //
  // Unlike the old cross-page hand-off, there's no harm in this firing on
  // its own mandatory initial callback (reporting whatever the section
  // already is right as the observer starts watching) — worst case is a
  // highlight correcting itself within the same frame, not an unwanted
  // page navigation, so this doesn't need the scroll-gating the old
  // version needed.
  //
  // window.history.replaceState (not react-router's navigate) keeps the
  // address bar showing "/projects" while that section is on screen: it
  // changes only the visible URL, completely bypassing React Router's own
  // matching/rendering, so it can never cause this component (or anything
  // else) to re-render or remount — which a scroll-driven URL change must
  // never do. replaceState (not pushState) also means scrolling back and
  // forth across the boundary doesn't spam the browser history with an
  // entry per crossing.
  useEffect(() => {
    const el = workRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const onProjects = entry.isIntersecting
        setSection(onProjects ? 'projects' : 'home')
        const targetPath = onProjects ? '/projects' : '/'
        if (window.location.pathname !== targetPath) {
          window.history.replaceState(window.history.state, '', targetPath)
        }
      },
      { rootMargin: `0px 0px -${100 - SECTION_VIEWPORT_PERCENT}% 0px`, threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [setSection])

  return (
    <>
      <main className={styles.page}>
        <Hero />
        <div id="work" ref={workRef}>
          <ProjectsGrid />
        </div>
      </main>

      <Footer />
    </>
  )
}

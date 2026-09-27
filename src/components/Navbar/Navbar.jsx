import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNavSection } from '../../context/NavSectionContext'
import styles from './navbar.module.css'

// Home and Projects are sections of one unified page, reachable at either
// "/" or "/projects" (see Home.jsx and App.jsx) — the `section` each one
// carries is what actually distinguishes them, both for highlighting (see
// isActive) and for the click behavior below. `to` is still the real URL
// for each (not both "/"), so a middle-click/right-click-copy-link on
// "Projects" gets the correct address — the onClick handler always
// intercepts an ordinary left-click before this is ever followed.
const links = [
  { label: 'Home', to: '/', section: 'home' },
  { label: 'Projects', to: '/projects', section: 'projects' },
  { label: 'Software', to: '/software' },
  { label: 'Digital Assets', to: '/digital' },
]

const isOnUnifiedPage = (pathname) => pathname === '/' || pathname === '/projects'

// The logo appearing/disappearing shifts this element's position instantly
// (margin:auto and similar layout changes can't be transitioned by CSS), so
// on every change we replay that jump as a FLIP transform to make it read
// as a slide instead.
function useSlideOnChange(ref, dep) {
  const prevLeftRef = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const left = el.getBoundingClientRect().left
    const prevLeft = prevLeftRef.current
    if (prevLeft !== null && prevLeft !== left) {
      const dx = prevLeft - left
      el.style.transition = 'none'
      el.style.transform = `translateX(${dx}px)`
      el.getBoundingClientRect()
      // A single rAF can still land before the browser's next paint, which
      // would collapse the invert-then-transition into one frame and skip
      // the animation entirely — waiting two frames guarantees the inverted
      // starting position has actually been painted first.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
          el.style.transform = ''
        })
      })
    }
    prevLeftRef.current = left
  }, [dep])
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { section, setSection } = useNavSection()
  // Drives the logo fade, link centering/gap, and the slide transform
  // below — i.e. exactly the visual difference the old separate Home and
  // Projects pages had. Tying it to section (not just the route) is what
  // makes the navbar "switch to the Projects state" as you scroll past
  // the section boundary and back, per the request that introduced this.
  const isHome = isOnUnifiedPage(pathname) && section === 'home'
  const linksRef = useRef(null)
  const toggleRef = useRef(null)

  useSlideOnChange(linksRef, isHome)
  useSlideOnChange(toggleRef, isHome)

  // The toggle button that opens/closes this is hidden past the same
  // breakpoint (navbar.module.css), so if the menu is open when the
  // viewport widens past it, there's no longer any control that could
  // close it — close it here instead of leaving it stuck open.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 881px)')
    const onChange = (e) => {
      if (e.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Home/Projects are active based on scroll section, not which of their
  // two URLs is current — everything else keeps the old path-based check.
  const isActive = (link) =>
    link.section ? isOnUnifiedPage(pathname) && section === link.section : pathname.startsWith(link.to)

  // Home/Projects are already on screen (just scrolled to a different
  // part of the one page) whenever either of their two URLs is current —
  // clicking just scrolls there (the browser default view stays instant
  // unless a page-level control, like the hero's own "Projects ↓" button,
  // opts into smooth), never navigates. Coming from elsewhere: navigate
  // to the section's own URL, and set the section here too rather than
  // leaving it to Home's own landing effect (see that file) to correct
  // once it mounts.
  //
  // That second option sounds redundant — Home does set it, and layout
  // effects run before the browser paints either way — but it isn't:
  // useSlideOnChange above measures the links' position on *every* layout
  // effect run where isHome changed, and plays a slide between whatever
  // two positions it saw, regardless of whether the first of those was
  // ever actually painted. Landing from elsewhere (e.g. Software) with a
  // stale `section` left over from earlier means Navbar's first render
  // after the click still computes the old, wrong isHome; Home's own
  // effect then corrects it a commit later, which is invisible on its own
  // (no paint happens in between) but still gives useSlideOnChange two
  // different measurements to FLIP between, playing a phantom slide from
  // a layout the user never actually saw. Setting it right here, in the
  // same click handler as the navigation itself, means Navbar's very
  // first render after the click already has the right isHome — nothing
  // left to correct, so nothing left to phantom-slide from.
  const handleNavClick = (link) => (e) => {
    if (!link.section) return
    e.preventDefault()
    if (isOnUnifiedPage(pathname)) {
      if (link.section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      setSection(link.section)
      navigate(link.to)
    }
  }

  return (
    <>
      <nav className={styles.navbar} data-home={isHome || undefined}>
        <Link
          to="/"
          className={styles.logo}
          aria-hidden={isHome || undefined}
          tabIndex={isHome ? -1 : undefined}
        >
          <img src="/global/name.png" height="45" alt="Ethan Rosenfeld" />
        </Link>
        {/* linksSlide carries the FLIP transform; links carries the gap
            transition. Keeping them on separate elements means the JS-driven
            inline transform never overwrites the CSS-driven gap transition
            (setting el.style.transition replaces the whole property, so the
            two can't safely share a node). */}
        <div className={styles.linksSlide} ref={linksRef}>
          <div className={styles.links}>
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={styles.item}
                data-active={isActive(link) || undefined}
                onClick={handleNavClick(link)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          ref={toggleRef}
          className={styles.toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
          data-open={open || undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={styles.dropdownAnchor}>
        <nav className={styles.dropdown} data-open={open || undefined}>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={styles.dropdownItem}
              data-active={isActive(link) || undefined}
              onClick={(e) => {
                handleNavClick(link)(e)
                setOpen(false)
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

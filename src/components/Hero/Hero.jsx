import { useEffect, useState } from 'react'
import styles from './hero.module.css'

export default function Hero() {
  // Lazy initializer (not a plain `false`): the unified Home page can
  // mount already scrolled well past 40px (landing on the projects
  // section via a nav click or a project write-up's back-link) —
  // defaulting to false made the prompt render visible for a frame
  // regardless, then immediately transition out once the scroll listener
  // below caught up, which read as an unwanted pop-in-then-fade-out.
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroText}>
          <h1 className={styles.name}>Ethan Rosenfeld</h1>
          <p className={styles.tagline}>
            I’m the fluid systems team lead and a propulsion engineer on DukeAERO, where I work on
            both liquid engines and solid rocket motors. Outside of rocketry I build interactive
            physics and math software, and I’m an instrument-rated private pilot.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.ctaPrimary} href="/global/resume.pdf" target="_blank" rel="noreferrer">
              Resume ↗
            </a>
            <a className={styles.ctaSecondary} href="mailto:ethan.rosenfeld@duke.edu">Contact</a>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <img className={styles.heroImage} src="/global/linkedin.jpeg" alt="Ethan Rosenfeld" />
        </div>
      </div>

      <button
        type="button"
        className={styles.scrollPrompt}
        data-hidden={scrolled || undefined}
        onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>Projects</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  )
}

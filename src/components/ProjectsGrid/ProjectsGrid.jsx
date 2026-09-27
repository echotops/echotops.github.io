import { Link } from 'react-router-dom'
import styles from './projectsGrid.module.css'

// The project listing section of the unified Home page (see Home.jsx) —
// pulled out into its own component mainly for readability.
//
// One card per *project*, not per year — a project spanning multiple
// years (e.g. DukeAERO Liquids running 2025 and 2026) gets a single card
// linking to a single consolidated write-up (see
// src/pages/Projects/DukeAeroLiquids.jsx and its App.jsx route),
// rather than the old one-card-per-year-per-project layout. `years` is an
// array so that write-up can be found and so the year badge/sort below
// can be derived from it, newest-first, without duplicating a project's
// name across multiple entries. The year badge is a small overlay on the
// photo (see .cardYear) rather than a bottom tag pill, so it reads as a
// date stamp on the image instead of a category label. Entries with no
// *photo* yet (img is falsy) get a drafting-themed placeholder in its
// place instead of just skipping straight to the text (see
// .cardPlaceholder) — every card keeps the same media-then-text shape
// this way, badge included, rather than a card with a photo looking
// structurally different from one without.
// Each project's own thumbnail.png (under public/projects/<ProjectName>/,
// alongside its write-up's own figures — see src/pages/Projects/) rather
// than the old shared public/projects/thumbnails/ folder, now that every
// project has its own asset folder regardless of whether its write-up is
// done yet.
const projects = [
  { years: [2025, 2026], title: 'DukeAERO Liquid Propulsion', desc: 'Developing Duke\'s first liquid rocket motor', img: '/projects/DukeAeroLiquids/thumbnail.png', href: '/projects/dukeaero-liquids' },
  { years: [2025, 2026], title: 'DukeAERO Solid Propulsion', desc: 'Designing and refining solid rocket motors', img: '/projects/DukeAeroSolids/thumbnail.png', href: '/projects/dukeaero-solids' },
  { years: [2026], title: 'Project Saker', desc: 'Building an air-intercept VTOL UAV', img: '/projects/ProjectSaker/thumbnail.png', href: '/projects/project-saker' },
  { years: [2026], title: 'Telescope iPhone Mount', desc: 'Camera stabilization for astrophotography', img: '/projects/TelescopeMount/thumbnail.png', href: '/projects/telescope-iphone-mount' },
  { years: [2024], title: 'Synthetic Aperture Radar', desc: 'Coding radars and finding landmines at MIT', img: '/projects/SyntheticApertureRadar/thumbnail.png', href: '/projects/synthetic-aperture-radar' },
]

const latestYear = (p) => Math.max(...p.years)

const formatYears = (years) =>
  years.length === 1 ? String(years[0]) : `${Math.min(...years)}–${Math.max(...years)}`

const sortedProjects = [...projects].sort((a, b) => latestYear(b) - latestYear(a))

export default function ProjectsGrid() {
  return (
    <div className={styles.grid}>
      {sortedProjects.map((p) => (
        <Link key={p.title} className={styles.card} data-empty={!p.img || undefined} to={p.href || '/under-construction'}>
          <div className={styles.cardMedia}>
            {p.img ? (
              <img className={styles.cardImg} src={p.img} alt="" />
            ) : (
              <div className={styles.cardPlaceholder}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 3.5" />
                  <path d="M15 2v6M15 22v6M2 15h6M22 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
            )}
            <span className={styles.cardYear}>{formatYears(p.years)}</span>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.cardTitle}>{p.title}</p>
            <p className={styles.cardDesc}>{p.desc}</p>
            <span className={styles.cardArrow} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8h9M8.5 4.5L13 8l-4.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

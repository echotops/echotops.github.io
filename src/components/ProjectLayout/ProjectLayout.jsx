import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Prism from 'prismjs'
import 'prismjs/components/prism-julia'
import Footer from '../Footer/Footer'
import styles from './projectLayout.module.css'

// Shared template for individual project write-ups (hardware, software,
// etc). Pages using this just supply a title/subtitle and compose their
// body out of the Heading / Paragraph / Figure / FigureGrid primitives
// below — see ExampleProject.jsx for the pattern to copy.
export default function ProjectLayout({ category, categoryHref, title, subtitle, children }) {
  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          {category && categoryHref && (
            <Link className={styles.back} to={categoryHref}>
              ← {category}
            </Link>
          )}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>

        <div className={styles.body}>{children}</div>
      </main>
      <Footer />
    </>
  )
}

export function Heading({ children }) {
  return <h2 className={styles.heading}>{children}</h2>
}

export function Paragraph({ children }) {
  return <p className={styles.paragraph}>{children}</p>
}

export function Figure({ src, alt = '', caption }) {
  return (
    <figure className={styles.figure}>
      <img src={src} alt={alt} />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}

// Same shape as Figure (shares its styles.figure/styles.caption so it also
// works as a FigureGrid child), for a looping muted preview clip instead of
// a still image.
export function Video({ src, caption }) {
  return (
    <figure className={styles.figure}>
      <video src={src} autoPlay loop muted playsInline controls />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}

// Two or more Figures side by side, e.g. <FigureGrid><Figure .../><Figure .../></FigureGrid>.
export function FigureGrid({ columns = 2, children }) {
  return (
    <div className={styles.figureGrid} style={{ '--figure-grid-columns': columns }}>
      {children}
    </div>
  )
}

// KaTeX is loaded on first use rather than imported at the top: this file is
// part of the main bundle (every page that uses ProjectLayout is imported by
// App.jsx), and KaTeX plus its stylesheet are far larger than the rest of
// this file. A dynamic import splits them into their own chunk, fetched only
// on a page that actually renders an <Equation>.
let katexPromise = null
function loadKatex() {
  if (!katexPromise) {
    katexPromise = Promise.all([import('katex'), import('katex/dist/katex.min.css')]).then(([m]) => m.default)
  }
  return katexPromise
}

// TeX, e.g. <Equation>{String.raw`\mathbf{F} = m\mathbf{a}`}</Equation> for a
// centered display equation, or <Equation inline>...</Equation> inside a
// Paragraph. String.raw keeps the TeX backslashes from being read as JS escapes.
export function Equation({ children, inline = false }) {
  const tex = String(children)
  const [html, setHtml] = useState('')

  useEffect(() => {
    let cancelled = false
    loadKatex().then((katex) => {
      if (!cancelled) setHtml(katex.renderToString(tex, { displayMode: !inline, throwOnError: false }))
    })
    return () => {
      cancelled = true
    }
  }, [tex, inline])

  const Tag = inline ? 'span' : 'div'
  return <Tag className={inline ? undefined : styles.equation} dangerouslySetInnerHTML={{ __html: html }} />
}

// Syntax-highlighted code, e.g. <CodeBlock>{`function foo()\n  ...\nend`}</CodeBlock>.
// Same look as the Covariant.jl docs' code blocks: Prism's Julia grammar with
// Tokyo Night token colors (see .code in projectLayout.module.css) and a copy
// button. Highlighted to an HTML string rather than via Prism.highlightElement
// on a mounted node, so React never has to reconcile a DOM Prism has rewritten.
// The <code> deliberately has no "language-*" class: Prism's own auto-run on
// page load would otherwise find it and re-highlight the finished markup.
export function CodeBlock({ children, lang = 'julia' }) {
  const code = String(children)
  const html = useMemo(
    () => Prism.highlight(code, Prism.languages[lang], lang),
    [code, lang],
  )
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={styles.codeBlock}>
      <button type="button" className={styles.codeCopy} data-copied={copied || undefined} onClick={copy}>
        {copied ? 'copied' : 'copy'}
      </button>
      <pre className={styles.code}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}

// Data table, e.g. <Table headers={['A', 'B']} rows={[['1', '2']]} caption="..." />.
// When the table is wider than its column it scrolls horizontally; a small
// arrow hints at that and fades out once the table itself is scrolled.
export function Table({ headers, rows, caption }) {
  const scrollRef = useRef(null)
  const theadRef = useRef(null)
  const [overflowing, setOverflowing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const checkOverflow = () => {
      setOverflowing(el.scrollWidth > el.clientWidth + 1)
      setHeaderHeight(theadRef.current?.offsetHeight ?? 0)
    }
    const onScroll = () => setScrolled(el.scrollLeft > 8)

    checkOverflow()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', checkOverflow)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [])

  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableScrollOuter}>
        <div className={styles.tableScroll} ref={scrollRef}>
          <table className={styles.table}>
            <thead ref={theadRef}>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {overflowing && (
          <button
            type="button"
            className={styles.tableScrollHint}
            data-hidden={scrolled || undefined}
            onClick={() => scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth * 0.5, behavior: 'smooth' })}
            aria-label="Scroll table right"
          >
            {/* Two stacked fades instead of one: the header row sits on
                --surface, the body rows sit on --background, so a single
                gradient color would be wrong for one or the other. */}
            <div className={styles.tableScrollHintHeader} style={{ height: headerHeight }} />
            <div className={styles.tableScrollHintBody} />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  )
}

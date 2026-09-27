import { useRef, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useGridFlip, useRenderedIds } from '../../hooks/useFilterGridAnimation'
import styles from './digital.module.css'

const assets = [
  { id: 'kayz', title: "Zahn's", sub: 'KAYZ', img: '/digital/thumbnails/kayz.jpg', href: 'https://flightsim.to/file/96408/kayz-zahn-s', sim: 'MSFS', type: 'Scenery' },
  { id: 'kjpx', title: 'East Hampton', sub: 'KJPX', img: '/digital/thumbnails/kjpx.jpg', href: 'https://flightsim.to/file/75357/kjpx-town-of-east-hampton', sim: 'MSFS', type: 'Scenery' },
  { id: 'khwv', title: 'Brookhaven', sub: 'KHWV', img: '/digital/thumbnails/khwv.jpg', href: 'https://flightsim.to/file/64914/khwv-brookhaven', sim: 'MSFS', type: 'Scenery' },
  { id: 'ny03', title: 'Klenawicus', sub: 'NY03', img: '/digital/thumbnails/ny03.jpg', href: 'https://flightsim.to/file/84613/ny3-klenawicus', sim: 'MSFS', type: 'Scenery' },
  { id: 'kjra', title: 'West 30th St.', sub: 'KJRA', img: '/digital/thumbnails/kjra.jpg', href: 'https://flightsim.to/file/75354/kjra-west-30th-street-heliport', sim: 'MSFS', type: 'Scenery' },
  { id: '21n', title: 'Mattituck', sub: '21N', img: '/digital/thumbnails/21n.jpg', href: 'https://flightsim.to/file/64076/21n-mattituck', sim: 'MSFS', type: 'Scenery' },
  { id: '7b2', title: 'Northampton', sub: '7B2', img: '/digital/thumbnails/7b2.jpg', href: 'https://flightsim.to/file/63488/7b2-northampton', sim: 'MSFS', type: 'Scenery' },
  { id: 'n67ad', title: 'N67AD', sub: 'Cessna C182T', img: '/digital/thumbnails/n67ad.jpg', href: 'https://flightsim.to/file/60007/carenado-c182t-n67ad', sim: 'MSFS', type: 'Livery' },
  { id: '2-17-b', title: '2-17 Cav B Trp 95008', sub: 'Bell OH-58D', img: '/digital/thumbnails/dcs1.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3338449/', sim: 'DCS', type: 'Livery' },
  { id: '6-6-c', title: '6-6 Cav C Trp 97053', sub: 'Boeing AH-64D', img: '/digital/thumbnails/dcs2.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3330926/', sim: 'DCS', type: 'Livery' },
  { id: '2-17-a', title: '2-17 Cav A Trp', sub: 'Boeing AH-64D', img: '/digital/thumbnails/dcs3.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3329145/', sim: 'DCS', type: 'Livery' },
  { id: '1-10', title: '1-10 Av 26290', sub: 'Boeing AH-64D', img: '/digital/thumbnails/dcs4.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3329075/', sim: 'DCS', type: 'Livery' },
  { id: '1-101-c', title: '1-101 Av C Co', sub: 'Boeing AH-64D', img: '/digital/thumbnails/dcs5.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3328363/', sim: 'DCS', type: 'Livery' },
  { id: '1-101-b', title: '1-101 Av B Co', sub: 'Boeing AH-64D', img: '/digital/thumbnails/dcs6.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3328362/', sim: 'DCS', type: 'Livery' },
  { id: '5-101-c', title: '5-101 Av C Co', sub: 'Sikorsky UH-60L', img: '/digital/thumbnails/dcs7.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3326588/', sim: 'DCS', type: 'Livery' },
  { id: '5-101-a', title: '5-101 Av A Co', sub: 'Sikorsky UH-60L', img: '/digital/thumbnails/dcs8.jpg', href: 'https://www.digitalcombatsimulator.com/en/files/3326587/', sim: 'DCS', type: 'Livery' },
]

export default function Digital() {
  const [sim, setSim] = useState('all')
  const [type, setType] = useState(null)
  const gridRef = useRef(null)

  const reset = () => {
    setSim('all')
    setType(null)
  }
  const toggleType = (t) => setType((cur) => (cur === t ? null : t))

  const shown = assets.filter(
    (a) => (sim === 'all' || a.sim === sim) && (type === null || a.type === type),
  )
  const { renderedIds, leavingIds, leavingRects } = useRenderedIds(shown.map((a) => a.id), gridRef)
  const rendered = assets.filter((a) => renderedIds.has(a.id))

  // Only cards actually participating in grid flow (i.e. not currently
  // leaving) can possibly need a FLIP animation — see useFilterGridAnimation.js.
  const inFlowIds = rendered.filter((a) => !leavingIds.has(a.id)).map((a) => a.id).join('|')
  useGridFlip(gridRef, inFlowIds)

  return (
    <>
      <main className={styles.page}>
        <PageHeader
          title="Digital Assets"
          subtitle="Flight simulator scenery and liveries for MSFS and DCS"
          banner="/digital/banner.png"
        >
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <button className={styles.filter} data-active={sim === 'all' && type === null || undefined} onClick={reset}>∀ All</button>
              <button className={styles.filter} data-active={sim === 'MSFS' || undefined} onClick={() => setSim('MSFS')}>✈ MSFS</button>
              <button className={styles.filter} data-active={sim === 'DCS' || undefined} onClick={() => setSim('DCS')}>☖ DCS</button>
            </div>
            <span className={styles.divider} />
            <div className={styles.filterGroup}>
              <button className={styles.filter} data-active={type === 'Scenery' || undefined} onClick={() => toggleType('Scenery')}>⛰ Scenery</button>
              <button className={styles.filter} data-active={type === 'Livery' || undefined} onClick={() => toggleType('Livery')}>✎ Livery</button>
            </div>
          </div>
        </PageHeader>

        <div className={styles.grid} ref={gridRef}>
          {rendered.map((a) => (
            <a
              key={a.id}
              data-card-id={a.id}
              className={styles.card}
              data-leaving={leavingIds.has(a.id) || undefined}
              style={leavingIds.has(a.id) && leavingRects[a.id] ? {
                top: leavingRects[a.id].top,
                left: leavingRects[a.id].left,
                width: leavingRects[a.id].width,
                height: leavingRects[a.id].height,
              } : undefined}
              href={a.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.cardMedia}>
                <img className={styles.cardImg} src={a.img} alt="" />
                <div className={styles.cardBadges}>
                  <span>{a.sim}</span>
                  <span>{a.type}</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{a.title}</p>
                <p className={styles.cardSub}>{a.sub}</p>
                <span className={styles.cardArrow} aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8h9M8.5 4.5L13 8l-4.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

import { Link } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import styles from './underConstruction.module.css'

export default function UnderConstruction() {
  return (
    <>
      <main className={styles.page}>
        <p className={styles.eyebrow}>Coming Soon</p>
        <h1 className={styles.title}>Under Construction</h1>
        <p className={styles.subtitle}>This project write-up hasn't been published yet — check back soon.</p>
        <Link className={styles.back} to="/">← Back to Home</Link>
      </main>
      <Footer />
    </>
  )
}

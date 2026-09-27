import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a className={styles.item} href="https://github.com/echotops" target="_blank" rel="noreferrer">
        <img src="/global/github.svg" height="22" alt="" />
        GitHub
      </a>
      <a className={styles.item} href="https://www.linkedin.com/in/ethan-rosenfeld06/" target="_blank" rel="noreferrer">
        <img src="/global/linkedin.svg" height="22" alt="" />
        LinkedIn
      </a>
      <a className={styles.item} href="mailto:ethan.rosenfeld@duke.edu">
        <img src="/global/mail.svg" height="22" alt="" />
        Mail
      </a>
    </footer>
  )
}

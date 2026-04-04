import styles from './PageHeader.module.css'

export function PageHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="src/assets/logo.svg"/>
        <span className={styles.logoText}>CART</span>
      </div>
      <button className={styles.bell} aria-label="Notifications">
      <img src="src/assets/notification.svg"/>
      </button>
    </header>
  )
}
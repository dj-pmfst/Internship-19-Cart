import { Navbar } from './Navbar'
import styles from './Layout.module.css'

export function Layout({ children }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
      <Navbar />
    </div>
  )
}
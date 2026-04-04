import { useLocation } from 'react-router-dom'
import { Navbar } from '../Navbar/Navbar'
import styles from './Layout.module.css'

const NO_NAVBAR = ['/', '/welcome']

export function Layout({ children }) {
  const { pathname } = useLocation()
  const showNavbar = !NO_NAVBAR.includes(pathname)

  return (
    <div className={styles.container}>
      <main className={showNavbar ? styles.withNavbar : ''}>
        {children}
      </main>
      {showNavbar && <Navbar />}
    </div>
  )
}
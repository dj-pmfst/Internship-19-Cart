import { NavLink } from "react-router-dom";
import styles from './Layout.module.css'

export function Layout({children}) {
    return (
        <div className={styles.container}>
            <header>
                <nav></nav>
            </header>
            <main className={styles.main}>{children}</main>
        </div>
    )
}
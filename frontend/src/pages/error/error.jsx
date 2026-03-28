import styles from './error.module.css'
import { Link } from "react-router-dom"

export default function NotFound(){
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <img className={styles.icon} src="/src/assets/icons/404.png"/>
                <div className={styles.code}>404</div>               
                <p className={styles.message}>Not found</p>
                <Link to="/" className={styles.homeButton}>Back to Home page</Link>
            </main>
        </div>
    )
}
import styles from "./welcome.module.css"

export default function Welcome(){
    return (
        <div className="welcome">
            <img className={styles.logo-cart} src="src/assets/cart-logo.svg" />
            <img className={styles.logo} src="src/assets/Logo.svg"/>
        </div>
    )
}
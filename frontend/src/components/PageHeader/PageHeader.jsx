import styles from "./PageHeader.module.css";
import { NavLink } from "react-router-dom"

export function PageHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="src/assets/logo.svg" />
      </div>
      <NavLink to="/notifications" className={({ isActive }) => isActive ? styles.active : ''}>
        <img src="src/assets/notification.svg" />
      </NavLink>      
    </header>
  );
}

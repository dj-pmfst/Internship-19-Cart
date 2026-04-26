import styles from "./error.module.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Link to="/home" className={styles.homeButton}>
        x
      </Link>
      <div className={styles.notice}>
        <hr />
        <div className={styles.noticeContent}>
          <img src="/assets//error-warning.svg" />
          <span>DOGODILA SE GREŠKA</span>
        </div>
        <hr />
      </div>
    </div>
  );
}

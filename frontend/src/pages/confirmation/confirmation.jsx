import styles from "./confirmation.module.css";
import { Link } from "react-router-dom";

export default function Confirmation() {

  return (
    <div className={styles.container}>
      <Link to="/home" className={styles.homeButton}>
        x
      </Link>
      <div className={styles.notice}>
        <div className={styles.noticeContent}>
          <img src="/assets//smile.svg" />
          HVALA ŠTO KUPUJEŠ S NAMA
        </div>
      </div>
    </div>
  );
}

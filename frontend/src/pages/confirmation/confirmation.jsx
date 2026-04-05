import styles from "./confirmation.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function Confirmation() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Link to="/home" className={styles.homeButton}>
        x
      </Link>
      <div className={styles.notice}>
        <div className={styles.noticeContent}>
          <img src="src/assets/smile.svg" />
          HVALA ŠTO KUPUJEŠ S NAMA
        </div>
      </div>
    </div>
  );
}

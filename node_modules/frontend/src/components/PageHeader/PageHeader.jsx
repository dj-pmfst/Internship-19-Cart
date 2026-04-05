import { useState } from "react";
import styles from "./PageHeader.module.css";
import Notifications from "src/components/Notifications/Notifications";

export function PageHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="src/assets/logo.svg" />
        </div>
        <button className={styles.notifBtn} onClick={() => setNotifOpen(true)}>
          <img src="src/assets/notification.svg" />
        </button>
      </header>

      <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
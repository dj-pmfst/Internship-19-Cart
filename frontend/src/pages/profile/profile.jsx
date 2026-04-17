import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "src/components/PageHeader/PageHeader";
import Loader from "src/components/Loading/loader";
import styles from "./profile.module.css";
import { useProfile } from "src/hooks/useProfile";
import { useCart } from "src/context/CartContext";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderSuccess, setOrderSuccess] = useState(
    location.state?.orderSuccess || false
  );

  const { user, address, loading } = useProfile();
  const { resetCart } = useCart();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, []);

  useEffect(() => {
    if (orderSuccess) {
      const t = setTimeout(() => setOrderSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [orderSuccess]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    resetCart();
    navigate("/");
  };

  if (loading) return <Loader />;

  const [iban, expiry, cvv] = (user?.paymentMethod || "").split("|");

  return (
    <div className={styles.page}>
      <PageHeader />
      <hr />

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.container}>
            <div className={styles.avatar}>
              <img src="src/assets/profile.svg" />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>IME:</span>
                <span className={styles.infoValue}>
                  {user?.email?.split("@")[0] || "—"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>ADRESA:</span>
                <span className={styles.infoValue}>{address}</span>
              </div>
            </div>
          </div>

          <div className={styles.visaSection}>
            <div className={styles.visaIcon}>
              <img src="src/assets/visa.svg" />
            </div>
            <div className={styles.visaInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>IBAN:</span>
                <span className={styles.infoValue}>{iban}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>DATUM ISTEKA:</span>
                <span className={styles.infoValue}>03/27</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>ISCT KOD:</span>
                <span className={styles.infoValue}>422</span>
              </div>
              {!iban && !expiry && !cvv && (
                <p className={styles.noPayment}>
                  Nema unesenih podataka o plaćanju
                </p>
              )}
            </div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Odjava
        </button>
      </div>
    </div>
  );
}

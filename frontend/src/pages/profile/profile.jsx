import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import Loader from "../../components/Loading/Loader";
import styles from "./profile.module.css";
import { useProfile } from "../../hooks/useProfile";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(
    location.state?.orderSuccess || false
  );

  const { user, address, setAddress, paymentMethod, setPaymentMethod, loading, saving, save } = useProfile()

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/')
  }, [])

  useEffect(() => {
    if (orderSuccess) {
      const t = setTimeout(() => setOrderSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [orderSuccess]);

  const handleSave = async () => {
    await save()
    setEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <Loader />;

  const [iban, expiry, cvv] = (user?.paymentMethod || "").split("|");
  
  return (
    <div className={styles.page}>
      <PageHeader />

      {orderSuccess && (
        <div className={styles.successBanner}>Narudžba uspjesno kreirana</div>
      )}

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.avatar}>
            <img src="src/assets/profile.svg" />
          </div>

          <div className={styles.userInfo}>
            {editing ? (
              <div className={styles.editFields}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Adresa</label>
                  <input
                    className={styles.input}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Vaša adresa"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>
                    Plaćanje (IBAN | datum | CVV)
                  </label>
                  <input
                    className={styles.input}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="HR123...|28/29|506"
                  />
                </div>
                <div className={styles.editBtns}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={saving}>
                    {saving ? "..." : "Spremi"}
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setEditing(false)}>
                    Odustani
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>IME:</span>
                  <span className={styles.infoValue}>
                    {user?.email?.split("@")[0] || "—"}
                  </span>
                </div>
                {address && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ADRESA:</span>
                    <span className={styles.infoValue}>{address}</span>
                  </div>
                )}
                <button
                  className={styles.editBtn}
                  onClick={() => setEditing(true)}>
                  Uredi profil
                </button>
              </>
            )}
          </div>

          {!editing && (
            <div className={styles.visaSection}>
              <div className={styles.visaIcon}>
                <img src="src/assets/visa.svg" />
              </div>
              <div className={styles.visaInfo}>
                {iban && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>IBAN:</span>
                    <span className={styles.infoValue}>{iban}</span>
                  </div>
                )}
                {expiry && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>DATUM ISTEKA:</span>
                    <span className={styles.infoValue}>{expiry}</span>
                  </div>
                )}
                {cvv && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ISCT KOD:</span>
                    <span className={styles.infoValue}>{cvv}</span>
                  </div>
                )}
                {!iban && !expiry && !cvv && (
                  <p className={styles.noPayment}>
                    Nema unesenih podataka o plaćanju
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Odjava
        </button>
      </div>
    </div>
  );
}

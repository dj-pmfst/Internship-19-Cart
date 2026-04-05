import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import styles from "./checkout.module.css";

const API = "http://localhost:3000";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [editingShipping, setEditingShipping] = useState(false);
  const [editingBilling, setEditingBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        const u = json.data;
        setUser(u);
        const addr = u?.address || "";
        setShippingAddress(addr);
        setBillingAddress(addr);
      });
  }, [token]);

  const handleSubmit = async () => {
    if (!shippingAddress.trim()) {
      setError("Shipping address is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          shippingAddress,
          billingAddress: billingAddress || shippingAddress,
        }),
      });
      const json = await res.json();
console.log('order created:', JSON.stringify(json))  
      if (!res.ok) throw new Error(json.message || "Order failed");
      clearCart();
      navigate("/profile", { state: { orderSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Blagajna</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>ADRESA DOSTAVE</span>
          <img src="src/assets/truck.svg" />
        </div>

        <div className={styles.addressCard}>
          <div className={styles.addressCardHeader}>
            <span className={styles.addressType}>Poštanska adresa</span>
            <button
              className={styles.changeBtn}
              onClick={() => setEditingShipping((e) => !e)}>
              PROMIJENI
            </button>
          </div>

          {editingShipping ? (
            <textarea
              className={styles.addressInput}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={3}
              placeholder="Unesite adresu dostave..."
            />
          ) : (
            <div className={styles.addressText}>
              {user?.email && <p>{user.email}</p>}
              <p>{shippingAddress || "Nema unesene adrese"}</p>
            </div>
          )}
        </div>

        <div className={styles.paketo}>
          <img src="src/assets/map-pin.svg" />
          <span>POKUPI NA PAKETOMATU</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>ADRESA NAPLATE</span>
          <img src="src/assets/truck.svg" />
        </div>

        <div className={styles.addressCard}>
          <div className={styles.addressCardHeader}>
            <span className={styles.addressType}>Poštanska adresa</span>
            <button
              className={styles.changeBtn}
              onClick={() => setEditingBilling((e) => !e)}>
              PROMIJENI
            </button>
          </div>

          {editingBilling ? (
            <textarea
              className={styles.addressInput}
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              rows={3}
              placeholder="Unesite adresu naplate..."
            />
          ) : (
            <div className={styles.addressText}>
              {user?.email && <p>{user.email}</p>}
              <p>
                {billingAddress || shippingAddress || "Nema unesene adrese"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}>
          {loading ? "Slanje..." : "Potvrdi narudžbu"}
        </button>
      </div>
    </div>
  );
}

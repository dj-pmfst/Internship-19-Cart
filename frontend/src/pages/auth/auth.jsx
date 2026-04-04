import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./auth.module.css";

const API = 'http://localhost:3000'

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
    setSuccess("");
  };

  const switchTab = (t) => {
    setTab(t);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (tab === "register" && password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const endpoint = tab === "login" ? "login" : "register";
      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("status:", res.status);
      console.log("data:", data);
      if (!res.ok)
        throw new Error(
          data.message || `${tab === "login" ? "Login" : "Registration"} failed`
        );

      if (tab === "login") {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setSuccess("Account created");
        switchTab("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <span>
        <img src="/src/assets/icons/Logo.svg" />
      </span>
      <div className={styles.card}>
        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${
              tab === "login" ? styles.toggleActive : ""
            }`}
            onClick={() => switchTab("login")}>
            Log In
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${
              tab === "register" ? styles.toggleActive : ""
            }`}
            onClick={() => switchTab("register")}>
            Register
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {tab === "register" && (
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? tab === "login"
                ? "Loging in..."
                : "Creating account..."
              : tab === "login"
              ? "Log In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

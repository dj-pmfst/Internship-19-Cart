import styles from "./welcome.module.css";
import { useEffect, useRef } from "react";

export default function Welcome() {
  const cartRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const cart = cartRef.current;
    const logo = logoRef.current;

    const handleAnimationEnd = () => {
      cart.style.display = "none";
      logo.style.opacity = "1";
    };

    cart.addEventListener("animationend", handleAnimationEnd);
    return () => cart.removeEventListener("animationend", handleAnimationEnd);
  }, []);

  return (
    <div className="welcome">
      <img
        ref={cartRef}
        className={styles["logo-cart"]}
        src="src/assets/cart-logo.svg"
      />
      <img ref={logoRef} className={styles.logo} src="src/assets/Logo.svg" />
    </div>
  );
}

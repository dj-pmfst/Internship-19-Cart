import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loading/Loader";
import styles from "./favourites.module.css";

const API = "http://localhost:3000";

export default function Favourites() {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetch(`${API}/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => setFavourites(json.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleFav = async (productId) => {
    await fetch(`${API}/favorites/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavourites((prev) => prev.filter((f) => f.productId !== productId));
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <PageHeader />
      <hr/>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>Saved</h2>
        <span className={styles.count}>
          {favourites.length} {favourites.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {favourites.length === 0 ? (
        <div className={styles.empty}>
          <img src="src/assets/heart.svg" />
          <p className={styles.emptyTitle}>Nothing saved yet</p>
        </div>
      ) : (
        <div className={styles.masonry}>
          {favourites.map((f) => (
            <ProductCard
              key={f.id}
              product={f.product}
              variant="detailed"
              isFav={true}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
      )}
    </div>
  );
}

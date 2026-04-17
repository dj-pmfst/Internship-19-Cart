import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "src/components/PageHeader/PageHeader";
import ProductCard from "src/components/ProductCard/ProductCard";
import Loader from "src/components/Loading/loader";
import styles from "./favourites.module.css";
import { useFavourites } from "src/hooks/useFavourites";

const API = "http://localhost:3000";

export default function Favourites() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {favourites, toggleFav, loading} = useFavourites();

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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import Loader from "../../components/Loading/Loader";
import { useProducts } from "../../hooks/useProducts";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import styles from "./home.module.css";

const API = "http://localhost:3000";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const { products, hasMore, loading, initialLoad, loadMore } =
    useProducts(activeCategory);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((json) => setCategories(json.data || []));
  }, []);

  return (
    <div className={styles.page}>
      <PageHeader />

      <div className={styles.searchWrap}>
        <div className={styles.searchBar} onClick={() => navigate("/search")}>
          <img src="src/assets/search.svg" />
          <span className={styles.searchPlaceholder}>Search for...</span>
        </div>
      </div>

      <div className={styles.chips}>
        <button
          className={`${styles.chip} ${
            activeCategory === "All" ? styles.chipActive : ""
          }`}
          onClick={() => setActiveCategory("All")}>
          Sve
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`${styles.chip} ${
              activeCategory === c.name ? styles.chipActive : ""
            }`}
            onClick={() => setActiveCategory(c.name)}>
            {c.name}
          </button>
        ))}
      </div>

      {initialLoad ? (
        <Loader />
      ) : (
        <ProductGrid
          products={products}
          hasMore={hasMore}
          loading={loading}
          sentinelRef={sentinelRef}
          onToggleFav={() => {}}
        />
      )}
    </div>
  );
}

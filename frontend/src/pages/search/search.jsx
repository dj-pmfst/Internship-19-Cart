import { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import Loader from "../../components/Loading/Loader";
import { useSearchProducts } from "../../hooks/useSearchProducts";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import styles from "./search.module.css";

const API = "http://localhost:3000";

export default function Search() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const { products, hasMore, loading, searched, search, loadMore, reset } =
    useSearchProducts();
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((json) => setCategories(json.data || []));
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    search(query, cat);
  };

  return (
    <div className={styles.page}>
      <PageHeader />

      <div className={styles.searchWrap}>
        <div className={styles.searchBar}>
          <img src="src/assets/search.svg" />
          <input
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && search(query, activeCategory)
            }
            placeholder="Search for..."
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setQuery("");
                reset();
              }}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className={styles.chips}>
        <button
          className={`${styles.chip} ${
            activeCategory === "All" ? styles.chipActive : ""
          }`}
          onClick={() => handleCategoryClick("All")}>
          Sve
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`${styles.chip} ${
              activeCategory === c.name ? styles.chipActive : ""
            }`}
            onClick={() => handleCategoryClick(c.name)}>
            {c.name}
          </button>
        ))}
      </div>

      {loading && products.length === 0 && <Loader />}

      {!loading && searched && products.length === 0 && (
        <div className={styles.empty}>
          <p>No results found</p>
        </div>
      )}

      {products.length > 0 && (
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

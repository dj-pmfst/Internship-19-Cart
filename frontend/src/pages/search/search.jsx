import { useState, useEffect } from "react";
import { PageHeader } from "src/components/PageHeader/PageHeader";
import ProductGrid from "src/components/ProductGrid/ProductGrid";
import Loader from "src/components/Loading/loader";
import Filter from "src/components/Filter/Filter";
import { useSearchProducts } from "src/hooks/useSearchProducts";
import { useInfiniteScroll } from "src/hooks/useInfiniteScroll";
import { useFavourites } from "src/hooks/useFavourites";
import styles from "./search.module.css";

const API = "http://localhost:3000";

export default function Search() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const { favIds, toggleFav } = useFavourites();

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

  const toggleColor = (color) => {
    if (color === null) {
      setSelectedColors([]);
      return;
    }
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const filteredProducts =
    selectedColors.length > 0
      ? products.filter((p) =>
          p.colors?.some((c) => selectedColors.includes(c.toLowerCase()))
        )
      : products;

  return (
    <div className={styles.page}>
      <PageHeader />
      <hr />
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

      {!loading && searched && filteredProducts.length === 0 && (
        <div className={styles.empty}>
          <p>No results found</p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <ProductGrid
          isFavIds={favIds}
          onToggleFav={toggleFav}
          products={filteredProducts}
          hasMore={hasMore}
          loading={loading}
          sentinelRef={sentinelRef}
          variant="detailed"
        />
      )}

      <button className={styles.filterBtn} onClick={() => setFilterOpen(true)}>
        <img src="src/assets/filter.svg" />
        Filter
        {selectedColors.length > 0 && (
          <span className={styles.filterBadge}>{selectedColors.length}</span>
        )}
      </button>

      <Filter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        selectedColors={selectedColors}
        onToggleColor={toggleColor}
        onApply={() => {}}
      />
    </div>
  );
}

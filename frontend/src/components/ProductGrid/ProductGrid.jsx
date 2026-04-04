import ProductCard from "../ProductCard/ProductCard";
import Loader from "../Loading/Loader";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({
  products,
  hasMore,
  loading,
  sentinelRef,
  isFavIds = [],
  onToggleFav,
}) {
  return (
    <>
      <div className={styles.masonry}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isFav={isFavIds.includes(p.id)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>

      <div ref={sentinelRef} className={styles.sentinel} />

      {loading && <Loader />}

      {!hasMore && products.length > 0 && (
        <p className={styles.endMsg}>Prikazani su svi proizvodi</p>
      )}
    </>
  );
}

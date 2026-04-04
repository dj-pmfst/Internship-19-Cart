import ProductCard from "../ProductCard/ProductCard"
import styles from './ProductGrid.module.css'

export default function ProductGrid({ products, isFavIds, onToggleFav }) {
    return (
      <div className={styles.masonry}>
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            isFav={isFavIds?.includes(p.id)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>
    )
  }
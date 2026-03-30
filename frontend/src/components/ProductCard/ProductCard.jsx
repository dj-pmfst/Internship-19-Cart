import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { favorites, toggleFav, addToCart } = useApp()
  const isFav = favorites.includes(product.id)

  return (
    <div className={styles.card} onClick={() => addToCart(product.id)}>
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder}>{product.emoji}</div>
        <button
          className={styles.favBtn}
          onClick={e => { e.stopPropagation(); toggleFav(product.id) }}
          aria-label="Toggle favourite"
        >
          <img src="src/assets/heart.svg"/>
        </button>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>{product.price} $</p>
        {product.colors && (
          <div className={styles.swatches}>
            {product.colors.map(c => (
              <span key={c} className={styles.swatch} style={{ background: c }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

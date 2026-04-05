import { useNavigate } from 'react-router-dom'
import { productDetailPath } from '../../routes/routes'
import styles from './ProductCard.module.css'

const API = 'http://localhost:3000'

export default function ProductCard({ product, isFav, onToggleFav }) {
  const navigate = useNavigate()

  return (
    <div className={styles.card} onClick={() => navigate(productDetailPath(product.id))}>
      <div className={styles.imageWrap}>
        {product.imageUrl
          ? <img src={`${API}/${product.imageUrl[0]}`} alt={product.name} className={styles.image} />
          : <div className={styles.placeholder}> </div>
        }
      </div>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <p className={styles.category}>{product.category?.name}</p>
          <p className={styles.price}>{product.price.toFixed(2)} €</p>
        </div>
        <span className={styles.arrow}>›</span>
      </div>
    </div>
  )
}
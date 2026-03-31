import { useNavigate } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import styles from './favourites.module.css'

export default function Favourites() {
  const { products, favourites } = useApp()
  const navigate = useNavigate()
  const favProducts = products.filter(p => favorites.includes(p.id))

  return (
    <div className="page">
      <header className="top-bar">
        <span className="top-bar-title">Saved</span>
        <span className={styles.count}>
          {favProducts.length} {favProducts.length === 1 ? 'piece' : 'pieces'}
        </span>
      </header>

      <ProductGrid
        products={favProducts}
        emptyTitle="Nothing saved yet"
      >
        <button className="btn-outline" onClick={() => navigate('/')} style={{ marginTop: '1rem', width: 'auto', padding: '0 2rem' }}>
          Explore Collection
        </button>
      </ProductGrid>
    </div>
  )
}

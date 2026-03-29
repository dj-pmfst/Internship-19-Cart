import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import styles from './Home.module.css'

export default function Home() {
  const { products } = useApp()
  const navigate = useNavigate()

  return (
    <div className="page">
      <header className="top-bar">
        <span className="top-bar-title">Cart</span>
      </header>

      <input
        type="text"
        placeholder="Search..."
        className={styles.searchBar}
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigate(`/search?q=${e.target.value}`)
        }}
      />

      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
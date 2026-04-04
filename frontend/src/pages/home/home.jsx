import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import ProductCard from '../../components/ProductCard/ProductCard'
import Loader from '../../components/Loading/Loader'
import styles from './home.module.css'

const API = 'http://localhost:3000'

export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(json => setCategories(json.data || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 10 })
    if (activeCategory !== 'All') params.set('category', activeCategory)
    fetch(`${API}/products?${params}`)
      .then(r => r.json())
      .then(json => {
        setProducts(json.data?.products || [])
        setTotalPages(json.data?.totalPages || 1)
      })
      .finally(() => setLoading(false))
  }, [activeCategory, page])

  return (
    <div className={styles.page}>
      <PageHeader />
      <div className={styles.searchWrap}>
        <div className={styles.searchBar} onClick={() => navigate('/search')}>
          <img src="src/assets/search.svg"/>
          <span className={styles.searchPlaceholder}>Search for...</span>
        </div>
      </div>

      <div className={styles.chips}>
        <button
          className={`${styles.chip} ${activeCategory === 'All' ? styles.chipActive : ''}`}
          onClick={() => { setActiveCategory('All'); setPage(1) }}
        >Sve</button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`${styles.chip} ${activeCategory === c.name ? styles.chipActive : ''}`}
            onClick={() => { setActiveCategory(c.name); setPage(1) }}
          >{c.name}</button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <>
          <div className={styles.masonry}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} isFav={false} onToggleFav={() => {}} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={styles.pageBtn}>←</button>
              <span className={styles.pageInfo}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={styles.pageBtn}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
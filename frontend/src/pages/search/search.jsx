import { useState } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'  //note to self- probaj opet popravit ove importe svugdi
import styles from './search.module.css'

const filters = ['All', 'Casual', 'Streetwear', 'Formal', 'Sport']

export default function Search() {
  const { products } = useApp()
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState('All')

  const results = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase())
    const matchF = chip === 'All' ? true : p.tag === chip
    return matchQ && matchF
  })

  return (
    <div className="page">
      <header className="top-bar">
        <span className="top-bar-title">Search</span>
      </header>

      <div className={styles.searchWrapper}>
        <div className={styles.searchBar}>
            <img src="src/assets/search.svg"/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            className={styles.searchInput}
          />
          {query && (
            <button onClick={() => setQuery('')} className={styles.clearBtn}>×</button>
          )}
        </div>
      </div>

      <div className={`filter-tabs ${styles.filterTabs}`}>
        {filters.map(f => (
          <button key={f} className={`filter-tab${chip === f ? ' active' : ''}`} onClick={() => setChip(f)}>
            {f}
          </button>
        ))}
      </div>

      {(query || chip !== 'All') && (
        <>
          <div className={`px ${styles.resultCount}`}>
            <p>{results.length} {results.length === 1 ? 'result' : 'results'}</p>
          </div>
          {results.length > 0
            ? <div className="product-grid">{results.map(p => <ProductCard key={p.id} product={p} />)}</div>
            : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <p className={styles.emptyText}>No results found</p>
              </div>
            )
          }
        </>
      )}
    </div>
  )
}
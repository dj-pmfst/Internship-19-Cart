import { useState, useEffect, useRef } from 'react'
import Navbar from '../../component/Navbar'

const API = 'http://localhost:3000'
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
})


export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')

  useEffect(() => { fetchProducts(); fetchCategories() }, [])

  const fetchProducts = () => {
    fetch(`${API}/products?limit=100`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setProducts(d.data?.products || []))
  }

  const fetchCategories = () => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
  }


  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) &&
      (!catFilter || p.category?.name === catFilter)
  })

  return (
    <div className="page">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">Products</h1>
      </div>

      <div className="form-card">
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}


        {filtered.length === 0 && <div className="empty">No products found</div>}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import Navbar from '../../component/navbar'

const API = 'http://localhost:3000'
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
})

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

const statusBadge: Record<string, string> = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  SHIPPED: 'badge-shipped',
  DELIVERED: 'badge-delivered',
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = () => {
    setLoading(true)
    fetch(`${API}/orders`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setOrders(d.data || []))
      .finally(() => setLoading(false))
  }

  const handleStatusChange = async (orderId: number, status: string) => {
    setError(''); setSuccess('')
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      setSuccess(`Order #${orderId} status updated to ${status}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders

  return (
    <div className="page">
      <Navbar />

      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <span style={{ color: '#888' }}>{filtered.length} orders</span>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="filters" style={{ marginBottom: 16 }}>
        <div className="chip-group">
          <button className={`chip ${!statusFilter ? 'chip-active' : ''}`} onClick={() => setStatusFilter('')}>All</button>
          {STATUSES.map(s => (
            <button key={s} className={`chip ${statusFilter === s ? 'chip-active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <tbody>
              {filtered.map(order => (
                <>
                  <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <td style={{ fontWeight: 600 }}>#{order.id}</td>
                    <td>{order.user?.email}</td>
                    <td style={{ color: '#888' }}>{order.items?.length} item(s)</td>
                    <td style={{ fontWeight: 600 }}>${order.total?.toFixed(2)}</td>
                    <td><span className={`badge ${statusBadge[order.status]}`}>{order.status}</span></td>
                    <td style={{ color: '#888' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <select
                        className="select"
                        style={{ width: 130 }}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={7} style={{ background: '#fafafa', padding: '16px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                          <div>
                            <p style={{ fontWeight: 600, marginBottom: 8 }}>Items</p>
                            {order.items?.map((item: any) => (
                              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>{item.product?.name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                                <span style={{ color: '#888' }}>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 600 }}>
                              <span>Total</span>
                              <span>${order.total?.toFixed(2)}</span>
                            </div>
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, marginBottom: 8 }}>Shipping</p>
                            <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>{order.shippingAddress}</p>
                            {order.billingAddress !== order.shippingAddress && (
                              <>
                                <p style={{ fontWeight: 600, marginBottom: 4, marginTop: 12 }}>Billing</p>
                                <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>{order.billingAddress}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty">No orders found</div>}
        </div>
      )}
    </div>
  )
}
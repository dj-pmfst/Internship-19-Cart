import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('adminToken'); navigate('/login') }

  return (
    <div className="navbar">
      <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
      <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
      <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
      <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={logout}>Logout</button>
    </div>
  )
}
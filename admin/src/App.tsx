import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/login'
import Products from './pages/products/Products'
import Categories from './pages/categories/Categories'
import Orders from './pages/orders/Orders'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('adminToken') ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
        <Route path="/categories" element={<RequireAuth><Categories /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
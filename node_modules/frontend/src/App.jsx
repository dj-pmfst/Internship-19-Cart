import { Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { Layout } from './components/Layout/Layout'
import Welcome from './pages/welcome/welcome'
import Auth from './pages/auth/auth'
import Home from './pages/home/home'
import Search from './pages/search/search'
import ProductDetail from './pages/details/details'
import Favourites from './pages/favourites/favourites'
import Cart from './pages/cart/cart'
import Checkout from './pages/checkout/checkout'
import Profile from './pages/profile/profile'
import Confirmation from './pages/confirmation/confirmation'
import NotFound from './pages/error/error'
import Notifications from './components/notifications/notifications'
import { ROUTES } from './routes/routes'

function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path={ROUTES.ROOT} element={<Auth />} />
          <Route path={ROUTES.WELCOME} element={<Welcome />} />
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
          <Route path={ROUTES.FAVOURITES} element={<Favourites />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.CONFIRIMATION} element={<Confirmation/>}/>
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications/>}/>
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Layout>
    </CartProvider>
  )
}

export default App
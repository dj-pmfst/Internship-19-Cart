export const ROUTES = {
    ROOT: '/',
    WELCOME: '/welcome',
    HOME: '/home',
    SEARCH: '/search',
    PRODUCT_DETAIL: '/products/:id',
    FAVOURITES: '/favourites',
    CART: '/cart',
    CHECKOUT: '/checkout',
    PROFILE: '/profile',
    CONFIRIMATION: '/confirmation',
    NOTIFICATIONS: '/notifications',
    NOT_FOUND: '*',
}
  
export const productDetailPath = (id) => `/products/${id}`
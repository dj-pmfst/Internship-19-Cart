export const ROUTES = {
    HOME: '/home',
    AUTH: '/',
    WELCOME: '/welcome',
    MOVIES: '/movies',
    MOVIE_DETAIL: '/movies/:id',
    FAVOURITES: '/favourites',
    MANAGER: '/manager',
}

export const movieDetailPath = (id) => `/movies/${id}`
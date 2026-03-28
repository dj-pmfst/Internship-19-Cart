import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import Home from "./pages/home/home";
import Welcome from "./pages/welcome/welcome"
import MovieDetail from "./pages/details/details";
import Favourites from "./pages/favourites/favourites";
import NotFound from "./pages/error/error";
import Auth from "./pages/auth/auth";
import { ROUTES } from "./routes/routes";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Auth />} />
        <Route path={ROUTES.WELCOME} element={<Welcome/>} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetail />} />
        <Route path={ROUTES.FAVOURITES} element={<Favourites />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
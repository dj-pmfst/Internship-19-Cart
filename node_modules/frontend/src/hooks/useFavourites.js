import { useState, useEffect } from "react";

const API = "http://localhost:3000";

export function useFavourites() {
  const [favIds, setFavIds] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        const data = json.data || [];
        setFavourites(data);
        setFavIds(data.map((f) => f.productId));
      });
  }, []);

  const toggleFav = async (productId) => {
    if (!token) return;
    const isFav = favIds.includes(productId);
    if (isFav) {
      await fetch(`${API}/favorites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavIds((prev) => prev.filter((id) => id !== productId));
      setFavourites((prev) => prev.filter((f) => f.productId !== productId));
    } else {
      await fetch(`${API}/favorites/${productId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavIds((prev) => [...prev, productId]);
    }
  };

  return { favIds, favourites, toggleFav };
}

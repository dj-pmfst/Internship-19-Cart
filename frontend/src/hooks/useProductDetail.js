import { useState, useEffect } from "react";

const API = "http://localhost:3000";

export function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      fetch(`${API}/products/${id}`).then((r) => r.json()),
      fetch(`${API}/categories`).then((r) => r.json()),
      token
        ? fetch(`${API}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json())
        : Promise.resolve({ data: [] }),
    ])
      .then(([productJson, catsJson, favsJson]) => {
        const p = productJson.data;
        setProduct(p);
        setCategories(catsJson.data || []);
        setIsFav(
          (favsJson.data || []).some((f) => f.productId === parseInt(id))
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { product, categories, isFav, setIsFav, loading };
}

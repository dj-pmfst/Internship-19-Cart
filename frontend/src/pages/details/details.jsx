import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "src/context/CartContext";
import Loader from "src/components/Loading/loader";
import styles from "./details.module.css";
import { useProductDetail } from "src/hooks/useProductDetail";
import { useFavourites } from "src/hooks/useFavourites";

const API = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { favIds, toggleFav } = useFavourites();
  const isFav = favIds.includes(Number(id));

  const { product, categories, loading } = useProductDetail(id);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedColor(product.colors?.[0] || null);
    }
  }, [product]);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return <Loader />;
  if (!product)
    return <div className={styles.notFound}>Proizvod nije pronaden.</div>;

  const currentImage =
    product.imageUrl?.[product.colors?.indexOf(selectedColor)] ??
    product.imageUrl?.[0];

  return (
    <div className={styles.page}>
      <div className={styles.chipsRow}>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`${styles.chip} ${
              product.category?.name === c.name ? styles.chipActive : ""
            }`}
            onClick={() => navigate(`/home`)}>
            {c.name}
          </button>
        ))}
      </div>
      <hr />
      <div className={styles.imageWrap}>
        {currentImage ? (
          <img
            src={`${API}/${currentImage}`}
            alt={product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}></div>
        )}
      </div>

      <div className={styles.info}>
        <h1 className={styles.name}>{product.name.toUpperCase()}</h1>
        <p className={styles.price}>{product.price.toFixed(2)} €</p>

        {product.colors?.length > 0 && (
          <div className={styles.colors}>
            {product.colors.map((c) => (
              <button
                key={c}
                className={`${styles.colorBtn} ${
                  selectedColor === c ? styles.colorActive : ""
                }`}
                style={{ background: c }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
        )}

        {product.sizes?.length > 0 && (
          <>
            <p className={styles.sizeLabel}>Izaberi veličinu:</p>
            <div className={styles.sizeGrid}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`${styles.sizeBtn} ${
                    selectedSize === s ? styles.sizeBtnActive : ""
                  }`}
                  onClick={() => setSelectedSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.addBtn} ${added ? styles.addedBtn : ""}`}
            onClick={handleAdd}>
            {added ? "DODANO" : "DODAJ U KOŠARICU"}
          </button>
          <button
            className={`${styles.heartBtn} ${isFav ? styles.heartActive : ""}`}
            onClick={() => toggleFav(Number(id))}
            aria-label="Toggle favourite">
            <img src="/src/assets/heart.svg" />
          </button>
        </div>

        <div className={styles.filterRow}>
          <button className={styles.filterBtn} onClick={() => navigate(-1)}>
            <img src="/src/assets/filter.svg" />
          </button>
        </div>
      </div>

      <button className={styles.closeBtn} onClick={() => navigate(-1)}>
        x
      </button>
    </div>
  );
}

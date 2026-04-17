import { useNavigate } from "react-router-dom";
import { productDetailPath } from "src/routes/routes";
import styles from "./ProductCard.module.css";

const API = import.meta.env.VITE_API_URL;

export default function ProductCard({
  product,
  isFav,
  onToggleFav,
  variant = "default",
}) {
  const navigate = useNavigate();
  const imgSrc = Array.isArray(product.imageUrl)
    ? product.imageUrl[0]
    : product.imageUrl;

  if (variant === "detailed") {
    return (
      <div
        className={styles.detailedCard}
        onClick={() => navigate(productDetailPath(product.id))}>
        <div className={styles.detailedImageWrap}>
          <img
            src={`${API}/${imgSrc}`}
            alt={product.name}
            className={styles.detailedImage}
          />
          <button
            className={`${styles.heartBtn} ${isFav ? styles.heartActive : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(product.id);
            }}
            aria-label="Toggle favourite">
            <img src="src/assets/heart.svg" />
          </button>
        </div>
        <div className={styles.detailedInfo}>
          <p className={styles.detailedName}>{product.name.toUpperCase()}</p>
          {product.description && (
            <p className={styles.detailedDesc}>{product.description}</p>
          )}
          <p className={styles.detailedPrice}>{product.price.toFixed(2)} €</p>
          {product.colors?.length > 0 && (
            <div className={styles.swatches}>
              {product.colors.map((c) => (
                <span
                  key={c}
                  className={styles.swatch}
                  style={{ background: c }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.card}
      onClick={() => navigate(productDetailPath(product.id))}>
      <div className={styles.imageWrap}>
        <img
          src={`${API}/${imgSrc}`}
          alt={product.name}
          className={styles.image}
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <p className={styles.category}>{product.category?.name}</p>
          <p className={styles.price}>{product.price.toFixed(2)} €</p>
        </div>
        <span className={styles.arrow}>›</span>
      </div>
    </div>
  );
}

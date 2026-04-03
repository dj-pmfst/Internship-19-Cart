import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import styles from './cart.module.css'

const API = 'http://localhost:3000' //prebacit u apicopmponent file kasnije

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQuantity, total } = useCart()

  return (
    <div className={styles.page}>
      <PageHeader />
      <h1 className={styles.title}>Košarica</h1>

      <div className={styles.notice}>
        <img src="src/assets/error-warning.svg"/>
        <span>PROIZVODI NISU REZERVIRANI</span>
      </div>

      <div className={styles.delivery}>
        <div className={styles.deliveryLeft}>
          <p className={styles.deliveryTitle}>Dostava</p>
          <p className={styles.deliverySubtitle}>Šalje CART</p>
        </div>
        <span className={styles.deliveryDate}>14.3 - 20.3</span>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Vasa kosarica je prazna</p>
          <button className={styles.shopBtn} onClick={() => navigate('/home')}>Povratak</button>
        </div>
      ) : (
        <div className={styles.itemList}>
          {items.map(item => (
            <div key={`${item.id}-${item.size}-${item.color}`} className={styles.item}>
              <div className={styles.itemImg}>
                {item.imageUrl
                  ? <img src={`${API}/${item.imageUrl}`} alt={item.name} />
                  : <div className={styles.imgPlaceholder}></div>
                }
              </div>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemMeta}>
                  {item.size && <span>{item.size}</span>}
                  {item.color && <span className={styles.dot} style={{ background: item.color }} />}
                </p>
                <p className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</p>
              </div>
              <div className={styles.itemRight}>
                <div className={styles.qty}>
                  <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>+</button>
                </div>
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id, item.size, item.color)}>Ukloni</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Ti plaćaš</span>
          <span className={styles.totalVat}>s PDV-om</span>
          <span className={styles.totalAmount}>{total.toFixed(2)} €</span>
        </div>
        <button
          className={styles.checkoutBtn}
          onClick={() => navigate('/checkout')}
          disabled={items.length === 0}
        >
          Nastavi na blagajnu
        </button>
      </div>
    </div>
  )
}
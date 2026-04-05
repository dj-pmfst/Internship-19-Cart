import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

function getCartKey(userId) {
  return userId ? `cart_${userId}` : null;
}

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);

  const initCart = (uid) => {
    setUserId(uid);
    try {
      const stored = localStorage.getItem(getCartKey(uid));
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  };

  const resetCart = () => {
    setItems([]);
    setUserId(null);
  };

  useEffect(() => {
    const key = getCartKey(userId);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, userId]);

  const addToCart = (product, size, color) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, size, color, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size, color) =>
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size && i.color === color))
    );

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity < 1) return removeFromCart(id, size, color);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        count,
        initCart,
        resetCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

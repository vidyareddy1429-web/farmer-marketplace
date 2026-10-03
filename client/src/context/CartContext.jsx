import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('farmer_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('farmer_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);
      if (existing) {
        // Ensure not exceeding stock
        const newQty = Math.min(existing.qty + qty, product.quantity);
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            farmer: product.farmer?._id || product.farmer,
            name: product.name,
            price: product.price,
            quantity: product.quantity, // available stock
            unit: product.unit,
            image: product.image,
            location: product.location,
            qty: Math.min(qty, product.quantity),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const validQty = Math.min(qty, item.quantity);
          return { ...item, qty: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

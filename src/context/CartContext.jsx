"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    setIsLoading(true);
    try {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.productId === product.productId,
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + product.quantity }
              : item,
          );
        } else {
          return [...prevCart, { ...product }];
        }
      });

     toast.custom(
       (t) => (
         <div
           style={{
             display: "flex",
             flexDirection: "column",
             background: "#1c1c1e",
             borderRadius: "14px",
             overflow: "hidden",
             minWidth: "300px",
             maxWidth: "360px",
             boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
             opacity: t.visible ? 1 : 0,
             transition: "opacity 0.2s ease",
           }}
         >
           {/* Top bar — same bg, just a checkmark + title */}
           <div
             style={{
               display: "flex",
               alignItems: "center",
               gap: "8px",
               padding: "10px 14px 10px 12px",
               borderBottom: "1px solid #2a2a2e",
             }}
           >
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
               <path
                 d="M3 8L6.5 11.5L13 5"
                 stroke="#4ade80"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
             </svg>
             <span
               style={{
                 color: "#fff",
                 fontSize: "14px",
                 fontWeight: "600",
                 flex: 1,
               }}
             >
               Added To Cart
             </span>
           </div>

           {/* Bottom — message + × bottom right */}
           <div
             style={{
               padding: "10px 12px 10px 14px",
               display: "flex",
               alignItems: "flex-end",
               gap: "8px",
             }}
           >
             <span
               style={{
                 color: "#a1a1aa",
                 fontSize: "13px",
                 lineHeight: "1.5",
                 flex: 1,
               }}
             >
               {product.quantity} × {product.productName} — open the cart when
               you're ready to checkout.
             </span>
             <button
               onClick={() => toast.dismiss(t.id)}
               style={{
                 background: "none",
                 border: "none",
                 color: "#71717a",
                 fontSize: "16px",
                 cursor: "pointer",
                 flexShrink: 0,
                 padding: "0",
                 lineHeight: 1,
                 alignSelf: "flex-end",
               }}
             >
               ×
             </button>
           </div>
         </div>
       ),
       { duration: 3000, position: "top-right" },
     );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId),
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

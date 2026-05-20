import { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../utils/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/cart/me");
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await apiClient.post("/cart", { productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add to cart",
      };
    }
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    try {
      await apiClient.put("/cart/update", { cartItemId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update quantity",
      };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await apiClient.delete(`/cart/item/${cartItemId}`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to remove item",
      };
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete("/cart/clear");
      setCart(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to clear cart",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addToCart, updateCartQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/productService';
import { useAuth } from './AuthContext';

/**
 * CartContext — Contexto del Carrito
 * 
 * Maneja el estado global del carrito:
 * - items: lista de productos en el carrito
 * - total: precio total
 * - itemCount: número total de unidades
 * 
 * Se sincroniza con el backend cuando el usuario está autenticado.
 * Si no está autenticado, el carrito está vacío.
 */
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems]         = useState([]);
  const [total, setTotal]         = useState('0.00');
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading]     = useState(false);
  const { user } = useAuth();

  // Cargar el carrito desde el backend cuando el usuario se autentica
  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setTotal('0.00');
      setItemCount(0);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.itemCount);
    } catch (err) {
      console.error('Error cargando carrito:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await cartService.addToCart(productId, quantity);
    await fetchCart(); // Recargar carrito actualizado
  };

  const updateItem = async (itemId, quantity) => {
    await cartService.updateItem(itemId, quantity);
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await cartService.removeItem(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      items, total, itemCount, loading,
      addToCart, updateItem, removeItem, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};

export default CartContext;

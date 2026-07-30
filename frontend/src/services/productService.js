import api from './authService';

/**
 * Servicio de Productos
 * Reutiliza la instancia de axios de authService (ya tiene el interceptor JWT)
 */
export const productService = {
  // Obtener lista de productos con filtros opcionales
  getProducts: async ({ category, search, page = 1, limit = 12 } = {}) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search)   params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Obtener detalle de un producto
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Obtener categorías
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

export const cartService = {
  // Ver carrito
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Agregar producto al carrito
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart', { product_id: productId, quantity });
    return response.data;
  },

  // Actualizar cantidad de un item
  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Eliminar item del carrito
  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // Vaciar carrito
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

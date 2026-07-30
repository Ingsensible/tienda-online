import api from './authService';

export const orderService = {
  createOrder: async (shippingData) => {
    const response = await api.post('/orders', shippingData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  // Admin
  getAllOrders: async (status = '') => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/orders${params}`);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

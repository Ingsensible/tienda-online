import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

const CheckoutPage = () => {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await orderService.createOrder(form);
      navigate(`/orders/${data.order.id}?success=1`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de envío */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Datos de envío</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="shipping_name"
                value={form.shipping_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="shipping_address"
                value={form.shipping_address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Calle, número, colonia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="shipping_city"
                value={form.shipping_city}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ciudad de México"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Procesando pedido...' : `Confirmar pedido • $${parseFloat(total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Resumen ({itemCount} artículos)
          </h2>
          <div className="bg-white rounded-lg border border-gray-100 divide-y">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded bg-gray-100 flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=?'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  ${parseFloat(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
            <div className="p-3 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>${parseFloat(total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

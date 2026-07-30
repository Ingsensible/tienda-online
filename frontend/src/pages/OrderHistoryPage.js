import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

const STATUS_LABELS = {
  pending:    { label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'En proceso',  color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Enviado',     color: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Entregado',   color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelado',   color: 'bg-red-100 text-red-700' },
};

/**
 * OrderDetailPage — Detalle de una orden específica
 */
export const OrderDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === '1';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(id)
      .then(data => setOrder(data.order))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Cargando...</div>;
  if (!order)  return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-500">Orden no encontrada.</div>;

  const status = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-green-700 font-semibold text-lg">🎉 ¡Pedido confirmado!</p>
          <p className="text-green-600 text-sm mt-1">Tu pedido #{order.id} ha sido recibido.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.id}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h2 className="font-semibold text-gray-700 mb-2">Datos de envío</h2>
        <p className="text-gray-600 text-sm">{order.shipping_name}</p>
        <p className="text-gray-600 text-sm">{order.shipping_address}</p>
        <p className="text-gray-600 text-sm">{order.shipping_city}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 divide-y mb-4">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <img
              src={item.image_url}
              alt={item.product_name}
              className="w-12 h-12 object-cover rounded bg-gray-100 flex-shrink-0"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=?'; }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
              <p className="text-xs text-gray-500">x{item.quantity} × ${parseFloat(item.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            </div>
            <p className="text-sm font-semibold">${parseFloat(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
        ))}
        <div className="p-3 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span>${parseFloat(order.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <Link to="/orders" className="text-blue-600 hover:underline text-sm">← Ver todos mis pedidos</Link>
    </div>
  );
};

/**
 * OrderHistoryPage — Lista de todos los pedidos del usuario
 */
const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(data => setOrders(data.orders))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Cargando pedidos...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No tienes pedidos aún.</p>
          <Link to="/catalog" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const status = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Pedido #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${parseFloat(order.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;

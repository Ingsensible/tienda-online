import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, total, itemCount, loading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
        Cargando carrito...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Agrega productos desde el catálogo</p>
        <Link
          to="/catalog"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Mi Carrito <span className="text-gray-400 text-lg font-normal">({itemCount} artículos)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-4 flex gap-4 items-center">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md bg-gray-100 flex-shrink-0"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=?'; }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
              <p className="text-blue-600 font-medium">
                ${parseFloat(item.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Control de cantidad */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[80px]">
              <p className="font-bold text-gray-800">
                ${parseFloat(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors mt-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen del pedido */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen del pedido</h2>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal ({itemCount} artículos)</span>
          <span>${parseFloat(total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <span>Envío</span>
          <span className="text-green-600">Gratis</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
          <span>Total</span>
          <span>${parseFloat(total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Proceder al pago
        </button>
        <Link
          to="/catalog"
          className="mt-2 block text-center text-sm text-blue-600 hover:underline"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
};

export default CartPage;

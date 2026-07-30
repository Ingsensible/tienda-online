import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/imageUrl';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]   = useState(false);
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.getProductById(id)
      .then(data => setProduct(data.product))
      .catch(() => setError('Producto no encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al agregar al carrito.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
        Cargando producto...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error || 'Producto no encontrado.'}</p>
        <Link to="/catalog" className="text-blue-600 hover:underline">← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600">Inicio</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-blue-600">Catálogo</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <img
            src={resolveImageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-80 md:h-96 object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Sin+imagen'; }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-widest">
              {product.category_name}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-3">{product.name}</h1>
            <p className="text-gray-500 text-base leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${parseFloat(product.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                product.stock > 10
                  ? 'bg-green-100 text-green-700'
                  : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
              </span>
            </div>

            {/* Selector de cantidad */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                  >−</button>
                  <span className="px-4 py-2 text-gray-800 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                  >+</button>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            {user ? (
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-colors ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                }`}
              >
                {added ? '✓ Agregado al carrito' : adding ? 'Agregando...' : '🛒 Agregar al carrito'}
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full py-3 px-6 rounded-lg font-semibold text-base text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Inicia sesión para comprar
              </Link>
            )}
            <Link
              to="/catalog"
              className="w-full py-3 px-6 rounded-lg font-medium text-base text-center border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

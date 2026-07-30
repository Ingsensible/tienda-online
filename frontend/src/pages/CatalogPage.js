import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * ProductCard — Tarjeta de producto
 * Componente reutilizable que muestra la info de un producto
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded]   = useState(false);

  const handleAddToCart = async () => {
    if (!user) return; // El botón no debería aparecer si no está logueado
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // Reset después de 2s
    } catch (err) {
      console.error('Error agregando al carrito:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover bg-gray-100"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen'; }}
      />
      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          {product.category_name}
        </span>
        <h3 className="text-gray-800 font-semibold mt-1 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${parseFloat(product.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
          </span>
        </div>
        {user ? (
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${added
                ? 'bg-green-500 text-white'
                : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
              }`}
          >
            {added ? '✓ Agregado' : adding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        ) : (
          <Link
            to="/login"
            className="mt-3 block w-full py-2 px-4 rounded-md text-sm font-medium text-center border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Inicia sesión para comprar
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * CatalogPage — Página principal del catálogo
 */
const CatalogPage = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage]             = useState(1);

  // Cargar categorías una sola vez
  useEffect(() => {
    productService.getCategories()
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    productService.getProducts({ category: selectedCategory, search, page })
      .then(data => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch(err => console.error('Error cargando productos:', err))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Catálogo de Productos</h1>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar productos..."
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
        {(search || selectedCategory) && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); setSelectedCategory(''); setPage(1); }}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        )}
      </form>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === String(cat.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No se encontraron productos.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{pagination.total} productos encontrados</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-md text-sm font-medium transition-colors
                    ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogPage;

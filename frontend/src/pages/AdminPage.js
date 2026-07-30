import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import api from '../services/authService';
import { resolveImageUrl } from '../utils/imageUrl';

/**
 * AdminPage — Panel de administración
 * Tabs: Productos | Órdenes
 * Solo accesible para usuarios con rol 'admin'
 */
const AdminPage = () => {
  const [tab, setTab] = useState('products');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📦 Productos
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🛒 Órdenes
        </button>
      </div>

      {tab === 'products' && <AdminProducts />}
      {tab === 'orders'   && <AdminOrders />}
    </div>
  );
};

/**
 * AdminProducts — CRUD de productos
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories]   = useState([]);

  const loadProducts = () => {
    setLoading(true);
    productService.getProducts({ limit: 50 })
      .then(data => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    productService.getCategories().then(data => setCategories(data.categories));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{products.length} productos</p>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onSave={() => { setShowForm(false); loadProducts(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-400">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2 text-gray-600 font-medium">Producto</th>
                <th className="px-3 py-2 text-gray-600 font-medium">Categoría</th>
                <th className="px-3 py-2 text-gray-600 font-medium">Precio</th>
                <th className="px-3 py-2 text-gray-600 font-medium">Stock</th>
                <th className="px-3 py-2 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
                  <td className="px-3 py-2 text-gray-500">{p.category_name}</td>
                  <td className="px-3 py-2">${parseFloat(p.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2">
                    <span className={p.stock > 5 ? 'text-green-600' : 'text-red-500'}>{p.stock}</span>
                  </td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => { setEditProduct(p); setShowForm(true); }}
                      className="text-blue-600 hover:underline text-xs"
                    >Editar</button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:underline text-xs"
                    >Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/**
 * ProductForm — Formulario para crear/editar producto
 * Soporta subir imagen desde el dispositivo o ingresar URL manualmente
 */
const ProductForm = ({ product, categories, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || 0,
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
  });
  const [saving, setSaving]         = useState(false);
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let savedProduct;
      if (product) {
        const res = await api.put(`/products/${product.id}`, { ...form, is_active: true });
        savedProduct = res.data.product;
      } else {
        const res = await api.post('/products', form);
        savedProduct = res.data.product;
      }

      // Si hay archivo seleccionado, subirlo después de guardar el producto
      if (imageFile && savedProduct?.id) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await api.post(`/products/${savedProduct.id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSave();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  // URL de imagen a mostrar en preview (local o remota)
  const previewSrc = imagePreview || form.image_url;
  const isLocalImage = previewSrc && previewSrc.startsWith('/uploads/');
  const fullPreviewSrc = isLocalImage
    ? `http://localhost:4000${previewSrc}`
    : previewSrc;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-gray-700 mb-3">{product ? 'Editar producto' : 'Nuevo producto'}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-2 py-1 text-sm col-span-2" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <textarea className="border rounded px-2 py-1 text-sm col-span-2" placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
        <input className="border rounded px-2 py-1 text-sm" placeholder="Precio" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <input className="border rounded px-2 py-1 text-sm" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />

        {/* Sección de imagen */}
        <div className="col-span-2">
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setUploadMode('url')}
              className={`text-xs px-3 py-1 rounded border ${uploadMode === 'url' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
              🔗 URL
            </button>
            <button type="button" onClick={() => setUploadMode('file')}
              className={`text-xs px-3 py-1 rounded border ${uploadMode === 'file' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
              📁 Subir archivo
            </button>
          </div>

          {uploadMode === 'url' ? (
            <input
              className="border rounded px-2 py-1 text-sm w-full"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={form.image_url}
              onChange={e => { setForm({...form, image_url: e.target.value}); setImagePreview(e.target.value); }}
            />
          ) : (
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                📷 Elegir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              {imageFile && <span className="text-xs text-green-600">✅ {imageFile.name}</span>}
            </div>
          )}

          {/* Preview de imagen */}
          {fullPreviewSrc && (
            <div className="mt-2">
              <img
                src={fullPreviewSrc}
                alt="Preview"
                className="h-24 w-24 object-cover rounded border"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        <select className="border rounded px-2 py-1 text-sm" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
          <option value="">Sin categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2 justify-end items-center">
          <button type="button" onClick={onCancel} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
          <button type="submit" disabled={saving} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * AdminOrders — Lista de todas las órdenes con cambio de estado
 */
const AdminOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    orderService.getAllOrders()
      .then(data => setOrders(data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    await orderService.updateOrderStatus(id, status);
    loadOrders();
  };

  const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (loading) return <div className="text-center py-8 text-gray-400">Cargando órdenes...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-3 py-2 text-gray-600 font-medium">#</th>
            <th className="px-3 py-2 text-gray-600 font-medium">Cliente</th>
            <th className="px-3 py-2 text-gray-600 font-medium">Total</th>
            <th className="px-3 py-2 text-gray-600 font-medium">Fecha</th>
            <th className="px-3 py-2 text-gray-600 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-medium">#{o.id}</td>
              <td className="px-3 py-2">
                <p className="font-medium text-gray-800">{o.user_name}</p>
                <p className="text-gray-400 text-xs">{o.user_email}</p>
              </td>
              <td className="px-3 py-2">${parseFloat(o.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="px-3 py-2 text-gray-500">
                {new Date(o.created_at).toLocaleDateString('es-MX')}
              </td>
              <td className="px-3 py-2">
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  className="border rounded px-2 py-1 text-xs"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-center py-8 text-gray-400">No hay órdenes.</p>}
    </div>
  );
};

export default AdminPage;

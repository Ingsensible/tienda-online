import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage, { OrderDetailPage } from './pages/OrderHistoryPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';

/**
 * Header — Barra de navegación con logo xype
 */
const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header style={{ background: 'linear-gradient(135deg, #1a1a28 0%, #22232c 60%, #1e3c64 100%)' }}
            className="sticky top-0 z-50 shadow-dark">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo xype */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/xype2.png"
            alt="Xype"
            className="h-18 w-auto object-contain group-hover:opacity-90 transition-opacity"
            style={{ height: '72px' }}
          />
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/catalog"
            className="text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors duration-200">
            Catálogo
          </Link>

          {user && (
            <Link to="/cart"
              className="relative text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors duration-200">
              🛒 Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-gold text-brand-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <Link to="/orders"
                className="text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors duration-200 hidden sm:inline">
                Mis pedidos
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin"
                  className="text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors duration-200 hidden sm:inline">
                  Admin
                </Link>
              )}
              <span className="text-gray-400 text-sm hidden sm:inline">
                Hola, <span className="text-brand-gold font-medium">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm border border-gray-600 text-gray-300 hover:border-brand-gold hover:text-brand-gold px-3 py-1 rounded-lg transition-all duration-200"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm text-gray-300 hover:text-brand-gold transition-colors duration-200">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #b4965a, #c9aa6e)', color: '#1a1a28' }}
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

/**
 * HomePage — Página de inicio con estilo xype
 */
const HomePage = () => {
  const { user } = useAuth();

  return (
    <main className="min-h-screen" style={{ background: '#f8f7f5' }}>
      {/* Hero section */}
      <section
        className="py-8 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1a28 0%, #22232c 50%, #1e3c64 100%)' }}
      >
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #b4965a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e3c78 0%, transparent 50%)' }}
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Logo grande en hero */}
          <div className="flex justify-center mb-3">
            <img src="/xype2.png" alt="Xype" style={{ height: '400px' }} className="w-auto object-contain" />
          </div>

          <h1 className="text-5xl font-display font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Descubre lo{' '}
            <span style={{ color: '#b4965a' }}>extraordinario</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 font-light">
            Productos seleccionados con el más alto estándar de calidad
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/catalog"
              className="font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #b4965a, #c9aa6e)', color: '#1a1a28' }}
            >
              Ver catálogo
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:bg-white hover:text-brand-800"
                style={{ borderColor: '#b4965a', color: '#b4965a' }}
              >
                Crear cuenta
              </Link>
            )}
            {user && (
              <Link
                to="/cart"
                className="border font-medium px-8 py-3 rounded-lg transition-all duration-200"
                style={{ borderColor: '#b4965a', color: '#b4965a' }}
              >
                Mi carrito
              </Link>
            )}
          </div>

          {user && (
            <p className="mt-8 text-sm" style={{ color: '#b4965a' }}>
              ✓ Sesión activa como <strong>{user.email}</strong>
            </p>
          )}
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚚', title: 'Envío gratis', desc: 'En todos tus pedidos sin mínimo de compra' },
            { icon: '✦', title: 'Calidad premium', desc: 'Productos seleccionados con los más altos estándares' },
            { icon: '🔒', title: 'Pago seguro', desc: 'Tus datos siempre protegidos y encriptados' },
          ].map((f, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-brand-800 mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#22232c' }}>
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen" style={{ background: '#f8f7f5' }}>
            <Header />
            <Routes>
              <Route path="/"         element={<HomePage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/catalog"  element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart"       element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/checkout"   element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders"     element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/admin"      element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Footer */}
            <footer style={{ background: '#1a1a28' }} className="mt-16 py-8 px-4">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <img src="/xype2.png" alt="Xype" style={{ height: '56px' }} className="w-auto object-contain opacity-80" />
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} Xype. Todos los derechos reservados.
                </p>
                <div className="flex gap-4">
                  <Link to="/catalog" className="text-gray-500 hover:text-brand-gold text-sm transition-colors">Catálogo</Link>
                  <Link to="/login"   className="text-gray-500 hover:text-brand-gold text-sm transition-colors">Mi cuenta</Link>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute'; // eslint-disable-line no-unused-vars

/**
 * Header — Barra de navegación
 */
const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🛒 TiendaApp
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/catalog" className="text-gray-600 hover:text-blue-600 text-sm">
            Catálogo
          </Link>
          {user && (
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 text-sm">
              🛒 Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:inline">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
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
 * HomePage — Página de inicio con acceso rápido al catálogo
 */
const HomePage = () => {
  const { user } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Bienvenido a TiendaApp
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Encuentra los mejores productos al mejor precio
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          to="/catalog"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver catálogo
        </Link>
        {!user && (
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Crear cuenta
          </Link>
        )}
        {user && (
          <Link
            to="/cart"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Mi carrito
          </Link>
        )}
      </div>
      {user && (
        <p className="mt-8 text-sm text-green-600">
          ✅ Sesión activa como <strong>{user.email}</strong>
        </p>
      )}
    </main>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/"         element={<HomePage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/catalog"  element={<CatalogPage />} />
              <Route path="/cart"     element={
                <ProtectedRoute><CartPage /></ProtectedRoute>
              } />
              {/* Rutas del Jueves */}
              {/* <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> */}
              {/* <Route path="/admin"    element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

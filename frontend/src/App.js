import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; // eslint-disable-line no-unused-vars

/**
 * Header — Barra de navegación
 * Usa useAuth() para mostrar opciones según si el usuario está logueado o no
 */
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🛒 TiendaApp
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">
            Inicio
          </Link>
          {user ? (
            <>
              <span className="text-sm text-gray-500">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
              >
                Cerrar sesión
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
 * HomePage — Página de inicio
 * Placeholder hasta que implementemos el catálogo (Miércoles)
 */
const HomePage = () => {
  const { user } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Bienvenido a TiendaApp
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Tu tienda online favorita
      </p>
      {user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 inline-block">
          <p className="text-green-700 font-medium">
            ✅ Sesión iniciada como <strong>{user.email}</strong>
          </p>
          <p className="text-green-600 text-sm mt-1">Rol: {user.role}</p>
        </div>
      ) : (
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Crear Cuenta
          </Link>
        </div>
      )}
    </main>
  );
};

/**
 * App — Componente raíz
 * 
 * Estructura:
 * BrowserRouter → AuthProvider → Header + Routes
 * 
 * ¿Por qué BrowserRouter envuelve todo?
 * Porque useNavigate() y Link necesitan estar dentro de un Router.
 * 
 * ¿Por qué AuthProvider está dentro del Router?
 * Porque el AuthProvider usa useNavigate internamente (para redirigir tras login).
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />

            {/* Rutas protegidas — se agregarán conforme avance el sprint */}
            {/* <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}
            {/* <Route path="/admin"  element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} /> */}

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

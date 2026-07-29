import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Ruta Protegida
 * 
 * ¿Qué hace?
 * Envuelve rutas que requieren autenticación.
 * Si el usuario NO está logueado, lo redirige al login.
 * Si SÍ está logueado, muestra el componente normalmente.
 * 
 * Uso en App.js:
 *   <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
 * 
 * También soporta restricción por rol:
 *   <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Mientras verificamos el token, mostrar un spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

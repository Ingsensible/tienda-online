import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * AuthContext — Contexto de Autenticación
 * 
 * ¿Qué es el Context API de React?
 * Es una forma de compartir datos entre componentes sin tener que
 * pasar props manualmente en cada nivel del árbol de componentes.
 * 
 * ¿Por qué usarlo para la autenticación?
 * Porque el estado del usuario (¿está logueado? ¿quién es?) se necesita
 * en muchos componentes: Header, rutas protegidas, perfil, etc.
 * Sin Context, tendríamos que pasar el usuario como prop por toda la app.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Cargando mientras verificamos el token

  // Al montar la app, verificar si hay un token guardado y obtener el usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getMe()
        .then(data => setUser(data.user))
        .catch(() => {
          // Token inválido o expirado — limpiar
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
// En lugar de: const { user } = useContext(AuthContext)
// Usamos:      const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;

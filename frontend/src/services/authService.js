import axios from 'axios';

/**
 * Servicio de Autenticación
 * 
 * ¿Qué es un servicio?
 * Es un módulo que centraliza todas las llamadas a la API relacionadas
 * con un dominio (en este caso, autenticación). 
 * 
 * ¿Por qué no hacer las llamadas directamente en los componentes?
 * Porque si la URL de la API cambia, solo tienes que cambiarla aquí,
 * no en cada componente que la usa. Principio DRY (Don't Repeat Yourself).
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega el token JWT a todas las peticiones automáticamente
// ¿Por qué un interceptor? Para no tener que agregar el header manualmente
// en cada llamada a la API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Registrar nuevo usuario
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Iniciar sesión
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Obtener datos del usuario autenticado
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;

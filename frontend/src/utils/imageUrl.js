/**
 * Resuelve la URL de una imagen de producto.
 * - En desarrollo: apunta a http://localhost:4000/uploads/...
 * - En producción: apunta a REACT_APP_API_URL (sin /api) + /uploads/...
 */
const BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:4000';

export const resolveImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400x300?text=Sin+imagen';
  if (url.startsWith('/uploads/')) return `${BASE_URL}${url}`;
  return url;
};

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-bold text-blue-100 mb-4">404</p>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Página no encontrada</h1>
      <p className="text-gray-500 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          to="/catalog"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

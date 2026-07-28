import React from 'react';

/**
 * App.js — Componente raíz de la aplicación
 * 
 * Este es el punto de entrada de todos los componentes.
 * Aquí configuraremos React Router para manejar las rutas
 * (páginas) de la aplicación.
 * 
 * Por ahora muestra una pantalla de bienvenida para verificar
 * que React + Tailwind están funcionando correctamente.
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🛒 TiendaApp
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Proyecto didáctico — Sprint 1
        </p>
        <p className="text-green-500 font-medium">
          ✅ React + Tailwind CSS funcionando correctamente
        </p>
      </div>
    </div>
  );
}

export default App;

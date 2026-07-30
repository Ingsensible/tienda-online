/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le decimos a Tailwind dónde están nuestros archivos
  // para que solo incluya los estilos que realmente usamos (tree-shaking)
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

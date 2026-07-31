/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Paleta extraída del logo xype.png
      colors: {
        brand: {
          // Azul-negro profundo (fondo principal)
          950: '#0f0f1a',
          900: '#14141f',
          800: '#1a1a28',
          700: '#22232c',
          // Azul marino (secundario)
          600: '#1e3c64',
          500: '#1e3c78',
          400: '#2a4f8f',
          // Dorado/bronce (acento)
          gold: '#b4965a',
          'gold-light': '#c9aa6e',
          'gold-dark': '#8a6e3a',
        },
      },
      fontFamily: {
        // Tipografía principal — elegante y moderna como el logo
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(180, 150, 90, 0.15)',
        'gold-lg': '0 8px 40px rgba(180, 150, 90, 0.25)',
        'dark': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #1a1a28 0%, #22232c 50%, #1e3c64 100%)',
        'gradient-gold': 'linear-gradient(135deg, #b4965a 0%, #c9aa6e 100%)',
      },
    },
  },
  plugins: [],
}

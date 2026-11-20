/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#071426',
          'navy-dark': '#030a13',
          'navy-light': '#0f2442',
          'navy-border': '#1b3354',
          burgundy: '#800D1B',
          'burgundy-light': '#a51527',
          'burgundy-dark': '#5a0913',
          charcoal: '#202833',
          lightgray: '#F1F3F5',
          gold: '#000000',
          'gold-light': '#1A1A1A'
        },
        market: {
          green: '#059669',
          'green-light': '#10B981',
          'green-bg': 'rgba(16, 185, 129, 0.1)',
          red: '#DC2626',
          'red-light': '#EF4444',
          'red-bg': 'rgba(239, 68, 68, 0.1)'
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}

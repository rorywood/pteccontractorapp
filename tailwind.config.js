/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e8f0fb',
          100: '#c4d9f5',
          200: '#9abfe8',
          500: '#1565C0',
          600: '#0d52a8',
          700: '#093d80',
        },
        orange: {
          400: '#ffb347',
          500: '#F5A623',
          600: '#e08c00',
        },
        surface: '#f8fafc',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

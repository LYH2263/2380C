/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        neuro: {
          primary: '#ff6b9d',
          secondary: '#c084fc',
          accent: '#67e8f9',
          dark: '#1e1b4b',
          light: '#fdf4ff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 157, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(192, 132, 252, 0.5)' }
        }
      }
    }
  },
  plugins: []
}

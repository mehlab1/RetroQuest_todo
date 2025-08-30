/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gameboy: {
          dark: '#0F380F',
          medium: '#306230',
          light: '#8BAC0F',
          lightest: '#9BBD0F',
          screen: '#9BBD0F',
          border: '#306230'
        }
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'gameboy': ['"Press Start 2P"', 'monospace']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
};
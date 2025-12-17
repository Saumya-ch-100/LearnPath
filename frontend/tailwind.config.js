/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0066FF', // electric blue
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        teal: {
          DEFAULT: '#14B8A6',
          50: '#E6FAF8',
          100: '#CCF5F1',
          200: '#99EBE3',
          300: '#66E0D5',
          400: '#33D6C7',
          500: '#14B8A6',
          600: '#109385',
          700: '#0C6E63',
          800: '#084A42',
          900: '#042521',
        },
        purple: {
          DEFAULT: '#8B5CF6',
          50: '#F5F0FF',
          100: '#EBE0FF',
          200: '#D6C2FF',
          300: '#C2A3FF',
          400: '#AD85FF',
          500: '#8B5CF6',
          600: '#6F4AC5',
          700: '#533794',
          800: '#382562',
          900: '#1C1231',
        },
        orange: {
          DEFAULT: '#FF6B35',
          50: '#FFE9E3',
          100: '#FFD4C7',
          200: '#FFA88F',
          300: '#FF7D57',
          400: '#FF6B35',
          500: '#FF5100',
          600: '#CC4100',
          700: '#993100',
          800: '#662000',
          900: '#331000',
        },
        success: {
          DEFAULT: '#10b981',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          500: '#F59E0B',
        },
        danger: {
          DEFAULT: '#EF4444',
          500: '#EF4444',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.3)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        display: ['Cairo', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#fdf9e7',
          100: '#faf0c4',
          200: '#f5e08a',
          300: '#ecca50',
          400: '#D4AF37',
          500: '#b8952e',
          600: '#9a7b25',
          700: '#7c611c',
          800: '#5e4714',
          900: '#3f2e0b',
        },
        silver: {
          50:  '#fafafa',
          100: '#f0f0f0',
          200: '#E0E0E0',
          300: '#d0d0d0',
          400: '#C0C0C0',
          500: '#a8a8a8',
          600: '#909090',
          700: '#787878',
          800: '#606060',
          900: '#484848',
        },
        jet: {
          DEFAULT: '#1A1A1A',
          50:  '#333333',
          100: '#2a2a2a',
          200: '#222222',
        },
        alert: '#FF0000',
      },
      backgroundImage: {
        'metallic': 'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 30%, #dcdcdc 60%, #efefef 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c9a227 0%, #D4AF37 40%, #f0d060 60%, #D4AF37 80%, #b8952e 100%)',
        'gold-header': 'linear-gradient(180deg, #e8c840 0%, #D4AF37 35%, #c9a227 65%, #a07820 100%)',
        'silver-card': 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f0f0f0 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212,175,55,0.4)',
        'gold-sm': '0 2px 8px rgba(212,175,55,0.3)',
        'inset-gold': 'inset 0 1px 0 rgba(255,230,100,0.4), inset 0 -1px 0 rgba(140,100,0,0.3)',
        'card': '0 2px 16px rgba(0,0,0,0.10)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.18)',
        'metallic': '2px 2px 8px rgba(0,0,0,0.15), -1px -1px 4px rgba(255,255,255,0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-left': 'slideLeft 0.35s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideLeft: { '0%': { opacity: '0', transform: 'translateX(16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        zoomIn:    { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        ticker:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};

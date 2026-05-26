/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── AurexCart Brand Palette ────────────────────────────────────────
        black: '#000000',
        white: '#FFFFFF',
        blue: {
          neon: '#00D1FF',
          royal: '#0052FF',
          deep: '#0033CC',
          glow: '#00AAFF',
          50: '#E6F4FF',
          100: '#B3DFFF',
          200: '#80CAFF',
          300: '#4DB5FF',
          400: '#1AA0FF',
          500: '#0052FF',
          600: '#0042CC',
          700: '#003299',
          800: '#002266',
          900: '#001133',
        },
        glass: {
          white: 'rgba(255,255,255,0.05)',
          blue: 'rgba(0,82,255,0.1)',
          border: 'rgba(255,255,255,0.1)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '12px',
        heavy: '24px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 209, 255, 0.4)',
        'glow-strong': '0 0 40px rgba(0, 82, 255, 0.6)',
        'glow-royal': '0 0 30px rgba(0, 82, 255, 0.5)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.6)',
        'glass-hover': '0 16px 48px rgba(0, 82, 255, 0.3)',
        neon: '0 0 10px #00D1FF, 0 0 20px #00D1FF, 0 0 40px #0052FF',
      },
      animation: {
        'neon-slide': 'neonSlide 2.5s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shutter-open': 'shutterOpen 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glass-break': 'glassBrak 0.4s ease-out forwards',
        'glass-reassemble': 'glassReassemble 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-top': 'slideInTop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        neonSlide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 209, 255, 0.5)', opacity: '0.8' },
          '50%': { boxShadow: '0 0 25px rgba(0, 209, 255, 0.9), 0 0 50px rgba(0, 82, 255, 0.5)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shutterOpen: {
          '0%': { clipPath: 'inset(0 0 100% 0)' },
          '100%': { clipPath: 'inset(0 0 0% 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blue-glow': 'radial-gradient(ellipse at center, rgba(0, 82, 255, 0.15) 0%, transparent 70%)',
        'neon-gradient': 'linear-gradient(90deg, transparent, #00D1FF, #0052FF, transparent)',
      },
    },
  },
  plugins: [],
};

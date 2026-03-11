/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'DM Mono'", "'Courier New'", 'monospace'],
        display: ["'Fraunces'", 'Georgia', 'serif'],
      },
      colors: {
        acid: '#c8f04a',
        ink: '#0a0a0a',
        paper: '#e8e4d9',
        muted: '#6b6860',
        surface: '#141414',
        border: '#2a2a2a',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

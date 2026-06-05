/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f5ff',
          green: '#00ff88',
          red: '#ff3366',
          amber: '#ffaa00',
          purple: '#bf5fff',
        },
        dark: {
          900: '#0a0e1a',
          800: '#0f1628',
          700: '#151e35',
          600: '#1c2845',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 245, 255, 0.3)',
        'neon-red': '0 0 15px rgba(255, 51, 102, 0.4)',
        'neon-green': '0 0 15px rgba(0, 255, 136, 0.3)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

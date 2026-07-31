import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pear: '#BCFF00',
        richBlack: '#061414',
        laurelLeaf: '#96998C',
        celeste: '#D2D3CE',
        ceilingWhite: '#E9EBE6',
        surface: '#0E2222',
        surfaceBorder: '#1C3333',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-off-white': '#F6EFE9',
        'brand-tan': '#B8A481',
        'brand-sage': '#69867E',
        'brand-mint': '#AFBFBB',
        'brand-gray': '#767270',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      letterSpacing: {
        'brand': '0.18em',
      },
      maxWidth: {
        'reading': '680px',
      },
    },
  },
  plugins: [],
}

export default config

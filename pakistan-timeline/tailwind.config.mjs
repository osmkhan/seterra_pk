/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      colors: {
        bg: '#0D0C0A',
        surface: '#141210',
        rail: '#3A3020',
        ink: '#E8DEC8',
        muted: '#8A7A60',
      },
    },
  },
  plugins: [],
};

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
        bg: '#EDE2C6',
        surface: '#F4ECD4',
        rail: '#8A6F47',
        ink: '#2A1F14',
        muted: '#6B5638',
      },
    },
  },
  plugins: [],
};


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-inter)'],
      },
      colors: {
        'nom-bg': '#070707',
      },
      boxShadow: {
        'glow': '0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(255,255,255,0.04)',
      }
    },
  },
  plugins: [],
}

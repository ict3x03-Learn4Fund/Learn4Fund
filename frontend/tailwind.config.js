/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    },boxShadow: {
      'banner': '0px 1px 4px rgba(0, 0, 0, 0.15)',
      'price-quote': '0px 4px 0px rgba(0, 0, 0, 0.10)'
    }
  },
  },
  plugins: [],
}

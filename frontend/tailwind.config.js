/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      'type1': ['Roboto', 'sans-serif'],
      'type2': ['Pattaya', 'sans-serif'],
      'type3': ['Rubik', 'sans-serif'],
      'type4': ['Black Ops One', 'sans-serif'],
      'type5': ['Space Grotesk', 'sans-serif'],
    },boxShadow: {
      'banner': '0px 1px 4px rgba(0, 0, 0, 0.15)',
      'price-quote': '0px 4px 0px rgba(0, 0, 0, 0.10)'
    },
      colors: {
        'b1': '#2c2c6c',
        'b2': '#1f1f38',
        'b3': '#2A64DB',
        'g1': '#3B3E48',
        'g2': '#494F5C',
        'g3': '#5A6270',
        'w1': '#FFFFFF',
        'w2': '#F8F8F8',
        'success': '#00B87C',
    }
  },
  },
  plugins: [],
}

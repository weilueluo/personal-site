/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./app/**/*.{ts,tsx,scss,css}",
    "./components/**/*.{ts,tsx,scss,css}",
    "./shared/**/*.{ts,tsx,scss,css}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height',
        width: 'width',
        margin: 'margin',
      }
    },
  },
  plugins: [],
}
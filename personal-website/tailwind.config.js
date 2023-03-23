/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./app/**/*.{ts,tsx,scss}",
    "./components/**/*.{ts,tsx,scss}",
    "./shared/**/*.{ts,tsx,scss}",
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
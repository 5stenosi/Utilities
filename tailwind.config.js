/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html, js, jsx, ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  experimental: {
    applyComplexClasses: true,
  },
}
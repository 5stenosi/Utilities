/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html, js, jsx, ts}"],
  theme: {
    extend: {
      scale: {
        '200': '2',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  experimental: {
    applyComplexClasses: true,
  },
  darkMode: 'class',
}
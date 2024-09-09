/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}', // entry point f find .html, .js in src
    './dist/**/*.html', // entry point f .html, .js in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


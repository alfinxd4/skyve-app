/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['SF Pro Display', 'sans-serif'],
    },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}


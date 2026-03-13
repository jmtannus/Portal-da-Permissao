/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#301934',
        'ultra-violet': '#5F4B8B',
        '#F7E7CE': '#F7E7CE',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./src/utils/tailwind.config')],
  content: ['./index.html', './App.vue', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

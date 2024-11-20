/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./src/tailwind/preset')],
  content: ['./index.html', './App.vue', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

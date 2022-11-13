// const
module.exports = {
  presets: [require('../src/utils/tailwind.config')],
  content: [
    './docs/**/*.{md,vue,js}',
    './src/components/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {},
  plugins: [],
}

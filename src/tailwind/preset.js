const themePlugin = require('./plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    themePlugin,
  ],
}

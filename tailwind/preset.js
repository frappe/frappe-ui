import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

import themePlugin from './plugin.js'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [forms, typography, themePlugin],
}

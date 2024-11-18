const plugin = require('tailwindcss/plugin')
const { themedCssVariables, colorsFn } = require('./colors')

let fontStyles = (theme) => ({
  html: {
    'font-family': `Inter, ${theme('fontFamily.sans')}`,
  },
  '@supports (font-variation-settings: normal)': {
    html: {
      'font-family': `InterVar, ${theme('fontFamily.sans')}`,
      'font-optical-sizing': 'auto',
    },
  },
})

module.exports = plugin(
  function ({ addBase, theme }) {
    addBase({ ...fontStyles(theme), ...themedCssVariables() })
  },
  {
    theme: {
      colors: colorsFn,
    },
  },
)

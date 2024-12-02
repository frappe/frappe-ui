const tailwindColors = require('tailwindcss/colors')
const colorsData = require('./colors.json')

function generateColorPalette() {
  const colorPalette = {
    inherit: tailwindColors.inherit,
    current: tailwindColors.current,
    transparent: tailwindColors.transparent,
    black: tailwindColors.black,
    white: tailwindColors.white,
    gray: {},
    blue: {},
    green: {},
    red: {},
    orange: {},
    yellow: {},
    teal: {},
    violet: {},
    cyan: {},
    amber: {},
    pink: {},
    purple: {},
    'white-overlay': {},
    'black-overlay': {},
  }

  Object.keys(colorsData.lightMode).forEach((color) => {
    colorPalette[color] = colorsData.lightMode[color]
  })

  Object.keys(colorsData.overlay.white).forEach((shade) => {
    colorPalette['white-overlay'][shade] = colorsData.overlay.white[shade]
  })

  Object.keys(colorsData.overlay.black).forEach((shade) => {
    colorPalette['black-overlay'][shade] = colorsData.overlay.black[shade]
  })

  return colorPalette
}

function resolveColorReference(reference) {
  const [mode, color, shade] = reference.split('/')
  if (mode === 'lightMode') {
    return colorsData.lightMode[color][shade]
  } else if (mode === 'darkMode') {
    return colorsData.darkMode[color][shade]
  } else if (mode === 'overlay') {
    return colorsData.overlay[color][shade]
  } else if (mode === 'neutral') {
    return colorsData.neutral[color]
  }
  return null
}

function generateCSSVariables() {
  const output = {
    ':root': {},
    '[data-theme="dark"]': {},
  }

  // Generate CSS variables for light mode
  Object.keys(colorsData.themedVariables.light).forEach((category) => {
    Object.keys(colorsData.themedVariables.light[category]).forEach(
      (colorName) => {
        const variableName = `--${category}-${colorName}`
        const reference = colorsData.themedVariables.light[category][colorName]
        const lightValue = resolveColorReference(reference)
        output[':root'][variableName] = lightValue
      },
    )
  })

  // Generate CSS variables for dark mode
  Object.keys(colorsData.themedVariables.dark).forEach((category) => {
    Object.keys(colorsData.themedVariables.dark[category]).forEach(
      (colorName) => {
        const variableName = `--${category}-${colorName}`
        const reference = colorsData.themedVariables.dark[category][colorName]
        const darkValue = resolveColorReference(reference)
        output['[data-theme="dark"]'][variableName] = darkValue
      },
    )
  })

  return output
}

function generateSemanticColors() {
  const output = {
    outline: {},
    surface: {},
    ink: {},
  }

  // Generate semantic colors
  Object.keys(colorsData.themedVariables.light).forEach((category) => {
    Object.keys(colorsData.themedVariables.light[category]).forEach(
      (colorName) => {
        const variableName = `${category}-${colorName}`
        const reference = colorsData.themedVariables.light[category][colorName]
        const lightValue = resolveColorReference(reference)
        output[category][colorName] = `var(--${variableName}, ${lightValue})`
      },
    )
  })

  return output
}

module.exports = {
  generateColorPalette,
  generateCSSVariables,
  generateSemanticColors,
}

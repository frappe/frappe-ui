import tailwindColors from 'tailwindcss/colors'
import colorsData from './colors.json'
import effectsData from './generated/effects.json'

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
  Object.keys(colorsData.darkMode).forEach((color) => {
    colorPalette[`dark-${color}`] = colorsData.darkMode[color]
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

  // Generate CSS variables for each color shade
  Object.keys(colorsData.lightMode).forEach((color) => {
    Object.keys(colorsData.lightMode[color]).forEach((shade) => {
      const variableName = `--${color}-${shade}`
      const value = colorsData.lightMode[color][shade]
      output[':root'][variableName] = value
    })
  })

  Object.keys(colorsData.darkMode).forEach((color) => {
    Object.keys(colorsData.darkMode[color]).forEach((shade) => {
      const variableName = `--dark-${color}-${shade}`
      const value = colorsData.darkMode[color][shade]
      output['[data-theme="dark"]'][variableName] = value
    })
  })

  return output
}

function generateSemanticColors() {
  const output = Object.fromEntries(
    Object.keys(colorsData.themedVariables.light).map((category) => [category, {}]),
  )

  // Generate semantic colors
  Object.keys(colorsData.themedVariables.light).forEach((category) => {
    Object.keys(colorsData.themedVariables.light[category]).forEach(
      (colorName) => {
        const variableName = `${category}-${colorName}`
        const reference = colorsData.themedVariables.light[category][colorName]
        const lightValue = resolveColorReference(reference)
        output[category][colorName] =
          `color-mix(in srgb, var(--${variableName}, ${lightValue}) calc(<alpha-value> * 100%), transparent)`
      },
    )
  })

  return output
}

// Emit `--elevation-*` and `--focus-*` CSS variables. Elevation uses the
// Figma `light/*` values in both modes (matches how Espresso 2.0 actually
// applies shadows in dark mode — see the dark-mode page in Figma, which
// references `elevation/light/*` exclusively). The Figma `dark/*` set is
// exposed as `--dark-elevation-*` for opt-in use via `shadow-dark-*`.
// Focus rings still mode-swap. Theme-independent entries (e.g.
// `elevation.custom.status`) land in `:root` only.
function generateEffectVariables() {
  const output = {
    ':root': {},
    '[data-theme="dark"]': {},
  }

  for (const [step, value] of Object.entries(effectsData.elevation.light)) {
    output[':root'][`--elevation-${step}`] = value
  }
  for (const [step, value] of Object.entries(effectsData.elevation.dark)) {
    output[':root'][`--dark-elevation-${step}`] = value
  }
  for (const [name, value] of Object.entries(effectsData.elevation.custom)) {
    output[':root'][`--elevation-${name}`] = value
  }
  for (const [name, value] of Object.entries(effectsData.focus.light)) {
    output[':root'][`--focus-${name}`] = value
    output[':root'][`--focus-outline-${name}`] = shadowToOutline(value)
  }
  for (const [name, value] of Object.entries(effectsData.focus.dark)) {
    output['[data-theme="dark"]'][`--focus-${name}`] = value
    output['[data-theme="dark"]'][`--focus-outline-${name}`] = shadowToOutline(value)
  }

  return output
}

// Focus tokens are single-layer `0 0 0 <spread> <color>` shadows — re-express
// as an `outline` shorthand (`<spread> solid <color>`) so the global focus
// ring can use outline instead of box-shadow (no collisions with shadow/ring
// utilities, survives forced-colors mode).
function shadowToOutline(shadow) {
  const parts = shadow.trim().split(/\s+/)
  return `${parts[3]} solid ${parts.slice(4).join(' ')}`
}

export {
  generateColorPalette,
  generateCSSVariables,
  generateSemanticColors,
  generateEffectVariables,
}

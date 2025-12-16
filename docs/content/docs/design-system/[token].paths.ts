import resolveConfig from 'tailwindcss/resolveConfig'
import config from '../../../../tailwind.config'

const designTokens = resolveConfig(config).theme

const getBgColors = () => {
  let colors: { name: string; value?: string }[] = []
  const list = designTokens.backgroundColor.surface

  for (const [key, value] of Object.entries(list)) {
    const classname = `bg-surface-${key}`

    if (colors.length > 0) {
      const lastcolor = colors.at(-1).name.split('-')[2]
      const curColor = key.split('-')[0]
      if (lastcolor !== curColor) colors.push({ name: curColor })
    }

    colors.push({ name: classname, value })
  }

  return colors
}

const bgColors = getBgColors()

const getTextColors = () => {
  let colors: { name: string; value?: string }[] = []
  const list = designTokens.textColor.ink

  for (const [key, value] of Object.entries(list)) {
    const classname = `text-ink-${key}`

    if (colors.length > 0) {
      const lastcolor = colors.at(-1).name.split('-')[2]
      const curColor = key.split('-')[0]
      if (lastcolor !== curColor) colors.push({ name: curColor })
    }

    colors.push({ name: classname, value })
  }

  return colors
}

const txtColors = getTextColors()

const getBorderColors = () => {
  let colors: { name: string; value?: string }[] = []
  const list = designTokens.borderColor.outline

  for (const [key, value] of Object.entries(list)) {
    const classname = `border-outline-${key}`

    if (colors.length > 0) {
      const lastcolor = colors.at(-1).name.split('-')[2]
      const curColor = key.split('-')[0]
      if (lastcolor !== curColor) colors.push({ name: curColor })
    }

    colors.push({ name: classname, value })
  }

  return colors
}

const borderColors = getBorderColors()

const fontSize = Object.entries(designTokens.fontSize).map(([name, value]) => ({
  name,
  value,
}))

const fontWeight = Object.entries(designTokens.fontWeight).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

const fontFamily = Object.entries(designTokens.fontFamily).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

const letterSpacing = Object.entries(designTokens.letterSpacing).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

const lineHeight = Object.entries(designTokens.lineHeight).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

const dropShadow = Object.entries(designTokens.dropShadow).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

const borderRadius = Object.entries(designTokens.borderRadius).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

const borderWidth = Object.entries(designTokens.borderWidth).map(
  ([name, value]) => ({
    name,
    value,
  }),
)

export default {
  paths() {
    return [
      { params: { token: 'bg-color', data: bgColors } },
      { params: { token: 'text-color', data: txtColors } },
      { params: { token: 'border-color', data: borderColors } },
      { params: { token: 'font-size', data: fontSize } },
      { params: { token: 'font-weight', data: fontWeight } },
      { params: { token: 'font-family', data: fontFamily } },
      { params: { token: 'letter-spacing', data: letterSpacing } },
      { params: { token: 'line-height', data: lineHeight } },
      { params: { token: 'drop-shadow', data: dropShadow } },
      { params: { token: 'border-radius', data: borderRadius } },
      { params: { token: 'border-width', data: borderWidth } },
    ]
  },
}

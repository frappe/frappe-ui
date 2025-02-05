const colors = require('./colors.json')
const { runMigration } = require('./tailwind-class-migration-utils')

function generateClassMap() {
  const classMap = {
    'text-white': 'text-ink-white',
    'bg-white': 'bg-surface-white',
  }

  // Generate surface class map
  Object.keys(colors.themedVariables.light.surface).forEach((key) => {
    const reference = colors.themedVariables.light.surface[key]
    const [mode, color, shade] = reference.split('/')
    const className = `bg-${color}-${shade}`
    const surfaceClassName = `bg-surface-${key}`
    classMap[className] = surfaceClassName
  })

  // Generate outline class map
  Object.keys(colors.themedVariables.light.outline).forEach((key) => {
    const reference = colors.themedVariables.light.outline[key]
    const [mode, color, shade] = reference.split('/')
    const borderClassName = `border-${color}-${shade}`
    const divideClassName = `divide-${color}-${shade}`
    const ringClassName = `ring-${color}-${shade}`
    const outlineClassName = `border-outline-${key}`
    const divideOutlineClassName = `divide-outline-${key}`
    const ringOutlineClassName = `ring-outline-${key}`
    classMap[borderClassName] = outlineClassName
    classMap[divideClassName] = divideOutlineClassName
    classMap[ringClassName] = ringOutlineClassName
  })

  // Generate ink class map
  Object.keys(colors.themedVariables.light.ink).forEach((key) => {
    const reference = colors.themedVariables.light.ink[key]
    const [mode, color, shade] = reference.split('/')
    const className = `text-${color}-${shade}`
    const inkClassName = `text-ink-${key}`
    const placeholderClassName = `placeholder-${color}-${shade}`
    const placeholderInkClassName = `placeholder-ink-${key}`
    classMap[className] = inkClassName
    classMap[placeholderClassName] = placeholderInkClassName
  })

  return classMap
}

runMigration(generateClassMap())

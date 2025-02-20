const colors = require('./colors.json')
const colorsv2 = require('./colorsv2.json')
const { runMigration } = require('./tailwind-class-migration-utils')

function generateClassMapping() {
  const mapping = {}
  const categories = ['outline', 'surface', 'ink']
  const prefixes = {
    outline: ['outline'],
    surface: ['bg-surface', 'fill-surface'],
    ink: ['text-ink', 'fill-ink', 'stroke-ink'],
  }

  // Category-specific mappings based on value comparisons
  const categoryMappings = {
    outline: {
      'red-1': 'red-2', // red/300 value stayed same
      'red-2': 'red-3', // red/400 value stayed same
      'red-3': 'red-4', // red/500 value stayed same
      'green-1': 'green-2', // green/300 value stayed same
      'green-2': 'green-3', // green/400 value stayed same
      'amber-1': 'amber-2', // amber/300 value stayed same
      'amber-2': 'amber-3', // amber/400 value stayed same
      'blue-1': 'blue-2', // blue/300 value stayed same
      'orange-1': 'orange-3', // orange/400 value stayed same
    },
    surface: {
      'green-3': 'green-5', // green/600 value stayed same
      'amber-3': 'amber-5', // amber/600 value stayed same
      'blue-3': 'blue-5', // blue/600 value stayed same
      'orange-1': 'orange-2', // orange/100 value stayed same
      'violet-1': 'violet-2', // violet/100 value stayed same
      'cyan-1': 'cyan-2', // cyan/100 value stayed same
      'pink-1': null, // removed completely
    },
    ink: {
      // Gray scale shift
      'gray-9': 'gray-8',
      'gray-8': 'gray-7',
      'gray-7': 'gray-6',

      // Green scale shift
      'green-2': 'green-3',
      'green-3': 'green-4',

      // Amber scale shift
      'amber-2': 'amber-3',
      'amber-3': 'amber-4',

      // Blue scale shift
      'blue-2': 'blue-3',
      'blue-3': 'blue-4',

      // Single step changes
      'cyan-1': 'cyan-3',
      'violet-1': 'violet-3',

      // Removed
      'pink-1': null,
    },
  }

  // Apply category-specific mappings first
  categories.forEach((category) => {
    const mappingsForCategory = categoryMappings[category] || {}
    Object.entries(mappingsForCategory).forEach(([oldKey, newKey]) => {
      prefixes[category].forEach((prefix) => {
        const oldClass = `${prefix}-${oldKey}`
        mapping[oldClass] = newKey ? `${prefix}-${newKey}` : null
      })
    })
  })

  // Process both themes
  ;['light', 'dark'].forEach((theme) => {
    categories.forEach((category) => {
      const oldVars = colors.themedVariables[theme][category]
      const newVars = colorsv2.themedVariables[theme][category]

      // Find removed or changed variables
      Object.keys(oldVars).forEach((key) => {
        if (!newVars[key]) {
          prefixes[category].forEach((prefix) => {
            const className = `${prefix}-${key}`
            if (!mapping[className]) {
              // Don't override special mappings
              mapping[className] = null
            }
          })
        } else if (oldVars[key] !== newVars[key]) {
          // Color value changed but class name remains same
          // No mapping needed, but log for reference
          let oldColor = oldVars[key]
          let newColor = newVars[key]

          //   console.log(
          //     `Color value changed for ${theme}/${category}/${key} from ${oldColor} to ${newColor}`,
          //   )
        }
      })
    })
  })

  return mapping
}

runMigration(generateClassMapping())

const fs = require('fs')
const path = require('path')
const colors = require('./colors.json')

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
    const className = `border-${color}-${shade}`
    const outlineClassName = `border-outline-${key}`
    classMap[className] = outlineClassName
  })

  // Generate ink class map
  Object.keys(colors.themedVariables.light.ink).forEach((key) => {
    const reference = colors.themedVariables.light.ink[key]
    const [mode, color, shade] = reference.split('/')
    const className = `text-${color}-${shade}`
    const inkClassName = `text-ink-${key}`
    classMap[className] = inkClassName
  })

  return classMap
}

function replaceClassesInFile(filePath, classMap) {
  let fileContent = fs.readFileSync(filePath, 'utf8')
  let classesChanged = 0

  Object.keys(classMap).forEach((key) => {
    const value = classMap[key]
    const regex = new RegExp(`\\b${key}\\b`, 'g')
    const matches = fileContent.match(regex)
    if (matches) {
      classesChanged += matches.length
    }
    fileContent = fileContent.replace(regex, value)
  })

  fs.writeFileSync(filePath, fileContent, 'utf8')
  console.log(`Replaced ${classesChanged} classes in ${filePath}`)
}

function getFilePath() {
  let filePath = process.argv[2]
  let fullPath = path.resolve(process.cwd(), filePath)
  if (fs.existsSync(fullPath)) {
    return fullPath
  } else {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }
}

// Generate the class map
const classMap = generateClassMap()

// Replace classes in a file
const filePath = getFilePath()
replaceClassesInFile(filePath, classMap)

import fs from 'fs'
import path from 'path'
import colors from './colors.json' assert { type: 'json' }

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

function replaceClassesInFolder(targetPath, classMap) {
  const files = fs.readdirSync(targetPath)

  files.forEach((file) => {
    const fullPath = path.join(targetPath, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      replaceClassesInFolder(fullPath, classMap)
    } else if (stat.isFile()) {
      replaceClassesInFile(fullPath, classMap)
    }
  })
}

function getPath() {
  let targetPath = process.argv[2]
  let fullPath = path.resolve(process.cwd(), targetPath)
  if (fs.existsSync(fullPath)) {
    return fullPath
  }
  console.error(`Invalid path: ${fullPath}`)
  process.exit(1)
}

// Generate the class map
const classMap = generateClassMap()

const targetPath = getPath()
let stats = fs.statSync(targetPath)
if (stats.isFile()) {
  replaceClassesInFile(targetPath, classMap)
} else if (stats.isDirectory()) {
  replaceClassesInFolder(targetPath, classMap)
}

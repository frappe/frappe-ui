const fs = require('fs')
const path = require('path')

function getPath() {
  let targetPath = process.argv[2]
  let fullPath = path.resolve(process.cwd(), targetPath)
  if (fs.existsSync(fullPath)) {
    return fullPath
  }
  console.error(`Invalid path: ${fullPath}`)
  process.exit(1)
}

function isValidFile(file) {
  const validExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html']
  return validExtensions.includes(path.extname(file))
}

function walkSync(dir) {
  const results = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const filePath = path.join(dir, file.name)
    // Check if node_modules exists anywhere in the path
    if (
      filePath.includes(path.sep + 'node_modules' + path.sep) ||
      filePath.endsWith(path.sep + 'node_modules')
    )
      continue

    if (file.isDirectory()) {
      results.push(...walkSync(filePath))
    } else if (file.isFile() && isValidFile(file.name)) {
      results.push(filePath)
    }
  }
  return results
}

async function processFiles(targetPath, classMap) {
  if (!classMap || Object.keys(classMap).length === 0) {
    throw new Error('classMap is required and cannot be empty')
  }

  let totalFiles = 0
  let totalModified = 0
  let removedClasses = new Set()
  let modifiedFiles = new Set()

  try {
    const stats = fs.statSync(targetPath)
    const filePaths = stats.isFile() ? [targetPath] : walkSync(targetPath)

    // Create a single regex for all patterns with word boundaries
    const patterns = Object.keys(classMap)
      .map((cls) => cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special characters
      .map((cls) => `\\b${cls}\\b`)
      .join('|')
    const regex = new RegExp(`(${patterns})`, 'g')

    for (const file of filePaths) {
      totalFiles++
      try {
        const content = await fs.promises.readFile(file, 'utf8')
        let modified = false
        let newContent = content.replace(regex, (match) => {
          modified = true
          const replacement = classMap[match]
          if (replacement === null) {
            removedClasses.add(match)
            console.warn(`Warning: ${file} contains removed class "${match}"`)
            return `/* REMOVED: ${match} */`
          }
          return replacement
        })

        if (modified) {
          await fs.promises.writeFile(file, newContent)
          modifiedFiles.add(file)
          totalModified++
        }
      } catch (fileError) {
        if (fileError.code === 'EACCES') {
          console.error(`Permission denied: ${file}`)
        } else {
          console.error(`Error processing file ${file}:`, fileError)
        }
      }
    }

    console.log('\nMigration Summary:')
    console.log('------------------')
    console.log(`Total Files: ${totalFiles}`)
    console.log(`Modified Files: ${totalModified}`)

    if (removedClasses.size > 0) {
      console.log('\nRemoved Classes:')
      console.table([...removedClasses].map((cls) => ({ class: cls })))
    }

    if (modifiedFiles.size > 0) {
      console.log('\nModified Files:')
      console.table(
        [...modifiedFiles].map((file) => ({
          file: path.relative(process.cwd(), file),
        })),
      )
    }
  } catch (error) {
    console.error('Error processing files:', error)
    process.exit(1)
  }
}

async function runMigration(classMap) {
  try {
    if (typeof classMap !== 'object') {
      throw new Error('classMap must be an object')
    }
    const targetPath = getPath()
    await processFiles(targetPath, classMap)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

module.exports = { runMigration }

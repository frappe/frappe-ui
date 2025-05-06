import path from 'path'
import { fileURLToPath } from 'url'
import { findAppsFolder } from './utils.js'
import { DocTypeInterfaceGenerator } from './doctypeInterfaceGenerator.js'

// Handle termination signals to exit cleanly
process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main() {
  try {
    // Parse options passed from the plugin
    let options = {}
    if (process.argv[2]) {
      try {
        options = JSON.parse(process.argv[2])
      } catch (err) {
        console.error('Error parsing plugin options:', err)
      }
    }

    // Use only the plugin options for configuration
    if (!(options && options.input)) {
      console.log('No type generation input specified in options')
      return
    }

    const frontendFolder = process.cwd()
    let outputPath = options.output || 'src/types/doctypes.ts'
    if (!path.isAbsolute(outputPath)) {
      outputPath = path.join(frontendFolder, outputPath)
    }

    const appsFolder = findAppsFolder()
    if (!appsFolder) {
      console.error('Could not find frappe-bench/apps folder')
      return
    }

    const generator = new DocTypeInterfaceGenerator(
      appsFolder,
      options.input,
      outputPath,
    )
    await generator.generate()
  } catch (error) {
    console.error('Error generating DocType interfaces:', error)
    process.exit(1)
  }
}

// Execute if run directly
const currentFilePath = fileURLToPath(import.meta.url)
if (process.argv[1] === currentFilePath) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

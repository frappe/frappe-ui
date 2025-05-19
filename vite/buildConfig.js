import path from 'path'
import fs from 'fs'

export function buildConfig(options = {}) {
  let outDir = options.outDir || findOutputDir()
  if (!outDir) {
    console.error(
      '[frappeui-build-config-plugin] Could not find build output directory automatically. Please specify it manually.',
    )
    return
  }

  const defaultOptions = {
    outDir,
    emptyOutDir: true,
    sourcemap: true,
    indexHtmlPath: null,
    baseUrl: options.baseUrl || getBaseUrl(outDir),
  }

  const mergedOptions = { ...defaultOptions, ...options }

  return {
    name: 'frappeui-build-config-plugin',
    config(config, { command, mode }) {
      const buildConfig = {
        build: {
          outDir: mergedOptions.outDir,
          emptyOutDir: mergedOptions.emptyOutDir,
          commonjsOptions: {
            include: [/tailwind.config.js/, /node_modules/],
          },
          sourcemap: mergedOptions.sourcemap,
        },
      }

      if (mode === 'production') {
        // Apply baseUrl only in production mode
        buildConfig.base = mergedOptions.baseUrl

        if (!mergedOptions.indexHtmlPath) {
          throw new Error(
            '[frappeui-build-config-plugin] indexHtmlPath is required in buildConfig options',
          )
        }
      }

      return buildConfig
    },
    writeBundle(options, bundle) {
      if (mergedOptions.indexHtmlPath) {
        try {
          const sourceHtml = path.join(mergedOptions.outDir, 'index.html')
          if (fs.existsSync(sourceHtml)) {
            // Ensure destination directory exists
            const destDir = path.dirname(mergedOptions.indexHtmlPath)
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true })
            }

            fs.copyFileSync(sourceHtml, mergedOptions.indexHtmlPath)
            console.log(
              `[frappeui-build-config-plugin] Successfully copied index.html to ${mergedOptions.indexHtmlPath}`,
            )
          } else {
            console.error(
              `[frappeui-build-config-plugin] Source index.html not found at ${sourceHtml}`,
            )
          }
        } catch (error) {
          console.error(
            '[frappeui-build-config-plugin] Error copying index.html:',
            error,
          )
        }
      }
    },
  }
}

function findOutputDir() {
  let appDir = findAppDir()
  if (appDir) {
    return path.join(appDir, 'public', 'frontend')
  }
  return null
}

function getBaseUrl(outputDir) {
  try {
    // Parse the output directory path to extract app name
    // Expected pattern: /path/to/apps/app_name/app_name/public/frontend
    if (!outputDir) return '/'

    const parts = outputDir.split(path.sep)
    const publicIndex = parts.indexOf('public')

    if (publicIndex > 0) {
      const appName = parts[publicIndex - 1] // Get the app name from path

      // Check if the app name appears twice in sequence (common in Frappe apps)
      const appsIndex = parts.indexOf('apps')
      if (appsIndex >= 0 && publicIndex > appsIndex + 2) {
        // If in standard Frappe app structure, use the app name from apps/app_name path
        const possibleAppName = parts[appsIndex + 1]
        if (possibleAppName === appName) {
          // Determine the part after public (typically 'frontend')
          const subdir = parts[publicIndex + 1] || ''
          return `/assets/${appName}/${subdir}/`
        }
      }

      // Fallback: just use the detected app name with standard structure
      const subdir = parts[publicIndex + 1] || ''
      return `/assets/${appName}/${subdir}/`
    }
    // fallback
    return '/'
  } catch (error) {
    console.error(
      '[frappeui-build-config-plugin] Error calculating base URL:',
      error,
    )
    // fallback on error
    return '/'
  }
}

function findAppDir() {
  // currentDir is the vue app directory
  let currentDir = process.cwd()
  // appDir is the frappe app directory
  let appDir = path.resolve(currentDir, '..')

  try {
    // Read directories in the app directory
    const directories = fs
      .readdirSync(appDir)
      .filter((item) => fs.statSync(path.join(appDir, item)).isDirectory())

    // Find the first directory that contains folders typical of a Frappe app
    for (const dir of directories) {
      const dirPath = path.join(appDir, dir)
      try {
        const contents = fs.readdirSync(dirPath)
        if (
          contents.includes('public') &&
          contents.includes('patches') &&
          contents.includes('www') &&
          contents.includes('hooks.py')
        ) {
          return dirPath
        }
      } catch (error) {
        // Skip directories that can't be read
        continue
      }
    }
  } catch (error) {
    console.error(
      '[frappeui-build-config-plugin] Error finding app directory:',
      error,
    )
  }

  return null
}

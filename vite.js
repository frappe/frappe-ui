const path = require('path')
const fs = require('fs')
const DocTypeInterfaceGenerator = require('./scripts/generateInterface')

module.exports = function proxyOptions({
  port = 8080,
  source = '^/(app|login|api|assets|files|private)',
} = {}) {
  const commonSiteConfig = getCommonSiteConfig()
  const webserver_port = commonSiteConfig
    ? commonSiteConfig.webserver_port
    : 8000
  if (!commonSiteConfig) {
    console.log('No common_site_config.json found, using default port 8000')
  }
  let proxy = {}
  proxy[source] = {
    target: `http://127.0.0.1:${webserver_port}`,
    ws: true,
    router: function (req) {
      const site_name = req.headers.host.split(':')[0]
      return `http://${site_name}:${webserver_port}`
    },
  }

  return {
    name: 'frappeui-vite-plugin',
    config: async () => {
      await generateDocTypeInterfaces()

      return {
        server: {
          port: port,
          proxy: proxy,
        },
      }
    },
  }
}

async function generateDocTypeInterfaces() {
  const config = getConfig()
  if (!(config && config.typeGeneration && config.typeGeneration.input)) return

  const frontendFolder = process.cwd()
  let outputPath = config.typeGeneration.output || 'src/types/doctypes.ts'
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
    config.typeGeneration.input,
    outputPath,
  )
  await generator.generate()
}

function getCommonSiteConfig() {
  let currentDir = path.resolve('.')
  // traverse up till we find frappe-bench with sites directory
  while (currentDir !== '/') {
    if (
      fs.existsSync(path.join(currentDir, 'sites')) &&
      fs.existsSync(path.join(currentDir, 'apps'))
    ) {
      let configPath = path.join(currentDir, 'sites', 'common_site_config.json')
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath))
      }
      return null
    }
    currentDir = path.resolve(currentDir, '..')
  }
  return null
}

function findAppsFolder() {
  let currentDir = process.cwd()
  while (currentDir !== '/') {
    if (
      fs.existsSync(path.join(currentDir, 'apps')) &&
      fs.existsSync(path.join(currentDir, 'sites'))
    ) {
      return path.join(currentDir, 'apps')
    }
    currentDir = path.resolve(currentDir, '..')
  }
  return null
}

function getConfig() {
  let configPath = path.join(process.cwd(), 'frappeui.json')
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath))
  }
}

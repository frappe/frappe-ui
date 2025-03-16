const path = require('path')
const fs = require('fs')

function getConfig() {
  let configPath = path.join(process.cwd(), 'frappeui.json')
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath))
  }
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

module.exports = {
  getConfig,
  getCommonSiteConfig,
  findAppsFolder,
}

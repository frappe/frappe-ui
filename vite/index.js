const { lucideIcons } = require('./lucideIcons')
const { frappeProxy } = require('./frappeProxy')
const { frappeTypes } = require('./frappeTypes')
const { jinjaBootData } = require('./jinjaBootData')
const { buildConfig } = require('./buildConfig')

function frappeuiPlugin(
  options = {
    lucideIcons: true,
    frappeProxy: true,
    frappeTypes: true,
    jinjaBootData: true,
    buildConfig: true,
  },
) {
  let plugins = []
  if (options.lucideIcons) {
    plugins.push(lucideIcons(options.lucideIcons))
  }
  if (options.frappeProxy) {
    plugins.push(frappeProxy(options.frappeProxy))
  }
  if (options.frappeTypes) {
    plugins.push(frappeTypes(options.frappeTypes))
  }
  if (options.jinjaBootData) {
    plugins.push(jinjaBootData(options.jinjaBootData))
  }
  if (options.buildConfig) {
    plugins.push(buildConfig(options.buildConfig))
  }
  return plugins
}

module.exports = frappeuiPlugin

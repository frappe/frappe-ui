import { lucideIcons } from './lucideIcons.js'
import { frappeProxy } from './frappeProxy.js'
import { frappeTypes } from './frappeTypes.js'
import { jinjaBootData } from './jinjaBootData.js'
import { buildConfig } from './buildConfig.js'

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

  const DepsIncludePlugin = {
    name: 'optimize-deps-include',
    config(config) {
      if (!config.optimizeDeps) config.optimizeDeps = {}

      const includedDeps = config.optimizeDeps?.include || []
      const moduleName = 'highlight.js/lib/core'

      if (includedDeps.includes(moduleName)) return
      config.optimizeDeps.include = [moduleName, ...includedDeps]
    },
  }

  plugins.push(DepsIncludePlugin)

  return plugins
}

export default frappeuiPlugin

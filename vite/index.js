import { lucideIcons } from './lucideIcons.js'
import { frappeProxy } from './frappeProxy.js'
import { frappeTypes } from './frappeTypes.js'
import { jinjaBootData } from './jinjaBootData.js'
import { buildConfig } from './buildConfig.js'
import { siteBanner } from './siteBanner.js'

function frappeuiPlugin(options = {}) {
  let plugins = []
  const frontendRoute = options.frontendRoute

  const lucideIconsOpt = options.lucideIcons ?? true
  const frappeProxyOpt = options.frappeProxy ?? true
  const jinjaBootDataOpt = options.jinjaBootData ?? true
  const buildConfigOpt = options.buildConfig ?? true

  if (lucideIconsOpt) {
    plugins.push(lucideIcons(lucideIconsOpt))
  }
  if (frappeProxyOpt) {
    const proxyOpts = typeof frappeProxyOpt === 'object' ? frappeProxyOpt : {}
    plugins.push(frappeProxy(proxyOpts))
  }

  const bannerPlugin = siteBanner({ frontendRoute })
  if (bannerPlugin) {
    plugins.push(bannerPlugin)
  }
  if (options.frappeTypes) {
    plugins.push(frappeTypes(options.frappeTypes))
  }
  if (jinjaBootDataOpt) {
    plugins.push(jinjaBootData(jinjaBootDataOpt))
  }
  if (buildConfigOpt) {
    const buildOpts = typeof buildConfigOpt === 'object' ? buildConfigOpt : {}
    plugins.push(buildConfig({ frontendRoute, ...buildOpts }))
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

  if (frontendRoute) {
    plugins.push({
      name: 'frappeui-define-frontend-route',
      config() {
        return {
          define: {
            __FRONTEND_ROUTE__: JSON.stringify(frontendRoute),
          },
        }
      },
    })
  }

  return plugins
}

export default frappeuiPlugin

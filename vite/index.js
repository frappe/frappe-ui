import { lucideIcons } from './lucideIcons.js'
import { frappeProxy } from './frappeProxy.js'
import { frappeTypes } from './frappeTypes.js'
import { jinjaBootData } from './jinjaBootData.js'
import { buildConfig } from './buildConfig.js'
import { siteBanner } from './siteBanner.js'
import { barrelImports } from './barrelImports.js'

function frappeuiPlugin(options = {}) {
  let plugins = []
  const frontendRoute = options.frontendRoute

  const lucideIconsOpt = options.lucideIcons ?? true
  const barrelImportsOpt = options.barrelImports ?? true

  if (barrelImportsOpt) {
    // Keep `import { Button } from 'frappe-ui'` in source, but resolve it to
    // the declaring module so dev never has to serve the whole barrel.
    plugins.push(
      barrelImports(typeof barrelImportsOpt === 'object' ? barrelImportsOpt : {}),
    )
  }
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

  plugins.push({
    name: 'frappeui-optimize-deps',
    config() {
      return {
        optimizeDeps: {
          include: [
            // Every entry here must be a frappe-ui dependency. A name that no
            // installed package resolves makes Vite log "Failed to resolve
            // dependency ... present in 'optimizeDeps.include'" on each dev
            // start of every consuming app.
            'highlight.js/lib/core',
            // Deps behind the imperative `toast()` / `dialog.*` surfaces.
            //
            // Both are backed by module-level state — the `dialogs` ref in
            // src/utils/dialog.ts and vue-sonner's ToastState — which a full
            // page reload wipes. So when one of these is discovered late (the
            // dep optimizer only crawls what the scanner reached, and it misses
            // dynamic imports inside template expressions among other things),
            // Vite logs "optimized dependencies changed. reloading" and the
            // toast or dialog the user just triggered never paints. It works on
            // the next click, which is what makes it read as flaky.
            //
            // Pre-declaring them keeps that discovery at server start. The cost
            // is an esbuild pre-bundle the browser only downloads if something
            // actually imports it, and every frappe-ui app pulls these anyway.
            'reka-ui',
            'vue-sonner',
            'dompurify',
          ],
        },
      }
    },
  })

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
export { lucideIcons } from './lucideIcons.js'
export { lucideIconsPlugin } from './lucideIconsPlugin.js'
export { barrelImports } from './barrelImports.js'

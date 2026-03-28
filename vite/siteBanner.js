import { findAppName, getInstalledAppSites } from './utils.js'

export function siteBanner({ frontendRoute } = {}) {
  if (!frontendRoute) return null

  let hasPrintedBanner = false

  return {
    name: 'frappeui-site-banner-plugin',
    configureServer(server) {
      server.httpServer?.once('listening', async () => {
        if (hasPrintedBanner) return
        hasPrintedBanner = true

        const appName = findAppName()
        if (!appName) return

        try {
          const sites = await getInstalledAppSites(appName)
          if (!sites.length) return

          const resolvedPort = server.resolvedUrls?.local[0]
            ? Number(new URL(server.resolvedUrls.local[0]).port)
            : server.config.server.port

          const boldAppName = `\u001b[1m${appName}\u001b[22m`
          console.log('')
          console.log(`${boldAppName} sites:`)
          for (const site of sites) {
            console.log(`http://${site}:${resolvedPort}${frontendRoute}`)
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.warn(
            `Failed to list installed sites for ${appName}: ${message}`,
          )
        }
      })
    },
  }
}

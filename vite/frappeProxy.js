import { getCommonSiteConfig } from './utils.js'

export function frappeProxy({
  port,
  source = '^/(app|login|api|assets|files|private)',
} = {}) {
  const commonSiteConfig = getCommonSiteConfig()
  const env_web_server_port = process.env.FRAPPE_WEB_SERVER_PORT
  const webserver_port =
    env_web_server_port ||
    (commonSiteConfig ? commonSiteConfig.webserver_port : 8000)

  // Calculate Vite dev server port based on webserver port
  // If webserver_port is 8000, vite port is 8080
  // If webserver_port is 8001, vite port is 8081, and so on
  if (!port) {
    const baseWebServerPort = 8000
    const baseVitePort = 8080
    const portOffset = webserver_port - baseWebServerPort
    port = baseVitePort + portOffset
  }

  if (env_web_server_port) {
    console.log(
      `Using web server port from environment: ${env_web_server_port}`,
    )
  }

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
    name: 'frappeui-proxy-plugin',
    config: () => ({
      server: {
        port: port,
        proxy: proxy,
      },
    }),
  }
}

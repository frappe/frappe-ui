const { getCommonSiteConfig } = require('./utils')

function frappeProxy({
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
    name: 'frappeui-proxy-plugin',
    config: () => ({
      server: {
        port: port,
        proxy: proxy,
      },
    }),
  }
}

exports.frappeProxy = frappeProxy

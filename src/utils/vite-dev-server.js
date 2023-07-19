module.exports = {
  getProxyOptions({ port }) {
    return {
      '^/(app|login|api|assets|files)': {
        target: `http://127.0.0.1:${port}`,
        ws: true,
        router: function (req) {
          const site_name = req.headers.host.split(':')[0]
          return `http://${site_name}:${port}`
        },
      },
    }
  },
}

// The playground's upload store, for the dev server: the editor only takes
// an http(s) `file_url` back from an upload (url-safety.ts), so a file is
// posted here and served back from memory. Nothing is kept across restarts.
//
//   POST /__uploads            the file as the body, its type in
//                              content-type and its name, URI-encoded, in
//                              x-file-name → { file_url, file_name }
//   GET  /__uploads/<id>       the file
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const ROUTE = '/__uploads'

type Stored = { type: string; name: string; data: Buffer }

export function playgroundUploads(): Plugin {
  const files = new Map<string, Stored>()
  return {
    name: 'playground-uploads',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!serveUpload(files, req, res)) next()
      })
    },
  }
}

/** handles an upload route, or returns false for anything else */
export function serveUpload(
  files: Map<string, Stored>,
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  const url = (req.url ?? '').split('?')[0]
  if (req.method === 'POST' && url === ROUTE) {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
      const raw = req.headers['x-file-name']
      const name = decodeURIComponent(
        (Array.isArray(raw) ? raw[0] : raw) || 'file',
      )
      files.set(id, {
        type: req.headers['content-type'] || 'application/octet-stream',
        name,
        data: Buffer.concat(chunks),
      })
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ file_url: `${ROUTE}/${id}`, file_name: name }))
    })
    return true
  }
  if (req.method === 'GET' && url.startsWith(`${ROUTE}/`)) {
    const file = files.get(url.slice(ROUTE.length + 1))
    if (!file) {
      res.statusCode = 404
      res.end('not found')
      return true
    }
    res.setHeader('content-type', file.type)
    res.setHeader('content-length', file.data.length)
    res.setHeader('cache-control', 'no-store')
    res.end(file.data)
    return true
  }
  return false
}

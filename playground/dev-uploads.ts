// The playground's upload store, for the dev server: the editor only takes
// an http(s) `file_url` back from an upload (url-safety.ts), so a file is
// posted here and served back from memory. Nothing is kept across restarts.
//
//   POST /__uploads            the file as the body, its type in
//                              content-type and its name, URI-encoded, in
//                              x-file-name → { file_url, file_name }
//   GET  /__uploads            what has been uploaded, newest first:
//                              [{ file_url, file_name, type }]
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

/** the store's files, newest first, as the library tab lists them */
export function listUploads(
  files: Map<string, Pick<Stored, 'type' | 'name'>>,
): Array<{ file_url: string; file_name: string; type: string }> {
  return Array.from(files, ([id, file]) => ({
    file_url: `${ROUTE}/${id}`,
    file_name: file.name,
    type: file.type,
  })).reverse()
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
  if (req.method === 'GET' && url === ROUTE) {
    res.setHeader('content-type', 'application/json')
    res.setHeader('cache-control', 'no-store')
    res.end(JSON.stringify(listUploads(files)))
    return true
  }
  if (
    (req.method === 'GET' || req.method === 'HEAD') &&
    url.startsWith(`${ROUTE}/`)
  ) {
    const file = files.get(url.slice(ROUTE.length + 1))
    if (!file) {
      res.statusCode = 404
      res.end('not found')
      return true
    }
    res.setHeader('content-type', file.type)
    res.setHeader('cache-control', 'no-store')
    // A video is seekable only as far as the browser can ask for bytes by
    // range: without 206 answers it may play only what has buffered, and
    // the playhead cannot be dragged past that.
    res.setHeader('accept-ranges', 'bytes')
    const range = byteRange(req.headers.range, file.data.length)
    if (range === 'invalid') {
      res.statusCode = 416
      res.setHeader('content-range', `bytes */${file.data.length}`)
      res.end()
      return true
    }
    let body = file.data
    if (range) {
      const [start, end] = range
      res.statusCode = 206
      res.setHeader(
        'content-range',
        `bytes ${start}-${end}/${file.data.length}`,
      )
      body = file.data.subarray(start, end + 1)
    }
    res.setHeader('content-length', body.length)
    res.end(req.method === 'HEAD' ? undefined : body)
    return true
  }
  return false
}

/**
 * The bytes a `Range` header asks for, inclusive: none when there is no
 * (usable) header, 'invalid' when it points past the file.
 */
export function byteRange(
  header: string | undefined,
  size: number,
): [number, number] | 'invalid' | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header?.trim() ?? '')
  if (!match || (match[1] === '' && match[2] === '')) return null
  if (size === 0) return 'invalid'
  // a suffix range: the last N bytes
  if (match[1] === '') {
    const count = Math.min(Number(match[2]), size)
    return count === 0 ? 'invalid' : [size - count, size - 1]
  }
  const start = Number(match[1])
  if (start >= size) return 'invalid'
  const end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1)
  if (end < start) return 'invalid'
  return [start, end]
}

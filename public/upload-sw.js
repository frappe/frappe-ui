// The playground's upload store where there is no dev server to post to —
// the static build (Vercel, the preview server). It answers the same routes
// as playground/dev-uploads.ts, keeping the files in this browser's Cache
// Storage, so an upload comes back as a same-origin http(s) URL the editor
// takes (url-safety.ts turns away blob: and data: URLs). Nothing else is
// touched: every other request goes to the network as it would anyway.
//
//   POST /__uploads            the file as the body → { file_url, file_name }
//   GET  /__uploads            what has been uploaded, newest first
//   GET  /__uploads/<id>       the file

const ROUTE = '/__uploads'
const STORE = 'playground-uploads'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname === ROUTE) {
    if (e.request.method === 'POST') e.respondWith(store(e.request))
    else if (e.request.method === 'GET') e.respondWith(list())
    return
  }
  if (url.pathname.startsWith(`${ROUTE}/`) && e.request.method === 'GET')
    e.respondWith(serve(url.pathname))
})

const json = (body) =>
  new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  })

async function store(request) {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  const type = request.headers.get('content-type') || 'application/octet-stream'
  const name = decodeURIComponent(request.headers.get('x-file-name') || 'file')
  const body = await request.blob()
  const cache = await caches.open(STORE)
  await cache.put(
    `${ROUTE}/${id}`,
    new Response(body, {
      headers: {
        'content-type': type,
        'content-length': String(body.size),
        'x-file-name': encodeURIComponent(name),
      },
    }),
  )
  return json({ file_url: `${ROUTE}/${id}`, file_name: name })
}

async function list() {
  const cache = await caches.open(STORE)
  const rows = []
  for (const req of await cache.keys()) {
    const res = await cache.match(req)
    if (!res) continue
    rows.push({
      file_url: new URL(req.url).pathname,
      file_name: decodeURIComponent(res.headers.get('x-file-name') || 'file'),
      type: res.headers.get('content-type') || 'application/octet-stream',
    })
  }
  return json(rows.reverse())
}

async function serve(path) {
  const cache = await caches.open(STORE)
  return (await cache.match(path)) || new Response('Not found', { status: 404 })
}

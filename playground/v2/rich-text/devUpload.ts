import type { UploadFunction } from '../../../src/molecules/editor'

// an upload goes to the playground's store and comes back as an http URL —
// the editor takes no other kind (a blob: URL is turned away by
// url-safety.ts) — with its progress and cancel wired. On the dev server
// the store is the server's (playground/dev-uploads.ts); in the static
// build there is no server, so public/upload-sw.js answers the same routes
// from this browser's own storage.

let ready: Promise<void> | null = null

/** resolves once something answers /__uploads */
export function uploadsReady(): Promise<void> {
  if (import.meta.env.DEV || !('serviceWorker' in navigator))
    return Promise.resolve()
  ready ??= navigator.serviceWorker
    .register('/upload-sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(
      () =>
        // the worker claims the page as it starts; until it has, a request
        // would go past it to the host
        navigator.serviceWorker.controller ??
        new Promise<void>((resolve) =>
          navigator.serviceWorker.addEventListener(
            'controllerchange',
            () => resolve(),
            { once: true },
          ),
        ),
    )
    .then(() => undefined)
  return ready
}

// the static build's worker is started with the page, so it is in place
// before the first upload
if (!import.meta.env.DEV) void uploadsReady().catch(() => {})

export const uploadFunction: UploadFunction = (file, options) =>
  uploadsReady().then(
    () =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/__uploads')
        xhr.setRequestHeader(
          'content-type',
          file.type || 'application/octet-stream',
        )
        xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name))
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            options?.onProgress?.({
              loaded: e.loaded,
              total: e.total,
              percent: Math.round((e.loaded / e.total) * 100),
            })
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300)
            resolve(JSON.parse(xhr.responseText))
          else reject(new Error(`Upload failed (${xhr.status})`))
        }
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.onabort = () =>
          reject(new DOMException('Upload cancelled', 'AbortError'))
        options?.signal?.addEventListener('abort', () => xhr.abort())
        xhr.send(file)
      }),
  )

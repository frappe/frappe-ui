import type { UploadFunction } from '../../../src/molecules/editor'

// an upload goes to the dev server's store (playground/dev-uploads.ts) and
// comes back as an http URL — the editor takes no other kind (a blob: URL
// is turned away by url-safety.ts) — with its progress and cancel wired
export const uploadFunction: UploadFunction = (file, options) =>
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
  })

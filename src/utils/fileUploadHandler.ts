import {
  getMaxFileSize,
  getFileChunkSize,
  formatBytes,
  fileSizeLimitMessage,
} from './fileSize'

export interface UploadOptions {
  private?: boolean
  folder?: string
  file_url?: string
  doctype?: string
  docname?: string
  fieldname?: string
  method?: string
  type?: string
  upload_endpoint?: string
  optimize?: boolean
  max_width?: number
  max_height?: number
  params?: object
  signal?: AbortSignal
  onProgress?: (progress: {
    loaded: number
    total: number
    percent: number
  }) => void
}

/**
 * Resolves whether an upload is private. Unset resolves to **private** — a
 * file with no stated intent is treated as access-controlled, not
 * world-readable. Pass `private: false` for intentionally public files.
 *
 * Internal: not exported from the package.
 */
export function isPrivateUpload(options: UploadOptions = {}) {
  return options.private ?? true
}

/** What made an upload fail. */
export type UploadErrorKind = 'file-size' | 'network' | 'server' | 'abort'

/**
 * The error every upload path rejects with: `upload()`, `useFileUpload()`,
 * and `FileUploadHandler.upload()`. Read `kind` to tell a cancelled upload
 * from a failed one; `messages` carries the server's messages when it sent
 * any.
 */
export class UploadError extends Error {
  /** What made the upload fail. */
  readonly kind: UploadErrorKind

  /** HTTP status, when the server answered. */
  readonly status?: number

  /** Server messages, in the order the server sent them. Empty otherwise. */
  readonly messages: string[]

  /** The parsed error payload, when the server sent one. */
  readonly response?: unknown

  constructor(
    message: string,
    options: {
      kind: UploadErrorKind
      status?: number
      messages?: string[]
      response?: unknown
    },
  ) {
    super(message)
    this.name = 'UploadError'
    this.kind = options.kind
    this.status = options.status
    this.messages = options.messages ?? []
    this.response = options.response
  }
}

type EventListenerOption = 'start' | 'progress' | 'finish' | 'error'

declare global {
  interface Window {
    csrf_token?: string
  }
}

/** One request of an upload: the whole file, or one slice of it. */
interface Chunk {
  blob: Blob | null
  index: number
  count: number
  offset: number
}

/** The part of a Frappe error response this module reads. */
interface ServerError {
  message?: string
  exc?: string
  exc_type?: string
  _server_messages?: string
  _error_message?: string
}

function parseServerMessages(error: ServerError): string[] {
  if (!error._server_messages) return []
  try {
    return JSON.parse(error._server_messages)
      .map((message: string) => {
        try {
          return JSON.parse(message).message
        } catch {
          return message
        }
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

function extractUploadErrorMessage(error: ServerError): string {
  const messages = parseServerMessages(error)
  if (messages.length) return messages.join('\n')
  if (error.message) return error.message
  if (error._error_message) return error._error_message
  if (error.exc_type === 'MaxFileSizeReachedError') {
    const maxFileSize = getMaxFileSize()
    return maxFileSize
      ? `File size exceeded the maximum allowed size of ${formatBytes(maxFileSize)}.`
      : 'File size exceeds the maximum allowed limit.'
  }
  return 'Upload failed'
}

function serverError(status: number, responseText: string): UploadError {
  // A 413 comes from a proxy in front of Frappe (nginx's
  // `client_max_body_size`), not from Frappe, so its limit is unknown here.
  // Frappe's own size check answers 417 with `MaxFileSizeReachedError`.
  if (status === 413) {
    return new UploadError(
      'The server rejected this upload because it is too large.',
      { kind: 'server', status },
    )
  }
  let error: ServerError = {}
  try {
    error = JSON.parse(responseText)
  } catch {
    // not JSON
  }
  if (error.exc) {
    try {
      console.error(JSON.parse(error.exc)[0])
    } catch {
      // pass
    }
  }
  return new UploadError(extractUploadErrorMessage(error), {
    kind: 'server',
    status,
    messages: parseServerMessages(error),
    response: error,
  })
}

/** Split `file` into the requests that upload it, in order. */
function chunksOf(file: File | null): Chunk[] {
  const chunkSize = getFileChunkSize()
  if (!file || file.size <= chunkSize) {
    return [{ blob: file, index: 0, count: 1, offset: 0 }]
  }
  const count = Math.ceil(file.size / chunkSize)
  return Array.from({ length: count }, (_, index) => {
    const offset = index * chunkSize
    return {
      blob: file.slice(offset, offset + chunkSize),
      index,
      count,
      offset,
    }
  })
}

function formDataFor(
  file: File | null,
  chunk: Chunk,
  options: UploadOptions,
): FormData {
  const formData = new FormData()
  if (file && chunk.blob) {
    // Every chunk carries the original filename: Frappe appends chunks to
    // a temp file named after it.
    formData.append('file', chunk.blob, file.name)
  }
  if (file && chunk.count > 1) {
    formData.append('chunk_index', String(chunk.index))
    formData.append('total_chunk_count', String(chunk.count))
    formData.append('chunk_byte_offset', String(chunk.offset))
    formData.append('total_file_size', String(file.size))
  }
  formData.append('is_private', isPrivateUpload(options) ? '1' : '0')
  formData.append('folder', options.folder || 'Home')

  const fields = {
    file_url: options.file_url,
    doctype: options.doctype,
    docname: options.docname,
    fieldname: options.fieldname,
    method: options.method,
    type: options.type,
  }
  for (const [key, value] of Object.entries(fields)) {
    if (value) formData.append(key, value)
  }

  if (options.optimize) {
    formData.append('optimize', '1')
    if (options.max_width) {
      formData.append('max_width', options.max_width.toString())
    }
    if (options.max_height) {
      formData.append('max_height', options.max_height.toString())
    }
  }
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      formData.append(key, value)
    }
  }
  return formData
}

/**
 * Uploads a file to Frappe's `upload_file` endpoint. A file larger than the
 * `fileChunkSize` config is sent as a series of chunk requests, one after
 * another, so that no single request exceeds a proxy's body size limit.
 * `start` and `finish` fire once per upload and `progress` covers the
 * whole file.
 */
class FileUploadHandler {
  listeners: { [event: string]: Function[] }
  failed: boolean

  constructor() {
    this.listeners = {}
    this.failed = false
  }

  on(event: EventListenerOption, handler: Function) {
    this.listeners[event] = this.listeners[event] || []
    this.listeners[event].push(handler)
  }

  trigger(event: string, data?: unknown) {
    let handlers = this.listeners[event] || []
    handlers.forEach((handler) => {
      handler.call(this, data)
    })
  }

  async upload(file: File | null, options: UploadOptions): Promise<any> {
    const limitMessage = fileSizeLimitMessage(file)
    if (limitMessage) {
      throw new UploadError(limitMessage, { kind: 'file-size' })
    }

    this.trigger('start')
    try {
      let result: unknown
      for (const chunk of chunksOf(file)) {
        if (options.signal?.aborted) {
          throw new UploadError('Upload cancelled', { kind: 'abort' })
        }
        result = await this.send(file, chunk, options)
      }
      this.trigger('finish')
      return result
    } catch (error) {
      this.failed = true
      const response = error instanceof UploadError ? error.response : undefined
      this.trigger('error', response)
      throw error
    }
  }

  private send(
    file: File | null,
    chunk: Chunk,
    options: UploadOptions,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const abort = () => xhr.abort()
      options.signal?.addEventListener('abort', abort, { once: true })
      const settle = () => options.signal?.removeEventListener('abort', abort)

      xhr.upload.addEventListener('progress', (e) => {
        if (!e.lengthComputable) return
        // e.loaded counts multipart overhead too, so scale it to the
        // chunk's bytes. That keeps progress steady across chunk borders.
        const loaded = chunk.blob
          ? chunk.offset + chunk.blob.size * (e.loaded / e.total)
          : e.loaded
        const total = file ? file.size : e.total
        this.trigger('progress', { uploaded: loaded, total })
        options.onProgress?.({
          loaded,
          total,
          percent: Math.round((loaded / total) * 100),
        })
      })

      xhr.addEventListener('error', () => {
        settle()
        reject(new UploadError('Upload failed', { kind: 'network' }))
      })
      xhr.addEventListener('abort', () => {
        settle()
        reject(new UploadError('Upload cancelled', { kind: 'abort' }))
      })

      xhr.onreadystatechange = () => {
        // Status 0 means no response: the `error` or `abort` listener
        // above settles the promise.
        if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status === 0) {
          return
        }
        settle()
        if (xhr.status !== 200) {
          reject(serverError(xhr.status, xhr.responseText))
          return
        }
        let r
        try {
          r = JSON.parse(xhr.responseText)
        } catch {
          r = xhr.responseText
        }
        resolve(r?.message || r)
      }

      xhr.open('POST', options.upload_endpoint || '/api/method/upload_file')
      xhr.setRequestHeader('Accept', 'application/json')
      if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
        xhr.setRequestHeader('X-Frappe-CSRF-Token', window.csrf_token)
      }
      xhr.send(formDataFor(file, chunk, options))
    })
  }
}

export default FileUploadHandler

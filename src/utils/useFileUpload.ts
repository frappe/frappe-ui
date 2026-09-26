import { reactive, computed } from 'vue'
import { getMaxFileSize, formatBytes, fileSizeLimitMessage } from './fileSize'

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
 * Internal: shared with `FileUploadHandler`, not exported from the package.
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

export interface UploadState {
  uploading: boolean
  progress: number
  uploaded: number
  total: number
  error: UploadError | null
  result: UploadedFile | null
}

export type UploadedFile = {
  file_name: string
  file_size: number
  file_url: string
  name?: string
  owner?: string
  creation?: string
  modified?: string
  modified_by?: string
  is_private?: 0 | 1
  file_type?: string
  folder?: string
  is_folder?: 0 | 1
  content_hash?: string
}

function parseServerMessages(error: any): string[] {
  if (!error?._server_messages) return []
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

function extractUploadErrorMessage(error: any): string {
  const messages = parseServerMessages(error)
  if (messages.length) return messages.join('\n')
  if (error?._error_message) return error._error_message
  if (error?.message) return error.message
  if (error?.exc_type === 'MaxFileSizeReachedError') {
    const maxFileSize = getMaxFileSize()
    return maxFileSize
      ? `File size exceeded the maximum allowed size of ${formatBytes(maxFileSize)}.`
      : 'File size exceeds the maximum allowed limit.'
  }
  return 'Upload failed'
}

function createUploadState(): UploadState {
  return {
    uploading: false,
    progress: 0,
    uploaded: 0,
    total: 0,
    error: null,
    result: null,
  }
}

export function useFileUpload() {
  const state = reactive<UploadState>(createUploadState())

  // Function to reset the state
  const reset = () => Object.assign(state, createUploadState())

  // Computed values for convenience
  const isUploading = computed(() => state.uploading)
  const progress = computed(() => state.progress)
  const error = computed(() => state.error)
  const result = computed(() => state.result)

  return {
    upload: (file: File, options: UploadOptions = {}) =>
      uploadWithState(file, options, state, reset),
    reset,
    state,
    isUploading,
    progress,
    error,
    result,
  }
}

/**
 * Uploads a file to Frappe's upload endpoint. Standalone — no reactive state
 * required; call this directly when you only need the promise (e.g.
 * `onProgress` in `options` covers progress). `useFileUpload()` wraps the
 * same request with a reactive `state` object for components that want
 * progress/error tracking without threading a promise through their own
 * refs.
 */
export function upload(
  file: File | null,
  options: UploadOptions = {},
): Promise<UploadedFile> {
  return uploadWithState(file, options)
}

async function uploadWithState(
  file: File | null,
  options: UploadOptions = {},
  state: UploadState = createUploadState(),
  reset: () => void = () => Object.assign(state, createUploadState()),
): Promise<UploadedFile> {
  reset()
  const limitMessage = fileSizeLimitMessage(file)
  if (limitMessage) {
    state.error = new UploadError(limitMessage, { kind: 'file-size' })
    return Promise.reject(state.error)
  }
  state.uploading = true

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Set up event listeners
    xhr.upload.addEventListener('loadstart', () => {
      state.uploading = true
      state.error = null
    })

    const abort = () => {
      xhr.abort()
    }

    options.signal?.addEventListener('abort', abort, { once: true })

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        state.uploaded = e.loaded
        state.total = e.total
        state.progress = Math.round((e.loaded / e.total) * 100)
        options.onProgress?.({
          loaded: e.loaded,
          total: e.total,
          percent: state.progress,
        })
      }
    })

    xhr.upload.addEventListener('load', () => {
      state.progress = 100
    })

    xhr.addEventListener('error', () => {
      state.uploading = false
      state.error = new UploadError('Upload failed', { kind: 'network' })
      options.signal?.removeEventListener('abort', abort)
      reject(state.error)
    })

    xhr.addEventListener('abort', () => {
      state.uploading = false
      state.error = new UploadError('Upload cancelled', { kind: 'abort' })
      options.signal?.removeEventListener('abort', abort)
      reject(state.error)
    })

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        options.signal?.removeEventListener('abort', abort)
        let error
        if (xhr.status === 200) {
          let r = null
          try {
            r = JSON.parse(xhr.responseText)
          } catch (e) {
            r = xhr.responseText
          }

          const result = (r.message || r) as UploadedFile
          state.result = result
          resolve(result)
        } else if (xhr.status === 403) {
          error = JSON.parse(xhr.responseText)
        } else {
          try {
            error = JSON.parse(xhr.responseText)
          } catch (e) {
            error = 'Upload failed'
          }
        }

        if (error) {
          let exception
          if (error.exc) {
            exception = error.exc
            try {
              exception = JSON.parse(exception)[0]
              console.log(exception)
              // eslint-disable-next-line no-empty
            } catch (e) {}
          }
          let e = new UploadError(extractUploadErrorMessage(error), {
            kind: 'server',
            status: xhr.status,
            messages: parseServerMessages(error),
            response: error,
          })
          state.error = e
          reject(e)
        }

        state.uploading = false
      }
    }

    const uploadEndpoint = options.upload_endpoint || '/api/method/upload_file'
    xhr.open('POST', uploadEndpoint, true)
    xhr.setRequestHeader('Accept', 'application/json')

    if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
      xhr.setRequestHeader('X-Frappe-CSRF-Token', window.csrf_token)
    }

    const formData = new FormData()
    if (file) {
      formData.append('file', file, file.name)
    }

    formData.append('is_private', isPrivateUpload(options) ? '1' : '0')
    formData.append('folder', options.folder || 'Home')

    if (options.file_url) {
      formData.append('file_url', options.file_url)
    }

    if (options.doctype) {
      formData.append('doctype', options.doctype)
    }

    if (options.docname) {
      formData.append('docname', options.docname)
    }

    if (options.fieldname) {
      formData.append('fieldname', options.fieldname)
    }

    if (options.method) {
      formData.append('method', options.method)
    }

    if (options.type) {
      formData.append('type', options.type)
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
      for (let [k, v] of Object.entries(options.params)) {
        formData.append(k, v)
      }
    }

    xhr.send(formData)
  })
}

// Add the Window interface for typescript
declare global {
  interface Window {
    csrf_token?: string
  }
}

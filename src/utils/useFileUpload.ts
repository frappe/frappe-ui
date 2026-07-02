import { reactive, computed } from 'vue'
import {
  getMaxFileSize,
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
  chunk_size?: number
  signal?: AbortSignal
  onProgress?: (progress: {
    loaded: number
    total: number
    percent: number
  }) => void
}

export interface UploadState {
  uploading: boolean
  progress: number
  uploaded: number
  total: number
  error: any | null
  result: UploadedFile | null
}

export interface UploadedFile {
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

export function useFileUpload() {
  const state = reactive<UploadState>({
    uploading: false,
    progress: 0,
    uploaded: 0,
    total: 0,
    error: null,
    result: null,
  })

  // Function to reset the state
  const reset = () => {
    state.uploading = false
    state.progress = 0
    state.uploaded = 0
    state.total = 0
    state.error = null
    state.result = null
  }

  // Computed values for convenience
  const isUploading = computed(() => state.uploading)
  const progress = computed(() => state.progress)
  const error = computed(() => state.error)
  const result = computed(() => state.result)

  return {
    upload: (file: File, options: UploadOptions = {}) =>
      upload(file, options, state, reset),
    reset,
    state,
    isUploading,
    progress,
    error,
    result,
  }
}

async function upload(
  file: File | null,
  options: UploadOptions = {},
  state: UploadState,
  reset: () => void,
): Promise<UploadedFile> {
  reset()
  const limitMessage = fileSizeLimitMessage(file)
  if (limitMessage) {
    state.error = new Error(limitMessage)
    return Promise.reject(state.error)
  }
  state.uploading = true

  if (options.chunk_size && file && file.size > options.chunk_size) {
    return uploadInChunks(file, options, state)
  }

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

    xhr.addEventListener('error', (error) => {
      state.uploading = false
      state.error = 'Upload failed'
      options.signal?.removeEventListener('abort', abort)
      reject('Upload failed')
    })

    xhr.addEventListener('abort', () => {
      state.uploading = false
      state.error = 'Upload cancelled'
      options.signal?.removeEventListener('abort', abort)
      reject(new DOMException('Upload cancelled', 'AbortError'))
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
          let e = new Error(extractUploadErrorMessage(error))
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

    formData.append('is_private', options.private ? '1' : '0')
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

function uploadInChunks(
  file: File,
  options: UploadOptions,
  state: UploadState,
): Promise<UploadedFile> {
  const chunkSize = options.chunk_size!
  const totalChunks = Math.ceil(file.size / chunkSize)
  const uploadEndpoint = options.upload_endpoint || '/api/method/upload_file'

  const buildFormData = (chunk: Blob, chunkIndex: number, chunkByteOffset: number) => {
    const formData = new FormData()
    formData.append('file', chunk, file.name)
    formData.append('is_private', options.private ? '1' : '0')
    formData.append('folder', options.folder || 'Home')
    formData.append('total_file_size', String(file.size))
    formData.append('chunk_index', String(chunkIndex))
    formData.append('total_chunk_count', String(totalChunks))
    formData.append('chunk_byte_offset', String(chunkByteOffset))
    if (options.file_url) { formData.append('file_url', options.file_url) }
    if (options.doctype) { formData.append('doctype', options.doctype) }
    if (options.docname) { formData.append('docname', options.docname) }
    if (options.fieldname) { formData.append('fieldname', options.fieldname) }
    if (options.method) { formData.append('method', options.method) }
    if (options.type) { formData.append('type', options.type) }
    if (options.optimize) {
      formData.append('optimize', '1')
      if (options.max_width) { formData.append('max_width', options.max_width.toString()) }
      if (options.max_height) { formData.append('max_height', options.max_height.toString()) }
    }
    if (options.params) {
      for (let [k, v] of Object.entries(options.params)) {
        formData.append(k, v)
      }
    }
    return formData
  }

  const sendChunk = (chunkIndex: number, chunkByteOffset: number): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      if (options.signal?.aborted) {
        reject(new DOMException('Upload cancelled', 'AbortError'))
        return
      }
      const xhr = new XMLHttpRequest()
      const abort = () => xhr.abort()
      options.signal?.addEventListener('abort', abort, { once: true })

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          state.uploaded = chunkByteOffset + e.loaded
          state.total = file.size
          state.progress = Math.round((state.uploaded / state.total) * 100)
          options.onProgress?.({ loaded: state.uploaded, total: state.total, percent: state.progress })
        }
      })

      xhr.addEventListener('abort', () => {
        state.uploading = false
        state.error = 'Upload cancelled'
        options.signal?.removeEventListener('abort', abort)
        reject(new DOMException('Upload cancelled', 'AbortError'))
      })

      xhr.addEventListener('error', () => {
        state.uploading = false
        state.error = 'Upload failed'
        options.signal?.removeEventListener('abort', abort)
        reject('Upload failed')
      })

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return
        options.signal?.removeEventListener('abort', abort)
        if (xhr.status === 200) {
          if (chunkIndex === totalChunks - 1) {
            let r = null
            try { r = JSON.parse(xhr.responseText) } catch (e) { r = xhr.responseText }
            const result = (r.message || r) as UploadedFile
            state.result = result
            state.uploading = false
            resolve(result)
          } else {
            sendChunk(chunkIndex + 1, chunkByteOffset + chunkSize).then(resolve).catch(reject)
          }
        } else {
          let error: any
          try { error = JSON.parse(xhr.responseText) } catch (e) { error = 'Upload failed' }
          const e = new Error(extractUploadErrorMessage(error))
          state.error = e
          state.uploading = false
          reject(e)
        }
      }

      xhr.open('POST', uploadEndpoint, true)
      xhr.setRequestHeader('Accept', 'application/json')
      if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
        xhr.setRequestHeader('X-Frappe-CSRF-Token', window.csrf_token)
      }
      xhr.send(buildFormData(file.slice(chunkByteOffset, chunkByteOffset + chunkSize), chunkIndex, chunkByteOffset))
    })
  }

  return sendChunk(0, 0)
}

// Add the Window interface for typescript
declare global {
  interface Window {
    csrf_token?: string
  }
}

export { upload }

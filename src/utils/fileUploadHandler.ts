import { UploadOptions } from './useFileUpload'
import {
  getMaxFileSize,
  formatBytes,
  fileSizeLimitMessage,
} from './fileSize'

type EventListenerOption = 'start' | 'progress' | 'finish' | 'error'

declare global {
  interface Window {
    csrf_token?: string
  }
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
  if (error?.message) return error.message
  if (error?._error_message) return error._error_message
  if (error?.exc_type === 'MaxFileSizeReachedError') {
    const maxFileSize = getMaxFileSize()
    return maxFileSize
      ? `File size exceeded the maximum allowed size of ${formatBytes(maxFileSize)}.`
      : 'File size exceeds the maximum allowed limit.'
  }
  return 'Error Uploading File'
}

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

  trigger(event: string, data?: any) {
    let handlers = this.listeners[event] || []
    handlers.forEach((handler) => {
      handler.call(this, data)
    })
  }

  upload(file: File | null, options: UploadOptions): Promise<any> {
    const limitMessage = fileSizeLimitMessage(file)
    if (limitMessage) {
      this.trigger('error', new Error(limitMessage))
      return Promise.reject(new Error(limitMessage))
    }
    if (options.chunk_size && file && file.size > options.chunk_size) {
      return this._uploadInChunks(file, options)
    }
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('loadstart', () => {
        this.trigger('start')
      })
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          this.trigger('progress', {
            uploaded: e.loaded,
            total: e.total,
          })
        }
      })
      xhr.addEventListener('error', () => {
        this.trigger('error')
        reject()
      })
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            let r = null
            try {
              r = JSON.parse(xhr.responseText)
            } catch (e) {
              r = xhr.responseText
            }
            let out = r.message || r
            this.trigger('finish')
            resolve(out)
          } else {
            this.failed = true
            let error: {
              message?: string
              exc?: string
              _server_messages?: string
              httpStatus?: number
            } = {}

            if (xhr.status === 413 || xhr.status === 0) {
              error = {
                message:
                  getMaxFileSize() != null
                    ? `File size exceeded the maximum allowed size of ${formatBytes(getMaxFileSize() as number)}.`
                    : 'File size exceeds the maximum allowed limit',
                httpStatus: 413,
              }
            } else {
              try {
                error = JSON.parse(xhr.responseText)
              } catch (e) {
                // pass
              }
            }

            if (error && error.exc) {
              console.error(JSON.parse(error.exc)[0])
            }
            this.trigger('error', error)
            reject(new Error(extractUploadErrorMessage(error)))
          }
        }
      }

      const uploadEndpoint =
        options.upload_endpoint || '/api/method/upload_file'
      xhr.open('POST', uploadEndpoint, true)
      xhr.setRequestHeader('Accept', 'application/json')

      if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
        xhr.setRequestHeader('X-Frappe-CSRF-Token', window.csrf_token)
      }

      let form_data = new FormData()
      if (file) {
        form_data.append('file', file, file.name)
      }
      form_data.append('is_private', options.private || false ? '1' : '0')
      form_data.append('folder', options.folder || 'Home')

      if (options.file_url) {
        form_data.append('file_url', options.file_url)
      }

      if (options.doctype) {
        form_data.append('doctype', options.doctype)
      }

      if (options.docname) {
        form_data.append('docname', options.docname)
      }

      if (options.fieldname) {
        form_data.append('fieldname', options.fieldname)
      }

      if (options.method) {
        form_data.append('method', options.method)
      }

      if (options.type) {
        form_data.append('type', options.type)
      }

      if (options.optimize) {
        form_data.append('optimize', '1')
        if (options.max_width) {
          form_data.append('max_width', options.max_width.toString())
        }
        if (options.max_height) {
          form_data.append('max_height', options.max_height.toString())
        }
      }

      xhr.send(form_data)
    })
  }
  _uploadInChunks(file: File, options: UploadOptions): Promise<any> {
    const chunkSize = options.chunk_size!
    const totalChunks = Math.ceil(file.size / chunkSize)
    const uploadEndpoint = options.upload_endpoint || '/api/method/upload_file'

    const buildFormData = (chunk: Blob, chunkIndex: number, chunkByteOffset: number) => {
      let form_data = new FormData()
      form_data.append('file', chunk, file.name)
      form_data.append('is_private', options.private || false ? '1' : '0')
      form_data.append('folder', options.folder || 'Home')
      form_data.append('total_file_size', String(file.size))
      form_data.append('chunk_index', String(chunkIndex))
      form_data.append('total_chunk_count', String(totalChunks))
      form_data.append('chunk_byte_offset', String(chunkByteOffset))
      if (options.file_url) { form_data.append('file_url', options.file_url) }
      if (options.doctype) { form_data.append('doctype', options.doctype) }
      if (options.docname) { form_data.append('docname', options.docname) }
      if (options.fieldname) { form_data.append('fieldname', options.fieldname) }
      if (options.method) { form_data.append('method', options.method) }
      if (options.type) { form_data.append('type', options.type) }
      if (options.optimize) {
        form_data.append('optimize', '1')
        if (options.max_width) { form_data.append('max_width', options.max_width.toString()) }
        if (options.max_height) { form_data.append('max_height', options.max_height.toString()) }
      }
      return form_data
    }

    const sendChunk = (chunkIndex: number, chunkByteOffset: number): Promise<any> => {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('loadstart', () => {
          if (chunkIndex === 0) this.trigger('start')
        })
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            this.trigger('progress', {
              uploaded: chunkByteOffset + e.loaded,
              total: file.size,
            })
          }
        })
        xhr.addEventListener('error', () => {
          this.failed = true
          this.trigger('error')
          reject()
        })
        xhr.onreadystatechange = () => {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              if (chunkIndex === totalChunks - 1) {
                let r = null
                try {
                  r = JSON.parse(xhr.responseText)
                } catch (e) {
                  r = xhr.responseText
                }
                this.trigger('finish')
                resolve(r.message || r)
              } else {
                sendChunk(chunkIndex + 1, chunkByteOffset + chunkSize).then(resolve).catch(reject)
              }
            } else {
              this.failed = true
              let error: { message?: string; exc?: string; _server_messages?: string; httpStatus?: number } = {}
              if (xhr.status === 413 || xhr.status === 0) {
                error = {
                  message:
                    getMaxFileSize() != null
                      ? `File size exceeded the maximum allowed size of ${formatBytes(getMaxFileSize() as number)}.`
                      : 'File size exceeds the maximum allowed limit',
                  httpStatus: 413,
                }
              } else {
                try {
                  error = JSON.parse(xhr.responseText)
                } catch (e) {
                  // pass
                }
              }
              if (error && error.exc) {
                console.error(JSON.parse(error.exc)[0])
              }
              this.trigger('error', error)
              reject(new Error(extractUploadErrorMessage(error)))
            }
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
}

export default FileUploadHandler

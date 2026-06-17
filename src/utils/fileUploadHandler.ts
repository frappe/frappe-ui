import { UploadOptions } from "./useFileUpload"

type EventListenerOption = 'start' | 'progress' | 'finish' | 'error'

declare global {
  interface Window {
    csrf_token?: string
  }
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

  async upload(file: File | null, options: UploadOptions): Promise<any> {
    const chunkSize = options.chunk_size
    const useChunks = !!(file && chunkSize && file.size > chunkSize)
    const totalChunks = useChunks ? Math.ceil(file!.size / chunkSize!) : 1
    const fileSize = file?.size ?? 0

    this.trigger('start')

    const sendChunk = (chunkBlob: Blob | null, chunkIndex: number, chunkByteOffset: number): Promise<any> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            this.trigger('progress', {
              uploaded: chunkByteOffset + e.loaded,
              total: fileSize || e.total,
            })
          }
        })

        xhr.addEventListener('error', () => {
          this.failed = true
          this.trigger('error')
          reject()
        })

        xhr.onreadystatechange = () => {
          if (xhr.readyState !== XMLHttpRequest.DONE) return

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
              resolve(null)
            }
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
                message: 'File size exceeds the maximum allowed limit',
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
            reject(error)
          }
        }

        const uploadEndpoint = options.upload_endpoint || '/api/method/upload_file'
        xhr.open('POST', uploadEndpoint, true)
        xhr.setRequestHeader('Accept', 'application/json')

        if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
          xhr.setRequestHeader('X-Frappe-CSRF-Token', window.csrf_token)
        }

        const formData = new FormData()
        if (chunkBlob) {
          formData.append('file', chunkBlob, file!.name)
        }
        formData.append('is_private', options.private || false ? '1' : '0')
        formData.append('folder', options.folder || 'Home')
        formData.append('total_file_size', String(fileSize))

        if (useChunks) {
          formData.append('chunk_index', String(chunkIndex))
          formData.append('total_chunk_count', String(totalChunks))
          formData.append('chunk_byte_offset', String(chunkByteOffset))
        }

        if (options.file_url) formData.append('file_url', options.file_url)
        if (options.doctype) formData.append('doctype', options.doctype)
        if (options.docname) formData.append('docname', options.docname)
        if (options.fieldname) formData.append('fieldname', options.fieldname)
        if (options.method) formData.append('method', options.method)
        if (options.type) formData.append('type', options.type)
        if (options.optimize) {
          formData.append('optimize', '1')
          if (options.max_width) formData.append('max_width', options.max_width.toString())
          if (options.max_height) formData.append('max_height', options.max_height.toString())
        }

        xhr.send(formData)
      })
    }

    let chunkByteOffset = 0
    let result: any = null
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunkBlob = file
        ? file.slice(chunkByteOffset, chunkByteOffset + (chunkSize ?? fileSize))
        : null
      result = await sendChunk(chunkBlob, chunkIndex, chunkByteOffset)
      chunkByteOffset += chunkSize ?? fileSize
    }
    return result
  }
}

export default FileUploadHandler

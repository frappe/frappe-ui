import { upload, type UploadError, type UploadOptions } from './useFileUpload'

type EventListenerOption = 'start' | 'progress' | 'finish' | 'error'

/**
 * Event-style wrapper around `upload()`, which `FileUploader` is built on.
 * The request itself, chunking included, is `upload()`'s.
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

  trigger(event: string, data?: any) {
    let handlers = this.listeners[event] || []
    handlers.forEach((handler) => {
      handler.call(this, data)
    })
  }

  async upload(file: File | null, options: UploadOptions): Promise<any> {
    this.trigger('start')
    try {
      const result = await upload(file, {
        ...options,
        onProgress: (progress) => {
          options.onProgress?.(progress)
          this.trigger('progress', {
            uploaded: progress.loaded,
            total: progress.total,
          })
        },
      })
      this.trigger('finish')
      return result
    } catch (error) {
      this.failed = true
      const e = error as UploadError
      this.trigger(
        'error',
        e.response ?? { message: e.message, httpStatus: e.status },
      )
      throw error
    }
  }
}

export default FileUploadHandler

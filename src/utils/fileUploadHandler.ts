interface UploadOptions {
  private?: boolean
  folder?: string
  file_url?: string
  doctype?: string
  docname?: string
  fieldname?: string
  method?: string
  type?: string
  upload_endpoint?: string
}

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

  upload(file: File | null, options: UploadOptions): Promise<any> {
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
      xhr.upload.addEventListener('load', () => {
        this.trigger('finish')
      })
      xhr.addEventListener('error', () => {
        this.trigger('error')
        reject()
      })
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          let error
          if (xhr.status === 200) {
            let r = null
            try {
              r = JSON.parse(xhr.responseText)
            } catch (e) {
              r = xhr.responseText
            }
            let out = r.message || r
            resolve(out)
          } else if (xhr.status === 403) {
            error = JSON.parse(xhr.responseText)
          } else {
            this.failed = true
            try {
              error = JSON.parse(xhr.responseText)
            } catch (e) {
              // pass
            }
          }
          if (error && error.exc) {
            console.error(JSON.parse(error.exc)[0])
          }
          reject(error)
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

      xhr.send(form_data)
    })
  }
}

export default FileUploadHandler

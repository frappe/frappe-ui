import { ref, reactive } from 'vue'
import type { FrappeResponseError } from '../core/FrappeResponseError'
import { FrappeResponseError as FrappeResponseErrorClass } from '../core/FrappeResponseError'

export interface UploadFileOptions {
  /** The file or blob to upload. */
  file: File | Blob
  /** Doctype to attach the file to. */
  doctype?: string
  /** Document name to attach the file to. */
  name?: string
  /** Field name to attach the file to. */
  fieldname?: string
  /** Whether the file is private. Defaults to true. */
  isPrivate?: boolean
  /** Destination folder. Defaults to 'Home/Attachments'. */
  folder?: string
  /** Base URL for the upload endpoint. Defaults to ''. */
  baseUrl?: string
}

export interface UploadHandle {
  /** Start the upload. */
  call(): void
  /** Upload progress as a percentage (0–100). */
  progress: number
  /** The uploaded File document — available on success. */
  data: Record<string, any> | null
  /** Error on failure. */
  error: FrappeResponseError | null
  /** True while the upload is in progress. */
  loading: boolean
  /** Cancel the upload. */
  abort(): void
}

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export function uploadFile(options: UploadFileOptions): UploadHandle {
  const {
    file,
    doctype,
    name,
    fieldname,
    isPrivate = true,
    folder = 'Home/Attachments',
    baseUrl = '',
  } = options

  const progress = ref(0)
  const data = ref<Record<string, any> | null>(null)
  const error = ref<FrappeResponseError | null>(null)
  const loading = ref(false)

  let xhr: XMLHttpRequest | null = null

  function call(): void {
    if (loading.value) return

    loading.value = true
    progress.value = 0
    error.value = null
    data.value = null

    const formData = new FormData()
    formData.append('file', file, file instanceof File ? file.name : 'upload')
    if (doctype) formData.append('doctype', doctype)
    if (name) formData.append('docname', name)
    if (fieldname) formData.append('fieldname', fieldname)
    formData.append('is_private', isPrivate ? '1' : '0')
    formData.append('folder', folder)

    xhr = new XMLHttpRequest()
    xhr.open('POST', `${baseUrl}/api/v2/method/upload_file`, true)
    xhr.withCredentials = true
    xhr.setRequestHeader('X-Frappe-CSRF-Token', getCsrfToken())
    xhr.setRequestHeader('Accept', 'application/json')

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        progress.value = Math.round((event.loaded / event.total) * 100)
      }
    })

    xhr.addEventListener('load', () => {
      loading.value = false
      let json: any
      try {
        json = JSON.parse(xhr!.responseText)
      } catch {
        error.value = new FrappeResponseErrorClass({
          title: 'Parse Error',
          type: 'ParseError',
          messages: [
            { type: 'ParseError', message: 'Failed to parse server response' },
          ],
          httpStatus: xhr!.status,
        })
        return
      }
      if (xhr!.status >= 200 && xhr!.status < 300) {
        data.value = json?.data ?? json
        progress.value = 100
      } else {
        const errs = json?.errors ?? []
        error.value = new FrappeResponseErrorClass({
          title: errs[0]?.title ?? 'Upload Error',
          type: errs[0]?.type ?? 'UploadError',
          messages: errs.length
            ? errs.map((e: any) => ({
                type: e.type ?? 'Error',
                message: e.message ?? e.title ?? '',
              }))
            : [{ type: 'UploadError', message: `HTTP ${xhr!.status}` }],
          httpStatus: xhr!.status,
        })
      }
    })

    xhr.addEventListener('error', () => {
      loading.value = false
      error.value = new FrappeResponseErrorClass({
        title: 'Network Error',
        type: 'NetworkError',
        messages: [
          {
            type: 'NetworkError',
            message: 'Upload failed due to a network error',
          },
        ],
        httpStatus: 0,
      })
    })

    xhr.addEventListener('abort', () => {
      loading.value = false
      progress.value = 0
    })

    xhr.send(formData)
  }

  function abort(): void {
    xhr?.abort()
  }

  return reactive({
    call,
    progress,
    data,
    error,
    loading,
    abort,
  }) as unknown as UploadHandle
}

import { reactive, computed } from 'vue'
import FileUploadHandler, { UploadError } from './fileUploadHandler'
import type { UploadOptions } from './fileUploadHandler'

export {
  isPrivateUpload,
  UploadError,
  type UploadErrorKind,
  type UploadOptions,
} from './fileUploadHandler'

interface UploadProgress {
  uploaded: number
  total: number
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
  state.uploading = true

  const handler = new FileUploadHandler()
  handler.on('progress', ({ uploaded, total }: UploadProgress) => {
    state.uploaded = uploaded
    state.total = total
    state.progress = Math.round((uploaded / total) * 100)
  })

  try {
    const result = (await handler.upload(file, options)) as UploadedFile
    state.progress = 100
    state.result = result
    return result
  } catch (error) {
    state.error =
      error instanceof UploadError
        ? error
        : new UploadError('Upload failed', { kind: 'network' })
    throw state.error
  } finally {
    state.uploading = false
  }
}

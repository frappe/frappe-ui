import type { UploadOptions } from '../../utils/useFileUpload'

export type FileUploaderValidationResult =
  | string
  | Error
  | null
  | undefined
  | void

export interface FileUploaderProps {
  /** Accepted file types passed to the native file input. */
  fileTypes?: string | string[]

  /**
   * Additional upload options passed to Frappe's upload endpoint.
   * `private` / `is_private` override the component's `isPrivate` default.
   */
  uploadArgs?: UploadOptions

  /** Optional validation hook. Return a message or Error to block upload. */
  validateFile?: (
    file: File,
  ) => FileUploaderValidationResult | Promise<FileUploaderValidationResult>
}

export interface FileUploaderEmits {
  /** @deprecated Kept for compatibility through v1.x. */
  success: [data: any]
  /** @deprecated Kept for compatibility through v1.x. */
  failure: [error: any]
}

export interface FileUploaderSlotProps {
  file: File | null
  uploading: boolean
  progress: number
  uploaded: number
  total: number
  message: string
  error: unknown
  success: boolean
  openFileSelector: () => void
}

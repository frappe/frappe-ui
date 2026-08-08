import type { UploadedFile } from '../../utils/useFileUpload'

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
   * Whether the uploaded file is access-controlled. Defaults to `true` — an
   * upload with no stated intent is private, not world-readable. Pass
   * `false` only for intentionally public files.
   */
  private?: boolean

  /** Folder to upload into, on Frappe's file manager. Defaults to `Home`. */
  folder?: string

  /** Doctype to attach the uploaded file to. */
  doctype?: string

  /** Name of the document to attach the uploaded file to. */
  docname?: string

  /** Fieldname on the document the uploaded file belongs to. */
  fieldname?: string

  /** Endpoint the file is posted to. Defaults to `/api/method/upload_file`. */
  uploadEndpoint?: string

  /** Resize the image server-side before storing it. */
  optimize?: boolean

  /** Optional validation hook. Return a message or Error to block upload. */
  validateFile?: (
    file: File,
  ) => FileUploaderValidationResult | Promise<FileUploaderValidationResult>
}

export interface FileUploaderEmits {
  /** The file finished uploading. */
  success: [data: UploadedFile]
  /** The upload failed — validation or the request itself. */
  failure: [error: unknown]
}

export interface FileUploaderSlotProps {
  file: File | null
  uploading: boolean
  progress: number
  uploaded: number
  total: number
  message: string
  error: string | null
  success: boolean
  openFileSelector: () => void
}

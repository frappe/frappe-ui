/**
 * File-size helpers shared by every upload path (useFileUpload,
 * FileUploadHandler, and the editor's media upload engine / image-group
 * dialog). Single source of truth for the max-file-size lookup and the
 * user-facing size-limit message.
 *
 * Apps provide the limit explicitly via `setConfig('maxFileSize', bytes)`
 * (usually sourced from their boot data).
 */
import { getConfig } from './config'

/**
 * Max upload size in bytes, or null when unset. Reads the app-provided
 * `maxFileSize` config.
 */
export function getMaxFileSize(): number | null {
  const size = Number(getConfig('maxFileSize'))
  return Number.isFinite(size) && size > 0 ? size : null
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / 1024 / 1024
    return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`
  }
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

/** Human-readable size-limit violation message, or null when the file fits. */
export function fileSizeLimitMessage(file: File | null): string | null {
  if (!file) return null
  const maxFileSize = getMaxFileSize()
  if (!maxFileSize || file.size <= maxFileSize) return null
  return `This file is ${formatBytes(file.size)}; the limit is ${formatBytes(maxFileSize)}.`
}

/**
 * Message for a file the server refused as too large (HTTP 413). The limit
 * belongs to a proxy and is not known here, so the message gives the file's
 * size only.
 */
export function serverSizeLimitMessage(file: File | null): string {
  if (!file) return 'This file is more than the server accepts.'
  return `This file is ${formatBytes(file.size)}, which is more than the server accepts.`
}

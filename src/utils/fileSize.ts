/**
 * File-size helpers shared by every upload path (useFileUpload,
 * FileUploadHandler, and the editor's media upload engine / image-group
 * dialog). Single source of truth for the max-file-size lookup and the
 * user-facing size-limit message.
 *
 * Apps provide the limit explicitly via `setConfig('maxFileSize', bytes)`
 * (usually sourced from their boot data). The window/frappe.boot globals are
 * read only as a DEPRECATED fallback for apps that haven't migrated yet.
 */
import { getConfig } from './config'

declare global {
  interface Window {
    /** @deprecated Use `setConfig('maxFileSize', bytes)` instead. */
    max_file_size?: number | string
    /** @deprecated Use `setConfig('maxFileSize', bytes)` instead. */
    boot?: { max_file_size?: number | string }
    /** @deprecated Use `setConfig('maxFileSize', bytes)` instead. */
    frappe?: {
      boot?: {
        max_file_size?: number | string
        sysdefaults?: Record<string, unknown>
      }
    }
  }
}

/** @deprecated Fallback for apps not yet passing maxFileSize via setConfig. */
function getMaxFileSizeFromGlobals(): number | string | undefined {
  return (
    window.max_file_size ??
    window.boot?.max_file_size ??
    window.frappe?.boot?.max_file_size ??
    (window.frappe?.boot?.sysdefaults?.max_file_size as
      | number
      | string
      | undefined)
  )
}

/**
 * Max upload size in bytes, or null when unset. Reads the app-provided
 * `maxFileSize` config first; falls back to the legacy window globals.
 */
export function getMaxFileSize(): number | null {
  const raw = getConfig('maxFileSize') ?? getMaxFileSizeFromGlobals()
  const size = Number(raw)
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

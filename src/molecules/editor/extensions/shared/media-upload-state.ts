/**
 * Cross-extension preview state for in-flight media uploads.
 *
 * Kept in its own module (separate from the engine) so node views can read the
 * loading preview (`getLocalFile`) without importing the whole upload pipeline.
 * This module is the lifecycle owner of `localFileMap`; the engine deletes
 * entries here in a `finally` (covering success, error and mid-upload deletion).
 */
import { reactive } from 'vue'

/**
 * A staged local file awaiting upload.
 * `b64` holds a data-URL preview for images; it is omitted for video
 * (config `storeBase64: false`) to avoid keeping whole files base64-encoded.
 */
export interface LocalFileEntry {
  b64?: string
  poster?: string
  file: File
}

export interface UploadProgressEntry {
  loaded: number
  total: number
  percent: number
  abort?: () => void
}

/** uploadId -> staged local file. Read by node views for the loading preview. */
export const localFileMap = new Map<string, LocalFileEntry>()

/** uploadId -> transient progress/cancel state. Reactive for node views. */
export const uploadProgressMap = reactive(
  new Map<string, UploadProgressEntry>(),
)

/** Store the staged file for an upload id. */
export function setLocalFile(uploadId: string, entry: LocalFileEntry): void {
  localFileMap.set(uploadId, entry)
}

export function updateLocalFile(
  uploadId: string,
  patch: Partial<LocalFileEntry>,
): void {
  const current = localFileMap.get(uploadId)
  if (current) localFileMap.set(uploadId, { ...current, ...patch })
}

/** Read the staged file for an upload id, if present. */
export function getLocalFile(uploadId: string): LocalFileEntry | undefined {
  return localFileMap.get(uploadId)
}

/** Remove the staged file for an upload id (terminal cleanup). */
export function deleteLocalFile(uploadId: string): void {
  localFileMap.delete(uploadId)
}

export function setUploadProgress(
  uploadId: string,
  entry: UploadProgressEntry,
): void {
  uploadProgressMap.set(uploadId, entry)
}

export function getUploadProgress(
  uploadId: string,
): UploadProgressEntry | undefined {
  return uploadProgressMap.get(uploadId)
}

export function updateUploadProgress(
  uploadId: string,
  patch: Partial<UploadProgressEntry>,
): void {
  const current = uploadProgressMap.get(uploadId) ?? {
    loaded: 0,
    total: 0,
    percent: 0,
  }
  uploadProgressMap.set(uploadId, { ...current, ...patch })
}

export function abortUpload(uploadId: string): void {
  uploadProgressMap.get(uploadId)?.abort?.()
}

export function deleteUploadProgress(uploadId: string): void {
  uploadProgressMap.delete(uploadId)
}

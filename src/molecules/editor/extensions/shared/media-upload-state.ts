/**
 * Cross-extension preview state for in-flight media uploads.
 *
 * Kept in its own module (separate from the engine) so node views can read the
 * loading preview (`getLocalFile`) without importing the whole upload pipeline.
 * This module is the lifecycle owner of `localFileMap`; the engine deletes
 * entries here in a `finally` (covering success, error and mid-upload deletion).
 */

/**
 * A staged local file awaiting upload.
 * `b64` holds a data-URL preview for images; it is omitted for video
 * (config `storeBase64: false`) to avoid keeping whole files base64-encoded.
 */
export interface LocalFileEntry {
  b64?: string
  file: File
}

/** uploadId -> staged local file. Read by node views for the loading preview. */
export const localFileMap = new Map<string, LocalFileEntry>()

/** Store the staged file for an upload id. */
export function setLocalFile(uploadId: string, entry: LocalFileEntry): void {
  localFileMap.set(uploadId, entry)
}

/** Read the staged file for an upload id, if present. */
export function getLocalFile(uploadId: string): LocalFileEntry | undefined {
  return localFileMap.get(uploadId)
}

/** Remove the staged file for an upload id (terminal cleanup). */
export function deleteLocalFile(uploadId: string): void {
  localFileMap.delete(uploadId)
}

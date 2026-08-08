/**
 * Cross-extension preview state for in-flight media uploads.
 *
 * Kept in its own module (separate from the engine) so node views can read the
 * loading preview (`getLocalFile`) without importing the whole upload pipeline.
 * This module is the lifecycle owner of `localFileMap`; the engine deletes
 * entries here in a `finally` (covering success, error and mid-upload deletion).
 */
import { reactive } from 'vue';
/** uploadId -> staged local file. Read by node views for the loading preview. */
export const localFileMap = new Map();
/** uploadId -> transient progress/cancel state. Reactive for node views. */
export const uploadProgressMap = reactive(new Map());
/** Store the staged file for an upload id. */
export function setLocalFile(uploadId, entry) {
    localFileMap.set(uploadId, entry);
}
export function updateLocalFile(uploadId, patch) {
    const current = localFileMap.get(uploadId);
    if (current)
        localFileMap.set(uploadId, { ...current, ...patch });
}
/** Read the staged file for an upload id, if present. */
export function getLocalFile(uploadId) {
    return localFileMap.get(uploadId);
}
/** Remove the staged file for an upload id (terminal cleanup). */
export function deleteLocalFile(uploadId) {
    localFileMap.delete(uploadId);
}
export function setUploadProgress(uploadId, entry) {
    uploadProgressMap.set(uploadId, entry);
}
export function getUploadProgress(uploadId) {
    return uploadProgressMap.get(uploadId);
}
export function updateUploadProgress(uploadId, patch) {
    const current = uploadProgressMap.get(uploadId) ?? {
        loaded: 0,
        total: 0,
        percent: 0,
    };
    uploadProgressMap.set(uploadId, { ...current, ...patch });
}
export function abortUpload(uploadId) {
    uploadProgressMap.get(uploadId)?.abort?.();
}
export function deleteUploadProgress(uploadId) {
    uploadProgressMap.delete(uploadId);
}

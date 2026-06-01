/**
 * Upload-id generation for media nodes (image/video).
 *
 * The id is stamped onto the loading placeholder node so the async upload
 * pipeline can locate the node again after each `await`, even as the document
 * mutates underneath it.
 */

/** Generate a unique upload id: `upload-${Date.now()}-${random}`. */
export function createUploadId(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

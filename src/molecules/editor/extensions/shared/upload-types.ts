/**
 * Shared upload value-types, consolidated so image-group, the engine and the
 * content-paste path stop each declaring their own `UploadResult` /
 * `MediaUploadOptions` interfaces.
 *
 * `UploadResult`, `MediaUploadOptions` and `UploadedFile` are OWNED by the image
 * cluster's `media-upload-types.ts` (the engine's canonical type surface); they
 * are re-exported here so consumers have one stable import for the whole upload
 * value-type vocabulary. The only type added here is {@link ExistingImage},
 * which is specific to gallery/group editing.
 */
export type {
  MediaUploadOptions,
  UploadResult,
  UploadedFile,
} from '@molecules/editor/extensions/shared/media-upload-types'

/**
 * An image already present in the document (or a freshly-uploaded one rendered
 * the same way): a resolved `src` plus optional alt/caption text. This is the
 * unit the ImageGroup dialog stages and the `setImageGroup` command consumes.
 */
export interface ExistingImage {
  src: string
  alt: string
}

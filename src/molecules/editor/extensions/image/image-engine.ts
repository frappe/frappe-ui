/**
 * The image-specific media upload engine.
 *
 * A thin binding of the generic {@link createMediaUploadEngine} to the image
 * node: it probes intrinsic dimensions via `<img>.naturalWidth/Height`, filters
 * drop/paste to image MIME types, and keeps a base64 preview in `localFileMap`
 * so the node view can show a loading placeholder. All upload/queue/find/
 * dimension logic lives in the shared engine — this file only supplies config.
 */
import { createMediaUploadEngine } from '#molecules/editor/extensions/shared/media-upload-engine'
import { probeImageDimensions } from '#molecules/editor/extensions/shared/media-dimensions'
import type { MediaUploadConfig } from '#molecules/editor/extensions/shared/media-upload-engine'

/**
 * Why a file is no image the editor can show, or `null` when it is one. The
 * picker and the drop filter already ask for images, but a picker set to
 * "all files" and a programmatic `uploadImage(file)` do not, and an image
 * the browser cannot decode (HEIC off an iPhone) would otherwise stage a
 * preview that never draws.
 */
export function unsupportedImageMessage(file: File): string | null {
  const name = file.name?.toLowerCase() ?? ''
  if (
    /^image\/hei[cf]$/i.test(file.type) ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  ) {
    return 'Unsupported file. HEIC images cannot be shown here — save it as JPG or PNG first.'
  }
  if (!/^image\//i.test(file.type)) {
    return 'Unsupported file. Only an image can go here — JPG, PNG, GIF, WEBP or SVG.'
  }
  return null
}

export const imageUploadConfig: MediaUploadConfig = {
  nodeName: 'image',
  probeDimensions: probeImageDimensions,
  accept: /image/i,
  storeBase64: true,
  validate: unsupportedImageMessage,
}

/** The singleton image upload engine, consumed by `image-extension.ts`. */
export const imageEngine = createMediaUploadEngine(imageUploadConfig)

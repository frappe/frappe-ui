/**
 * The image-specific media upload engine.
 *
 * A thin binding of the generic {@link createMediaUploadEngine} to the image
 * node: it probes intrinsic dimensions via `<img>.naturalWidth/Height`, filters
 * drop/paste to image MIME types, and keeps a base64 preview in `localFileMap`
 * so the node view can show a loading placeholder. All upload/queue/find/
 * dimension logic lives in the shared engine — this file only supplies config.
 */
import { createMediaUploadEngine } from '@molecules/editor/extensions/shared/media-upload-engine'
import { probeImageDimensions } from '@molecules/editor/extensions/shared/media-dimensions'
import type { MediaUploadConfig } from '@molecules/editor/extensions/shared/media-upload-engine'

export const imageUploadConfig: MediaUploadConfig = {
  nodeName: 'image',
  probeDimensions: probeImageDimensions,
  accept: /image/i,
  storeBase64: true,
}

/** The singleton image upload engine, consumed by `image-extension.ts`. */
export const imageEngine = createMediaUploadEngine(imageUploadConfig)

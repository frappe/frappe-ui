/**
 * Video upload engine + config.
 *
 * The video node differs from the image node only in the values captured by
 * {@link MediaUploadConfig}: it inserts/updates `video` nodes, filters drop/paste
 * by the `video/*` MIME type, probes intrinsic dimensions via `<video>` metadata,
 * and — unlike images — does NOT keep a whole-file base64 preview in
 * `localFileMap` (`storeBase64: false`), so large videos are not base64-encoded
 * and held in memory (fix F2). Everything else (the upload pipeline, loading
 * placeholder lifecycle, async-safe write-back, `localFileMap` cleanup) is the
 * shared engine, consumed — never re-implemented.
 */
import {
  createMediaUploadEngine,
  type MediaUploadConfig,
} from '#molecules/editor/extensions/shared/media-upload-engine'
import { probeVideoDimensions } from '#molecules/editor/extensions/shared/media-dimensions'

/** The per-node config for the video upload pipeline. */
export const videoConfig: MediaUploadConfig = {
  nodeName: 'video',
  probeDimensions: probeVideoDimensions,
  accept: /video/i,
  storeBase64: false,
}

/** The single video upload engine instance. */
export const videoEngine = createMediaUploadEngine(videoConfig)

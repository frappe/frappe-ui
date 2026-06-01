/**
 * Pure intrinsic-dimension probes for media sources.
 *
 * This is the only image-vs-video difference in the upload pipeline; each probe
 * is injected into the engine via `MediaUploadConfig.probeDimensions`.
 *
 * Both probes fully tear down their probe element and revoke any object URL in
 * a `finally`, and reject with a real `Error` (never a DOM `Event`).
 */

export interface MediaDimensions {
  width: number
  height: number
}

/** Probe an image source via `<img>.naturalWidth`/`naturalHeight`. */
export function probeImageDimensions(src: string): Promise<MediaDimensions> {
  return new Promise<MediaDimensions>((resolve, reject) => {
    const img = new Image()
    const cleanup = () => {
      img.onload = null
      img.onerror = null
      img.removeAttribute('src')
    }
    img.onload = () => {
      const dims = { width: img.naturalWidth, height: img.naturalHeight }
      cleanup()
      resolve(dims)
    }
    img.onerror = () => {
      cleanup()
      reject(new Error(`Failed to load image dimensions for: ${src}`))
    }
    img.src = src
  })
}

/** Probe a video source via `<video>.videoWidth`/`videoHeight` (metadata only). */
export function probeVideoDimensions(src: string): Promise<MediaDimensions> {
  return new Promise<MediaDimensions>((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    const cleanup = () => {
      video.onloadedmetadata = null
      video.onerror = null
      video.removeAttribute('src')
      video.load()
    }
    video.onloadedmetadata = () => {
      const dims = { width: video.videoWidth, height: video.videoHeight }
      cleanup()
      resolve(dims)
    }
    video.onerror = () => {
      cleanup()
      reject(new Error(`Failed to load video dimensions for: ${src}`))
    }
    video.src = src
  })
}

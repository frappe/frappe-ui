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
  poster?: string
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

function captureVideoPoster(video: HTMLVideoElement): string | undefined {
  if (!video.videoWidth || !video.videoHeight) return undefined
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.72)
}

/** Probe a video source via `<video>.videoWidth`/`videoHeight` and a poster frame. */
export function probeVideoDimensions(src: string): Promise<MediaDimensions> {
  return new Promise<MediaDimensions>((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    const cleanup = () => {
      video.onloadedmetadata = null
      video.onseeked = null
      video.onerror = null
      video.removeAttribute('src')
      video.load()
    }
    const resolveWithPoster = () => {
      const dims = { width: video.videoWidth, height: video.videoHeight }
      let poster: string | undefined
      try {
        poster = captureVideoPoster(video)
      } catch {
        poster = undefined
      }
      cleanup()
      resolve({ ...dims, poster })
    }
    video.onloadedmetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0.15) {
        video.onseeked = resolveWithPoster
        try {
          video.currentTime = 0.1
        } catch {
          resolveWithPoster()
        }
      } else {
        resolveWithPoster()
      }
    }
    video.onerror = () => {
      cleanup()
      reject(new Error(`Failed to load video dimensions for: ${src}`))
    }
    video.src = src
  })
}

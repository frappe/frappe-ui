import type { ViewableImage } from '../../extensions/image-viewer/collectImages'

/**
 * Trigger a browser download of the given image.
 *
 * The filename derives from the alt text (slugified) or the URL's last path
 * segment, falling back to `download`. The real file extension from the source
 * is preserved when present; only when no extension can be found do we append
 * `.jpg` as a last resort. No-ops on `undefined` (e.g. empty gallery).
 */
export function downloadImage(image: ViewableImage | undefined): void {
  if (!image) return

  const base =
    image.alt?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ||
    image.src.split('/').pop()?.split(/[?#]/)[0] ||
    'download'

  const ext = extensionOf(image.src) ?? extensionOf(base)
  const filename = ext
    ? withExtension(base, ext)
    : // Last resort: guarantee an extension so the download isn't extensionless.
      base.includes('.')
      ? base
      : `${base}.jpg`

  const link = document.createElement('a')
  link.href = image.src
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Extract a plausible file extension from a URL or filename, else null. */
function extensionOf(value: string): string | null {
  const name = value.split(/[?#]/)[0].split('/').pop() ?? ''
  const dot = name.lastIndexOf('.')
  if (dot <= 0 || dot === name.length - 1) return null
  return name.slice(dot + 1).toLowerCase()
}

function withExtension(base: string, ext: string): string {
  const cleaned = base.endsWith(`.${ext}`) ? base : `${base}.${ext}`
  return cleaned
}

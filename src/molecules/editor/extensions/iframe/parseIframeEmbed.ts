/**
 * Pure parser that pulls iframe embed data out of a pasted HTML/text fragment.
 *
 * Used by the paste handler to recognise `<iframe …>` embed snippets. Tries the
 * DOM parser first, then falls back to a tolerant regex for fragments the DOM
 * parser drops. Returns `null` when no usable `src` is found.
 */

export interface ParsedIframeEmbed {
  src: string
  width?: number
  height?: number
  title?: string
}

function parseDimension(value: string | null): number | undefined {
  if (!value) return undefined
  const n = parseInt(value, 10)
  return Number.isNaN(n) ? undefined : n
}

/** Parse an `<iframe>` embed snippet from an HTML or plain-text fragment. */
export function parseIframeFromHTML(html: string): ParsedIframeEmbed | null {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const iframe = doc.querySelector('iframe')
    if (iframe) {
      const src = iframe.getAttribute('src')
      if (!src) return null
      return {
        src,
        width: parseDimension(iframe.getAttribute('width')),
        height: parseDimension(iframe.getAttribute('height')),
        title: iframe.getAttribute('title') || undefined,
      }
    }
  } catch {
    // Fall through to the regex fallback below.
  }

  const srcMatch = html.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i)
  if (!srcMatch) return null
  return {
    src: srcMatch[1],
    width: parseDimension(html.match(/\swidth=["'](\d+)["']/i)?.[1] ?? null),
    height: parseDimension(html.match(/\sheight=["'](\d+)["']/i)?.[1] ?? null),
    title: html.match(/\stitle=["']([^"']+)["']/i)?.[1] || undefined,
  }
}

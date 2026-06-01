/**
 * Ref-counted lifecycle for the shared `cursor: pointer` style element that
 * marks images as clickable while the editor is not focused.
 *
 * The original implementation appended the style in `onBeforeCreate` and
 * removed it in `onDestroy`. With multiple editor instances on a page, the
 * first editor to be destroyed would yank the style out from under the others.
 * Ref-counting fixes this: the element is created on the first `acquire` and
 * only removed once the last holder calls `release`.
 */

const STYLE_ATTR = 'data-image-viewer-style'
const STYLE_CONTENT = `
  .ProseMirror:not(.ProseMirror-focused) img {
    cursor: pointer;
  }
`

let refCount = 0
let styleEl: HTMLStyleElement | null = null

/** Register a holder of the clickable-image style; injects it on first call. */
export function acquireImageViewerStyle(): void {
  refCount += 1
  if (refCount > 1) return

  // Reuse an existing element (e.g. left by the legacy extension) if present.
  const existing = document.querySelector<HTMLStyleElement>(
    `style[${STYLE_ATTR}]`,
  )
  if (existing) {
    styleEl = existing
    return
  }

  const style = document.createElement('style')
  style.textContent = STYLE_CONTENT
  style.setAttribute(STYLE_ATTR, 'true')
  document.head.appendChild(style)
  styleEl = style
}

/** Release a holder; removes the style only when the last holder leaves. */
export function releaseImageViewerStyle(): void {
  if (refCount === 0) return
  refCount -= 1
  if (refCount > 0) return

  if (styleEl && styleEl.parentNode) {
    styleEl.parentNode.removeChild(styleEl)
  }
  styleEl = null
}

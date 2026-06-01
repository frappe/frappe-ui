import {
  useFloatingPopup,
  type VirtualReference,
} from '@molecules/editor/composables/useFloatingPopup'
import LinkEditorPopup from './LinkEditorPopup.vue'

/**
 * Options for {@link openLinkPopup}.
 */
export interface OpenLinkPopupOptions {
  /** Existing href to seed the editor with (`null` when creating a new link). */
  href: string | null
  /** Anchor element used for popup ownership and outside-click containment. */
  anchor: HTMLElement
  /** Optional positioning reference. Defaults to the editor selection. */
  virtualReference?: VirtualReference
}

/**
 * Open the link-editor bubble and resolve with the user's choice:
 *  - a non-empty string  → set/update the link to that href
 *  - `''`                → remove the link
 *  - `null`              → cancelled / dismissed (no document change)
 *
 * The promise NEVER rejects. Dismissal (Escape, click-outside,
 * or programmatic teardown) resolves `null`, so callers can write a single
 * `if (result === null) return` guard instead of a `.catch`.
 *
 * The reference rect is read live from the current window selection on every
 * reposition, so the popup tracks a collapsed cursor or an expanded range
 * correctly rather than freezing at open time.
 */
export function openLinkPopup(
  options: OpenLinkPopupOptions,
): Promise<string | null> {
  const { href, anchor } = options

  return new Promise<string | null>((resolve) => {
    let settled = false
    const settle = (value: string | null) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const popup = useFloatingPopup({
      anchor,
      component: LinkEditorPopup,
      closeOnAnchorPointerDown: true,
      virtualReference: options.virtualReference ?? {
        getBoundingClientRect: () => selectionRect(anchor),
      },
      floatingOptions: { placement: 'top' },
      props: {
        href: href ?? '',
        onClose: () => {
          // Cancel: resolve null, then tear down.
          settle(null)
          popup.destroy()
        },
        onUpdateHref: (newHref: string) => {
          settle(newHref)
          popup.destroy()
        },
      },
    })

    // Escape / click-outside routes through destroy(). Resolve null if nothing
    // else settled the promise by the time the popup is gone.
    const originalDestroy = popup.destroy
    popup.destroy = () => {
      settle(null)
      originalDestroy()
    }

    if (!popup.floating) settle(null)
  })
}

/**
 * Build a live `DOMRect` from the current selection (collapsed → caret rect,
 * expanded → selection rect). Falls back to the anchor's own rect when there
 * is no selection.
 */
function selectionRect(anchor: HTMLElement): DOMRect {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return anchor.getBoundingClientRect()
  }

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  const isCollapsed = range.collapsed

  return {
    width: 0,
    height: rect.height,
    top: rect.top,
    right: isCollapsed ? rect.left : rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  } as DOMRect
}

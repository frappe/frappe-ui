import type { PopoverAlign, PopoverSide } from '#components/Popover/types'
import type { EditorMenuOptions } from './menu'

/**
 * Internal. Not re-exported by `frappe-ui/editor`: it lives here rather than
 * in `menu.ts` so the barrel keeps publishing only the menu vocabulary.
 */

/** The 12 placements Floating UI accepts, written from the two axes. */
type FloatingPlacement =
  | PopoverSide
  | `${PopoverSide}-${Exclude<PopoverAlign, 'center'>}`

/**
 * Turn the `side` + `align` pair into the single `placement` string Floating
 * UI takes. `align: 'center'` is the bare side, which is what Floating UI
 * calls the centred variant.
 *
 * Returns `undefined` when the caller sets neither axis, so TipTap keeps its
 * own default placement instead of one this function invented.
 */
export function editorMenuPlacement(
  options: EditorMenuOptions | undefined,
  defaultSide: PopoverSide,
): FloatingPlacement | undefined {
  if (!options?.side && !options?.align) return undefined
  const side = options.side ?? defaultSide
  const align = options.align ?? 'center'
  return align === 'center' ? side : `${side}-${align}`
}

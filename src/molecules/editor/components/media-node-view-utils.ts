/**
 * Pure presentation helpers for the shared media node view.
 *
 * No Vue, no DOM mutation — fully unit-testable. Consumed by `MediaNodeView.vue`
 * and `MediaToolbar.vue`.
 */

export type MediaAlign = 'left' | 'center' | 'right'

/**
 * The one control style for chrome painted over media, per the design
 * (espresso-2.0, node 31403-45433): a 28px `rounded-4` button on
 * `black-overlay-300` — the token whose value is the frame's 36% black —
 * carrying a 16px white icon, with hover and pressed stepping up the overlay
 * ramp. Worn by the actions menu and the resize grip alike.
 *
 * Fixed white/black scales rather than `ink-*` / `surface-*` tokens: the button
 * sits on the media, so it holds one appearance in both themes.
 */
export const MEDIA_CHROME_BUTTON =
  'flex size-7 items-center justify-center rounded-4 bg-black-overlay-300 text-white transition-colors hover:bg-black-overlay-400 active:bg-black-overlay-500 data-[state=open]:bg-black-overlay-500'

/**
 * The selection ring around a media, embed, or gallery node.
 *
 * The offset color is spelled out because Tailwind's default is a hard `#fff`,
 * which is invisible on a white page and a bright white halo around every
 * selected image in dark mode. `--surface-base` is the page background in both
 * themes, so the gap reads as a gap.
 */
export const SELECTED_MEDIA_RING =
  'ring-2 ring-outline-gray-3 ring-offset-2 ring-offset-[var(--surface-base)]'

export interface MediaLayoutAttrs {
  align?: MediaAlign | null
  float?: 'left' | 'right' | null
  width?: number | null
  height?: number | null
}

/**
 * Classes for the outer `NodeViewWrapper`. When the node floats, it shrinks to
 * content width and floats left/right; otherwise it gets default block margins.
 */
export function wrapperClasses(float: 'left' | 'right' | null | undefined): string[] {
  if (!float) return ['my-2']
  return ['w-fit m-2', float === 'right' ? 'float-right ml-5' : 'float-left mr-5']
}

/**
 * Classes for the media container, encoding the alignment (center is the
 * default) and the selected ring. `block max-w-full` only applies when the
 * node is not floating.
 */
export function containerClasses(
  attrs: MediaLayoutAttrs,
  selected: boolean,
): Array<string | Record<string, boolean>> {
  const align = attrs.align ?? null
  return [
    { [SELECTED_MEDIA_RING]: selected },
    align === 'center' || !align ? 'mx-auto' : '',
    align === 'right' ? 'ml-auto mr-0' : '',
    align === 'left' ? 'mr-auto ml-0' : '',
    !attrs.float ? 'block max-w-full' : '',
  ]
}

/**
 * CSS `aspect-ratio` value (`"W / H"`) from the node's stored intrinsic size,
 * or `undefined` when either dimension is missing.
 */
export function aspectRatioFrom(
  width: number | null | undefined,
  height: number | null | undefined,
): string | undefined {
  if (!width || !height) return undefined
  return `${width} / ${height}`
}

/**
 * Aspect ratio as `height / width` for resize math. Falls back to `1` when
 * either dimension is missing or zero (square) to avoid a divide-by-zero.
 */
export function heightOverWidth(
  width: number | null | undefined,
  height: number | null | undefined,
): number {
  if (!width || !height) return 1
  return height / width
}

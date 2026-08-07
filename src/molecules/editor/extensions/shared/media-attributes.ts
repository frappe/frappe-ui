/**
 * Schema attributes shared by the media nodes (`image`, `video`).
 *
 * Kept here so image and video cannot drift apart, and so the caption/alt
 * split has a single documented home.
 */
import type { Attribute } from '@tiptap/core'

/**
 * The visible caption shown under the media, serialized as `data-caption`.
 *
 * Caption and alt text are DIFFERENT things and used to share the `alt`
 * attribute, which made every image whose `alt` happened to hold an upload
 * filename render that filename as a caption. `data-caption` is the visible
 * text; `alt` goes back to being the screen-reader description only.
 *
 * There is deliberately NO fallback to `alt` when `data-caption` is absent.
 * Existing content stores upload filenames and emoji shortcodes in `alt`
 * (`Screenshot 2020-05-09 11.04.00`, `:slight_smile:`), and a real caption
 * cannot be told apart from those automatically. Rendering them all as
 * captions is worse than rendering none: the legacy text is not lost, it stays
 * in `alt` and round-trips untouched.
 */
export const captionAttribute: Partial<Attribute> = {
  default: null,
  parseHTML: (element) => element.getAttribute('data-caption') || null,
  renderHTML: (attributes) => {
    if (!attributes.caption) return {}
    return { 'data-caption': attributes.caption }
  },
}

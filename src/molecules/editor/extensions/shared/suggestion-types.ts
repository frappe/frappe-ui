/**
 * Leaf types module for the suggestion family.
 *
 * Breaks the circular dependency between the suggestion list component, the
 * Floating UI/VueRenderer lifecycle renderer, and the `createSuggestionExtension`
 * factory: all three import their shared types from here instead of from each
 * other.
 *
 * Canonical import path:
 *   `@molecules/editor/extensions/shared/suggestion-types`
 */

/**
 * Base shape for every suggestion item (slash command / emoji / mention / tag).
 * Items are otherwise free-form bags of fields, looked up by the filter helper.
 */
export interface BaseSuggestionItem {
  /** Optional precomputed display string (e.g. `New tag: "foo"`). */
  display?: string
  title?: string
  name?: string
  [key: string]: unknown
}

/**
 * The contract a suggestion list component exposes (via `defineExpose`) so the
 * renderer can forward keyboard events into the active list. `component.ref` is
 * narrowed to this instead of `any`.
 */
export interface SuggestionListExpose {
  onKeyDown(props: { event: KeyboardEvent }): boolean
}

/** The `{ from, to }` document range a suggestion replaces when committed. */
export interface SuggestionRange {
  from: number
  to: number
}

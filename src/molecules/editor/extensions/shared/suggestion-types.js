/**
 * Leaf types module for the suggestion family.
 *
 * Breaks the circular dependency between the suggestion list component, the
 * Floating UI/VueRenderer lifecycle renderer, and the `createSuggestionExtension`
 * factory: all three import their shared types from here instead of from each
 * other.
 *
 * Canonical import path:
 *   `#molecules/editor/extensions/shared/suggestion-types`
 */
export {};

import type { InjectionKey, Ref } from 'vue'

/** The id of the pattern in view on a PatternsPage, for a pattern that
 * shows its controls under the outline while it is the one being read. */
export const PATTERNS_ACTIVE: InjectionKey<Ref<string>> =
  Symbol('patterns-active')

import type { InjectionKey } from 'vue'

export const autocompleteDeprecationSuppressed: InjectionKey<boolean> = Symbol(
  'autocompleteDeprecationSuppressed',
)

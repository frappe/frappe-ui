// The trail a header's breadcrumb shows. A layout that knows where it is
// (the v2 playground: its workspace and the open page) provides it; a
// header with no layout above it keeps the file's own sample trail.
import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

export interface Crumb {
  label: string
}

export const headerCrumbsKey: InjectionKey<ComputedRef<Crumb[]>> =
  Symbol('headerCrumbs')

export function useHeaderCrumbs(fallback: Crumb[]) {
  const provided = inject(headerCrumbsKey, null)
  return computed(() => provided?.value ?? fallback)
}

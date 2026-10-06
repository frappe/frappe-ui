import { inject, type InjectionKey, type Ref } from 'vue'

/**
 * The page a header sits over, when it has one of its own. The header
 * patterns carry the design's sample crumbs ("frappe / frappe"); a page
 * that is not about the header itself shows a single crumb, its own name,
 * in their place (the user's call 2026-10-06).
 */
export const pageCrumbKey: InjectionKey<Ref<string | null>> =
  Symbol('pageCrumb')

/** The crumbs to show: the page's own name alone, else the pattern's. */
export function useCrumbs(sample: { label: string }[]) {
  const page = inject(pageCrumbKey, null)
  return () => (page?.value ? [{ label: page.value }] : sample)
}

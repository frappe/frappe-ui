import { isRef, ref, watch, onBeforeUnmount, type Ref } from 'vue'

/**
 * Create an object URL for a `File` that is automatically revoked on unmount.
 *
 * Accepts either a static `File` or a reactive `Ref<File | null>`. When given a
 * ref, the URL is recreated (and the previous one revoked) whenever the file
 * changes. The active URL is always revoked in `onBeforeUnmount`.
 *
 * This is a Vue composable and is NOT consumable by the imperative upload
 * engine — that path revokes its own object URLs explicitly (see
 * `media-dimensions.ts`).
 *
 * @param file A `File`, or a `Ref<File | null>` to track reactively.
 * @returns A ref holding the current object URL (`''` when no file).
 */
export function useObjectUrl(file: Ref<File | null> | File): Ref<string> {
  const url = ref('')

  const revoke = () => {
    if (url.value) {
      URL.revokeObjectURL(url.value)
      url.value = ''
    }
  }

  const set = (next: File | null) => {
    revoke()
    if (next) url.value = URL.createObjectURL(next)
  }

  if (isRef(file)) {
    watch(file, set, { immediate: true })
  } else {
    set(file)
  }

  onBeforeUnmount(revoke)

  return url
}

/**
 * Create and cache object URLs keyed by an arbitrary string, auto-revoking the
 * whole map on unmount. Useful when a component manages many files (e.g. a grid
 * of preview cells) and wants one stable URL per key.
 *
 * @returns `urlFor(key, file)` returns a stable URL for `key`, creating one on
 *   first use; `revokeAll()` revokes and clears every cached URL (also called
 *   automatically on unmount).
 */
export function useObjectUrlMap(): {
  urlFor: (key: string, file: File) => string
  revokeAll: () => void
} {
  const urls = new Map<string, string>()

  const urlFor = (key: string, file: File): string => {
    const existing = urls.get(key)
    if (existing) return existing
    const url = URL.createObjectURL(file)
    urls.set(key, url)
    return url
  }

  const revokeAll = () => {
    for (const url of urls.values()) URL.revokeObjectURL(url)
    urls.clear()
  }

  onBeforeUnmount(revokeAll)

  return { urlFor, revokeAll }
}

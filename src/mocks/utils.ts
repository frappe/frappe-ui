import { watch } from 'vue'
import { vi } from 'vitest'

export let baseUrl = 'http://example.com'

export let url = (path: string) => new URL(path, baseUrl).toString()

export function waitUntilValueChanges(
  getter: () => any,
  matchValue?: any,
  timeout = 1000,
): Promise<void> {
  return new Promise((resolve) => {
    let stop = watch(getter, (val) => {
      if (matchValue !== undefined && matchValue === val) {
        stop()
      } else {
        stop()
      }
      resolve()
    })
    setTimeout(() => {
      stop()
      resolve()
    }, timeout)
  })
}

/**
 * Signs `user` in as the data composables see it: Frappe's URL-encoded
 * `user_id` cookie, next to the other session cookies. `null` means no session.
 * These tests run without a DOM, so this stubs `document`; undo it with
 * `vi.unstubAllGlobals()`.
 */
export function signInAs(user: string | null) {
  const cookies = ['sid=0123456789abcdef', 'system_user=yes']
  if (user) cookies.push(`user_id=${encodeURIComponent(user)}`)
  vi.stubGlobal('document', { cookie: cookies.join('; ') })
}

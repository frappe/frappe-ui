import { MaybeRef, toValue, MaybeRefOrGetter } from 'vue'
import { Filters } from './useList/types'

export function makeGetParams(params: Record<string, any>) {
  let url = new URLSearchParams()
  for (let key in params) {
    let value = params[key]
    if (value != null && !isEmptyObject(value)) {
      url.append(key, value)
    }
  }
  return url.toString()
}

export function isEmptyObject(obj: any) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function parseFilters(
  _filters: MaybeRefOrGetter<Filters>,
): Filters | null {
  let filters = typeof _filters == 'function' ? _filters() : toValue(_filters)
  let parsedFilters: Filters = {}
  for (let key in filters) {
    let value = filters[key]
    if (Array.isArray(value)) {
      let [operator, actualValue] = value
      operator = toValue(operator)
      actualValue = toValue(actualValue)
      if (operator === 'like') {
        if (typeof actualValue != 'string') {
          actualValue = String(actualValue)
        }
        if (actualValue == null || actualValue == '') {
          continue
        }
        if (!actualValue.includes('%')) {
          actualValue = `%${actualValue}%`
        }
      }
      parsedFilters[key] = [operator, actualValue]
    } else {
      parsedFilters[key] = toValue(value)
    }
  }
  if (isEmptyObject(parsedFilters)) {
    return null
  }
  return parsedFilters
}

export function unrefObject(
  obj: Record<string, MaybeRef<string | number | boolean>>,
) {
  let newObj: Record<keyof typeof obj, any> = {}
  for (let key in obj) {
    newObj[key] = toValue(obj[key])
  }
  return newObj
}

// Part of every cache key, docs included. Bump it when what the cache stores
// changes meaning, so entries an older frappe-ui wrote are ignored instead of
// misread. v2: the cache holds responses as the server sent them, before
// `transform`, and keys are per user. A v1 entry holds transformed data, and
// was written without a user, so any visitor would read it.
export const CACHE_VERSION = 'v2'

export function normalizeCacheKey(
  cacheKey: string | Array<string | number | boolean | object> | undefined,
  prefix?: string,
) {
  if (!cacheKey) {
    return null
  }
  if (typeof cacheKey === 'string') {
    cacheKey = [cacheKey]
  }
  if (prefix) {
    cacheKey = [`${prefix}:${CACHE_VERSION}`, ...cacheKey]
  }
  return withCacheNamespace(JSON.stringify(cacheKey))
}

/**
 * Puts an IndexedDB cache key under the signed-in user, so no user reads what
 * another user cached on the same browser. The user comes from the `user_id`
 * cookie that Frappe sets on login and deletes on logout, the same way
 * `useFrappeFetch` reads `window.csrf_token` from the page. With no cookie, or
 * as `Guest`, the key comes back unchanged: a guest only sees public data, and
 * a signed-in user always has a namespace, so nothing a user cached reaches a
 * guest.
 *
 * With a user, the key becomes `ns:<user>:<key>`. The user is URI-encoded, so
 * it never holds a `:` and the first `:` after `ns:` always ends it: two users
 * cannot share a key. No un-namespaced key starts with `ns:` (list and call
 * keys start with `[`, doc keys with `doc:`), so the two formats cannot share
 * one either. A prefix stays a prefix, which the doc store's prefix scan
 * relies on.
 *
 * The cookie is read on every call, not at module load, so a store created at
 * import time still gets the user's key.
 */
export function withCacheNamespace(key: string): string {
  const user = sessionUser()
  if (!user || user === 'Guest') return key
  return `ns:${encodeURIComponent(user)}:${key}`
}

/** The `user_id` cookie, decoded. Frappe URL-encodes cookie values. */
function sessionUser(): string | null {
  if (typeof document === 'undefined') return null
  return new URLSearchParams(document.cookie.split('; ').join('&')).get(
    'user_id',
  )
}

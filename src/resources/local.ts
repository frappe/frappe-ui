import { del, get, set } from 'idb-keyval'

export function saveLocal<T = any>(key: string, data: T): Promise<void | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }
  if (!key) return Promise.resolve()
  return set(key, JSON.stringify(data))
}

export function deleteLocal(key: string): Promise<void | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }
  if (!key) return Promise.resolve()
  return del(key)
}

export function getLocal<T = any>(key: string): Promise<T | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }
  return get(key).then((val) => (val ? JSON.parse(val) : val))
}

import { get, set, del } from 'idb-keyval'

export function saveLocal(key, data) {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }
  if (!key) return Promise.resolve()
  return set(key, JSON.stringify(data))
}

export function deleteLocal(key) {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }
  if (!key) return Promise.resolve()
  return del(key)
}

export function getLocal(key) {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }
  return get(key).then((val) => (val ? JSON.parse(val) : val))
}

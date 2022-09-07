import { get, set } from 'idb-keyval'

export function saveLocal(key, data) {
  if (!key) return Promise.resolve()
  return set(key, JSON.stringify(data))
}

export function getLocal(key) {
  return get(key).then((val) => (val ? JSON.parse(val) : val))
}

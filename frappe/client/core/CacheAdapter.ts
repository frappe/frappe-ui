import type { Doc } from './types'
import type { DocStore } from './DocStore'

export interface CacheAdapter {
  /** Write-behind: called after DocStore.set(). Non-blocking. */
  persist(doc: Doc): void
  persistMany(docs: Doc[]): void
  /** Called once on startup to load all cached docs for hydration. */
  loadAll(): Promise<Doc[]>
  remove(doctype: string, name: string): void
  clear(): void
}

/** In-memory adapter — used in tests and environments without IDB. */
export function createMemoryCacheAdapter(): CacheAdapter {
  const store = new Map<string, Doc>()

  function key(doctype: string, name: string) {
    return `${doctype}/${name}`
  }

  return {
    persist(doc) {
      store.set(key(doc.doctype, doc.name), { ...doc })
    },
    persistMany(docs) {
      for (const doc of docs) {
        store.set(key(doc.doctype, doc.name), { ...doc })
      }
    },
    async loadAll() {
      return Array.from(store.values())
    },
    remove(doctype, name) {
      store.delete(key(doctype, name))
    },
    clear() {
      store.clear()
    },
  }
}

/**
 * Wires a CacheAdapter to a DocStore so that every store mutation is
 * automatically persisted and hydration happens on startup.
 */
export async function connectCache(
  store: DocStore,
  cache: CacheAdapter,
): Promise<void> {
  const docs = await cache.loadAll()
  store.hydrate(docs)
}

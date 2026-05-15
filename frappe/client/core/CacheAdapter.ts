import { set, setMany, del, clear, values, createStore } from 'idb-keyval'
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

/** IndexedDB-backed adapter — persists docs across page reloads. */
export function createIDBCacheAdapter(dbName = 'frappe-cache'): CacheAdapter {
  // createStore is synchronous — opens the IDB lazily on first use.
  const idbStore = createStore(dbName, 'docs')

  function docKey(doctype: string, name: string) {
    return `${doctype}/${name}`
  }

  return {
    persist(doc) {
      set(docKey(doc.doctype, doc.name), doc, idbStore).catch(() => {})
    },
    persistMany(docs) {
      setMany(
        docs.map(
          (doc) => [docKey(doc.doctype, doc.name), doc] as [string, Doc],
        ),
        idbStore,
      ).catch(() => {})
    },
    async loadAll() {
      return (await values<Doc>(idbStore)) ?? []
    },
    remove(doctype, name) {
      del(docKey(doctype, name), idbStore).catch(() => {})
    },
    clear() {
      clear(idbStore).catch(() => {})
    },
  }
}

/**
 * Returns an IDB adapter when available, falling back to in-memory.
 * This is the recommended adapter for browser environments.
 */
export function createDefaultCacheAdapter(dbName?: string): CacheAdapter {
  if (typeof indexedDB !== 'undefined') {
    return createIDBCacheAdapter(dbName)
  }
  return createMemoryCacheAdapter()
}

/**
 * Wires a CacheAdapter to a DocStore so that every store mutation is
 * automatically persisted and hydration happens on startup.
 *
 * The write-behind subscription is registered before awaiting loadAll so
 * that no writes can slip through during the initial IDB scan.
 */
export async function connectCache(
  store: DocStore,
  cache: CacheAdapter,
): Promise<void> {
  store.subscribeAll((doc) => {
    if (doc === null) return
    cache.persist(doc)
  })

  const docs = await cache.loadAll()
  store.hydrate(docs)
}

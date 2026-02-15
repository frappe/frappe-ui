import { get, set, del, clear, entries } from 'idb-keyval'

interface CacheStorageAdapter {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  del(key: string): Promise<void>
  clear(): Promise<void>
  entries(): Promise<[IDBValidKey, any][]>
}

function createIndexedDbAdapter(): CacheStorageAdapter {
  return {
    get,
    set,
    del,
    clear,
    entries,
  }
}

function createNoopAdapter(): CacheStorageAdapter {
  return {
    async get<T>(_key: string) {
      return undefined as T | undefined
    },
    async set<T>(_key: string, _value: T) {
      return
    },
    async del(_key: string) {
      return
    },
    async clear() {
      return
    },
    async entries() {
      return []
    },
  }
}

function isIndexedDbAvailable(): boolean {
  return typeof globalThis !== 'undefined' && 'indexedDB' in globalThis
}

const cacheStorageAdapter: CacheStorageAdapter = isIndexedDbAvailable()
  ? createIndexedDbAdapter()
  : createNoopAdapter()

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await cacheStorageAdapter.get<T>(key)
    return value ?? null
  } catch (e) {
    console.error('Failed to get cache:', e)
    return null
  }
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  try {
    await cacheStorageAdapter.set(key, value)
  } catch (e) {
    console.error('Failed to set cache:', e)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await cacheStorageAdapter.del(key)
  } catch (e) {
    console.error('Failed to delete cache:', e)
  }
}

export async function clearCache(): Promise<void> {
  try {
    await cacheStorageAdapter.clear()
  } catch (e) {
    console.error('Failed to clear cache:', e)
  }
}

export async function getCacheEntries(): Promise<[IDBValidKey, any][]> {
  try {
    return await cacheStorageAdapter.entries()
  } catch (e) {
    console.error('Failed to get cache entries:', e)
    return []
  }
}

/**
 * Retrieves a document from the getDoc cache
 */
export async function getDocumentFromCache<TDoc>(
  doctype: string,
  name: string,
): Promise<TDoc | null> {
  const cacheKey = `getDoc::${doctype}::${name}`
  return await getCache<TDoc>(cacheKey)
}

/**
 * Updates a document in both getDoc and all matching getList caches
 */
export async function updateDocumentInCaches<TDoc extends { name: string }>(
  doctype: string,
  doc: TDoc,
): Promise<void> {
  // Update getDoc cache
  await setCache(`getDoc::${doctype}::${doc.name}`, doc)

  // Update all getList caches
  const allEntries = await getCacheEntries()
  for (const [key, value] of allEntries) {
    if (
      typeof key === 'string' &&
      key.startsWith('getList::') &&
      Array.isArray(value)
    ) {
      const items = value as TDoc[]
      const index = items.findIndex((item) => item.name === doc.name)
      if (index !== -1) {
        const updatedItems = [
          ...items.slice(0, index),
          doc,
          ...items.slice(index + 1),
        ]
        await setCache(key, updatedItems)
      }
    }
  }
}

/**
 * Removes a document from both getDoc and all matching getList caches
 */
export async function removeDocumentFromCaches(
  doctype: string,
  name: string,
): Promise<void> {
  // Delete getDoc cache
  await deleteCache(`getDoc::${doctype}::${name}`)

  // Remove from all getList caches
  const allEntries = await getCacheEntries()
  for (const [key, value] of allEntries) {
    if (
      typeof key === 'string' &&
      key.startsWith('getList::') &&
      Array.isArray(value)
    ) {
      const items = value as Array<{ name: string }>
      const hasItem = items.some((item) => item.name === name)
      if (hasItem) {
        const updatedItems = items.filter((item) => item.name !== name)
        await setCache(key, updatedItems)
      }
    }
  }
}

/**
 * Registry of active watchers for document updates
 * Key format: "doctype::name"
 */
const documentWatchers = new Map<string, Set<(doc: any) => void>>()

/**
 * Watch for updates to a specific document
 * Returns an unsubscribe function
 *
 * @template TDoc - The document type
 * @param doctype - The DocType name
 * @param name - The document name
 * @param callback - Function called when document updates
 * @returns Unsubscribe function to cleanup the watcher
 *
 * @example
 * ```ts
 * const unwatch = watchDocument<ToDo>('ToDo', 'todo-1', (doc) => {
 *   console.log('Todo updated:', doc.status)
 * })
 * // Later: unwatch()
 * ```
 */
export function watchDocument<TDoc = any>(
  doctype: string,
  name: string,
  callback: (doc: TDoc) => void,
): () => void {
  const key = `${doctype}::${name}`

  if (!documentWatchers.has(key)) {
    documentWatchers.set(key, new Set())
  }

  documentWatchers.get(key)!.add(callback as (doc: any) => void)

  // Return unsubscribe function
  return () => {
    const watchers = documentWatchers.get(key)
    if (watchers) {
      watchers.delete(callback as (doc: any) => void)
      if (watchers.size === 0) {
        documentWatchers.delete(key)
      }
    }
  }
}

/**
 * Notify all watchers of a document update
 */
function notifyDocumentWatchers(doctype: string, doc: any): void {
  const key = `${doctype}::${doc.name}`
  const watchers = documentWatchers.get(key)

  if (watchers && watchers.size > 0) {
    watchers.forEach((callback) => callback(doc))
  }
}

/**
 * Enhanced updateDocumentInCaches that also notifies live watchers
 */
export async function updateDocumentInCachesAndNotify<
  TDoc extends { name: string },
>(doctype: string, doc: TDoc): Promise<void> {
  await updateDocumentInCaches(doctype, doc)
  notifyDocumentWatchers(doctype, doc)
}

/**
 * Sync multiple documents from json.docs response
 * This is the main entry point for handling server-side updates
 *
 * @param docs - Array of documents from server response (json.docs)
 *
 * @example
 * ```ts
 * // In onSuccess handler:
 * await syncFromDocs(response.docs)
 *
 * // For WebSocket updates:
 * socket.on('doc_update', (payload) => {
 *   syncFromDocs(payload.docs)
 * })
 * ```
 *
 * TODO: Batch IndexedDB writes for >10 docs to improve performance
 */
export async function syncFromDocs(docs: any[]): Promise<void> {
  if (!docs || !Array.isArray(docs) || docs.length === 0) {
    return
  }

  for (const doc of docs) {
    // Skip invalid documents silently
    if (!doc || !doc.doctype || !doc.name) {
      continue
    }
    await updateDocumentInCachesAndNotify(doc.doctype, doc)
  }
}

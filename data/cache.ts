import { get, set, del, clear, entries } from 'idb-keyval'

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await get<T>(key)
    return value ?? null
  } catch (e) {
    console.error('Failed to get cache:', e)
    return null
  }
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  try {
    await set(key, value)
  } catch (e) {
    console.error('Failed to set cache:', e)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await del(key)
  } catch (e) {
    console.error('Failed to delete cache:', e)
  }
}

export async function clearCache(): Promise<void> {
  try {
    await clear()
  } catch (e) {
    console.error('Failed to clear cache:', e)
  }
}

export async function getCacheEntries(): Promise<[IDBValidKey, any][]> {
  try {
    return await entries()
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

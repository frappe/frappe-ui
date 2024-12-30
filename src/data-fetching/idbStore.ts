import { get, set, del, setMany, keys } from 'idb-keyval'

export class IDBStore {
  private memoryStore: Record<string, string> = {}
  private useIndexedDB: boolean

  constructor() {
    this.useIndexedDB = typeof window !== 'undefined' && !!window.indexedDB
  }

  set(key: string, data: unknown): Promise<void | null> {
    if (!this.validateKey(key)) {
      return Promise.resolve(null)
    }

    try {
      if (this.useIndexedDB) {
        return set(key, JSON.stringify(data))
      }
      this.memoryStore[key] = JSON.stringify(data)
      return Promise.resolve()
    } catch (error) {
      return this.handleError(error, 'save to')
    }
  }

  setMany(data: Record<string, unknown>): Promise<void | null> {
    try {
      if (this.useIndexedDB) {
        let entries: [IDBValidKey, any][] = []
        for (const [key, value] of Object.entries(data)) {
          entries.push([key, JSON.stringify(value)])
        }
        return setMany(entries)
      }
      for (const [key, value] of Object.entries(data)) {
        this.memoryStore[key] = JSON.stringify(value)
      }
      return Promise.resolve()
    } catch (error) {
      return this.handleError(error, 'save to')
    }
  }

  delete(key: string): Promise<void | null> {
    if (!this.validateKey(key)) {
      return Promise.resolve(null)
    }

    try {
      if (this.useIndexedDB) {
        return del(key)
      }
      delete this.memoryStore[key]
      return Promise.resolve()
    } catch (error) {
      return this.handleError(error, 'delete from')
    }
  }

  get(key: string): Promise<unknown | null> {
    if (!this.validateKey(key)) {
      return Promise.resolve(null)
    }

    if (this.useIndexedDB) {
      return get(key).then((val) => {
        if (!val) return null
        try {
          return JSON.parse(val)
        } catch (error) {
          return this.handleError(error, 'parse data from')
        }
      })
    }

    try {
      const val = this.memoryStore[key]
      return Promise.resolve(val ? JSON.parse(val) : null)
    } catch (error) {
      return this.handleError(error, 'parse data from')
    }
  }

  async keys(): Promise<string[]> {
    try {
      if (this.useIndexedDB) {
        return keys() as Promise<string[]>
      }
      return Promise.resolve(Object.keys(this.memoryStore))
    } catch (error) {
      console.error(
        `Failed to get keys from ${this.useIndexedDB ? 'IndexedDB' : 'memory store'}:`,
        error,
      )
      return Promise.resolve([])
    }
  }

  private validateKey(key: string): boolean {
    return !!key
  }

  private handleError(error: unknown, operation: string): Promise<null> {
    console.error(
      `Failed to ${operation} ${this.useIndexedDB ? 'IndexedDB' : 'memory store'}:`,
      error,
    )
    return Promise.resolve(null)
  }
}

export let idbStore = new IDBStore()

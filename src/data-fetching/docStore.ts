import { Ref, ref, MaybeRefOrGetter, toValue } from 'vue'
import { idbStore } from './idbStore'

type Doc = {
  doctype: string
  name: string
  [key: string]: any
}

type DocKey = `${string}/${string}`

class DocStore {
  private docs: Map<DocKey, Ref<Doc | null>>
  private lastFetched: Map<DocKey, number>
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes
  private storePrefix = 'doc:'

  constructor() {
    this.docs = new Map<DocKey, Ref<Doc | null>>()
    this.lastFetched = new Map()
  }

  setCacheTimeout(minutes: number) {
    if (minutes < 1) {
      throw new Error('Cache timeout must be at least 1 minute')
    }
    this.cacheTimeout = minutes * 60 * 1000
  }

  async setDoc(doc: Doc) {
    if (!doc?.doctype || !doc?.name) {
      throw new Error('Invalid doc: must have doctype and name')
    }
    doc.name = doc.name.toString()
    const key = this.getKey(doc.doctype, doc.name)
    try {
      await idbStore.set(this.storePrefix + key, doc)
      if (!this.docs.has(key)) {
        this.docs.set(key, ref(null))
      }
      // Mark fresh BEFORE assigning the ref. Assigning docRef.value synchronously
      // re-runs any computed reading this doc (e.g. useDoc's `doc`), which calls
      // getDoc again — if the entry still looked stale at that point it would kick
      // off a needless reload that evicts the IDB copy we just wrote.
      this.lastFetched.set(key, Date.now())
      const docRef = this.docs.get(key)
      if (docRef) {
        docRef.value = doc
      }
    } catch (error) {
      console.error('Failed to set doc in IDB:', error)
      throw error
    }
  }

  getDoc(
    doctype: string,
    name: MaybeRefOrGetter<string>,
    transform?: (doc: Doc) => Doc,
  ): Ref<Doc | null> {
    const nameStr = toValue(name)?.trim()
    if (!doctype || !nameStr) {
      throw new Error('doctype and name are required')
    }
    const key = this.getKey(doctype, nameStr)

    if (!this.docs.has(key)) {
      this.docs.set(key, ref(null))
      this.loadDoc(key, true, transform)
    } else if (this.isStale(key)) {
      this.loadDoc(key, false, transform)
    }

    return this.docs.get(key)!
  }

  private async loadDoc(
    key: DocKey,
    isFirstLoad: boolean,
    transform?: (doc: Doc) => Doc,
  ) {
    try {
      if (!isFirstLoad && this.isStale(key)) {
        // Evict the stale IDB copy and clear the timestamp so the next read
        // reloads — but DON'T delete the in-memory ref (as cleanup() does).
        // getDoc() returns this ref synchronously and its caller (useDoc's `doc`
        // computed) dereferences it immediately; cleanup() deletes the map entry
        // on its first synchronous line, so a stale-but-present key would make
        // getDoc's `return this.docs.get(key)` yield undefined and crash the
        // computed on `.value`. This is reachable for any doc accessed after it
        // goes stale (a long-lived useDoc re-evaluated past the cache timeout).
        this.lastFetched.delete(key)
        await idbStore.delete(this.storePrefix + key)
      }

      const idbDoc = (await idbStore.get(this.storePrefix + key)) as Doc | null
      if (idbDoc) {
        const docRef = this.docs.get(key)
        if (docRef) {
          if (transform) {
            docRef.value = transform(idbDoc)
          } else {
            docRef.value = idbDoc
          }
        }
        this.lastFetched.set(key, Date.now())
      }
    } catch (error) {
      console.error('Failed to load doc from IDB:', error)
      throw error
    }
  }

  async setDocs(docs: Doc[]) {
    const docMap: Record<string, Doc> = {}
    for (const doc of docs) {
      if (!doc?.doctype || !doc?.name) continue
      doc.name = doc.name.toString()
      const key = this.getKey(doc.doctype, doc.name)
      if (!this.docs.has(key)) {
        this.docs.set(key, ref(null))
      }
      const docRef = this.docs.get(key)
      if (docRef) {
        docRef.value = doc
      }
      this.lastFetched.set(key, Date.now())
      docMap[this.storePrefix + key] = doc
    }
    await idbStore.setMany(docMap)
  }

  async invalidateDoc(doctype: string, name: string) {
    if (!doctype || !name) return
    const key = this.getKey(doctype, name)
    await this.cleanup(key)
  }

  removeDoc(doctype: string, name: string) {
    return this.invalidateDoc(doctype, name)
  }

  private getKey(doctype: string, name: string): DocKey {
    return `${doctype.trim()}/${name.trim()}` as DocKey
  }

  private isStale(key: DocKey): boolean {
    const fetchTime = this.lastFetched.get(key)
    if (!fetchTime) return true
    return Date.now() - fetchTime > this.cacheTimeout
  }

  private async cleanup(key: DocKey) {
    this.docs.delete(key)
    this.lastFetched.delete(key)
    await idbStore.delete(this.storePrefix + key)
  }

  async clearAll() {
    try {
      const allKeys = await idbStore.keys()
      const docKeys = allKeys.filter((key: string) =>
        key.startsWith(this.storePrefix),
      )
      await Promise.all(docKeys.map((key: string) => idbStore.delete(key)))
      this.docs.clear()
      this.lastFetched.clear()
    } catch (error) {
      console.error('Failed to clear all docs:', error)
      throw error
    }
  }
}

export const docStore = new DocStore()

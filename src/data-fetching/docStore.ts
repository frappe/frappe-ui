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
  private revisions: Map<DocKey, number>
  private inflight: Map<DocKey, Promise<void>>
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes
  private storePrefix = 'doc:'

  constructor() {
    this.docs = new Map<DocKey, Ref<Doc | null>>()
    this.lastFetched = new Map()
    this.revisions = new Map()
    this.inflight = new Map()
  }

  /**
   * The single place a doc is assigned into its ref.
   *
   * A key is published twice by design — once from the IndexedDB cache, once
   * from the server (stale-while-revalidate). Each publish bumps a per-key
   * revision so a slow cached read can tell it has been overtaken and skip its
   * write. The invariant: `docRef.value` never moves backwards in time.
   */
  private publish(key: DocKey, doc: Doc) {
    if (!this.docs.has(key)) {
      this.docs.set(key, ref(null))
    }
    // Mark fresh BEFORE assigning the ref. Assigning docRef.value synchronously
    // re-runs any computed reading this doc (e.g. useDoc's `doc`), which calls
    // getDoc again — if the entry still looked stale at that point it would kick
    // off a needless reload that evicts the IDB copy we just wrote.
    this.lastFetched.set(key, Date.now())
    this.revisions.set(key, (this.revisions.get(key) ?? 0) + 1)
    this.docs.get(key)!.value = doc
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
    // Publish before persisting, the way setDocs already does. Awaiting the
    // write first would leave readers on stale data for the length of an IDB
    // round trip, and widen the window a cached read can land in.
    this.publish(key, doc)
    try {
      await idbStore.set(this.storePrefix + key, doc)
    } catch (error) {
      console.error('Failed to set doc in IDB:', error)
      throw error
    }
  }

  /**
   * The store holds docs exactly as the server sent them. Callers that need a
   * `transform` apply it when they read (see useDoc), so a non-idempotent
   * transform cannot compound across the cached and fresh publishes.
   */
  getDoc(
    doctype: string,
    name: MaybeRefOrGetter<string>,
    options: { staleOnError?: boolean } = {},
  ): Ref<Doc | null> {
    const nameStr = toValue(name)?.trim()
    if (!doctype || !nameStr) {
      throw new Error('doctype and name are required')
    }
    const key = this.getKey(doctype, nameStr)

    if (!this.docs.has(key)) {
      this.docs.set(key, ref(null))
      this.loadDoc(key, true, options)
    } else if (this.isStale(key)) {
      this.loadDoc(key, false, options)
    }

    return this.docs.get(key)!
  }

  private loadDoc(
    key: DocKey,
    isFirstLoad: boolean,
    options: { staleOnError?: boolean } = {},
  ): Promise<void> {
    // Every computed reading this doc calls getDoc, so several readers can ask
    // for the same key in one tick. Without this, each starts its own read and
    // each is free to assign.
    const existing = this.inflight.get(key)
    if (existing) return existing

    const load = this.readFromCache(key, isFirstLoad, options)
      .catch((error) => {
        // Nothing awaits this — getDoc fires it and returns the ref straight
        // away — so re-throwing would surface as an unhandled rejection.
        console.error('Failed to load doc from IDB:', error)
      })
      .finally(() => {
        if (this.inflight.get(key) === load) {
          this.inflight.delete(key)
        }
      })

    this.inflight.set(key, load)
    return load
  }

  private async readFromCache(
    key: DocKey,
    isFirstLoad: boolean,
    options: { staleOnError?: boolean } = {},
  ) {
    // Snapshot before awaiting. Anything published while this read is in flight
    // is newer than what the read is about to return.
    const revisionAtStart = this.revisions.get(key) ?? 0

    if (!isFirstLoad && this.isStale(key)) {
      this.lastFetched.delete(key)
      if (!options.staleOnError) {
        // Keep the IDB copy only when callers explicitly opt into stale
        // read-only fallback, such as offline-capable routes.
        await idbStore.delete(this.storePrefix + key)
      }
    }

    const idbDoc = (await idbStore.get(this.storePrefix + key)) as Doc | null
    if (!idbDoc) return
    if ((this.revisions.get(key) ?? 0) !== revisionAtStart) return

    this.publish(key, idbDoc)
  }

  async setDocs(docs: Doc[]) {
    const docMap: Record<string, Doc> = {}
    for (const doc of docs) {
      if (!doc?.doctype || !doc?.name) continue
      doc.name = doc.name.toString()
      const key = this.getKey(doc.doctype, doc.name)
      this.publish(key, doc)
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
    this.revisions.delete(key)
    this.inflight.delete(key)
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
      this.revisions.clear()
      this.inflight.clear()
    } catch (error) {
      console.error('Failed to clear all docs:', error)
      throw error
    }
  }
}

export const docStore = new DocStore()

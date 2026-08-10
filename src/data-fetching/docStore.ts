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
  // Store-wide and only ever incremented. A per-key counter that restarts at 0
  // would let a snapshot taken before a key was cleaned up match the value a
  // later slot starts from, which is how a deleted doc comes back to life.
  private revisionCounter = 0
  // The write gate (#1017). A network write carries the dispatch version of
  // the request that produced it (taken from `nextWriteVersion` when the
  // request is dispatched, not when it settles). The store rejects a write for
  // a document that a later-dispatched request has already written, so two
  // concurrent writes to one document always land on the newer one — no
  // matter which composable instance or channel (docs side channel, hook)
  // carried them. A version is recorded only when a MUTATING write lands:
  // a later-dispatched request that failed wrote nothing on the server, so
  // it must not gate out an older success — and a read (GET) is not an
  // ordered write at all. The server may answer a later-dispatched read
  // before an earlier save commits, so a read is admitted on its version but
  // records nothing, or it would gate the save's response out for good.
  // Grows like `revisions`: one number per document ever written, cleared
  // with `clearAll`.
  private writeVersions: Map<DocKey, number>
  // Ambient version for hooks: `useCall` runs its `onSuccess` inside
  // `runWithWriteVersion`, so store writes made synchronously from a hook are
  // versioned without threading a parameter through every hook signature.
  private currentWrite: { version: number; record: boolean } | null = null
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes
  private storePrefix = 'doc:'

  constructor() {
    this.docs = new Map<DocKey, Ref<Doc | null>>()
    this.lastFetched = new Map()
    this.revisions = new Map()
    this.inflight = new Map()
    this.writeVersions = new Map()
  }

  /**
   * Take a dispatch version for a write. Called when a request is dispatched;
   * the number rides along and is handed back to `setDoc`/`setDocs` when the
   * response writes the store. Shares `revisionCounter`, so versions and
   * publish revisions never collide on monotonicity.
   */
  nextWriteVersion(): number {
    return ++this.revisionCounter
  }

  /**
   * Run `fn` with `version` as the ambient write version for store writes.
   * `record` says whether the request that produced the response mutates the
   * server (anything but GET): only those writes record their version.
   *
   * The ambient version is synchronous: a hook that writes the store after an
   * `await` runs outside it, and that write is unversioned — always admitted,
   * never recorded. Consumer hooks must write the stores before any `await`.
   */
  runWithWriteVersion<T>(
    version: number | undefined,
    record: boolean,
    fn: () => T,
  ): T {
    const previous = this.currentWrite
    this.currentWrite = version != null ? { version, record } : null
    try {
      return fn()
    } finally {
      this.currentWrite = previous
    }
  }

  /**
   * Whether a write at `version` may land on this document — no
   * later-dispatched request has written it. Pure check, records nothing;
   * `listStore` uses it to drop stale row updates. An unversioned write
   * (no argument, no ambient version) is always admitted: it did not come
   * from a dispatched request, so there is no order to compare.
   */
  admitsWrite(doctype: string, name: string, version?: number): boolean {
    const v = version ?? this.currentWrite?.version
    if (v == null) return true
    const key = this.getKey(doctype, String(name))
    return v >= (this.writeVersions.get(key) ?? 0)
  }

  /**
   * `admitsWrite` plus recording: a landed mutating write makes older writes
   * stale. A read (`record: false`) is admitted on its version but records
   * nothing — see the `writeVersions` comment.
   */
  private admitAndRecord(
    key: DocKey,
    write: { version: number; record: boolean } | null,
  ): boolean {
    if (write == null) return true
    if (write.version < (this.writeVersions.get(key) ?? 0)) return false
    if (write.record) this.writeVersions.set(key, write.version)
    return true
  }

  /**
   * The single place a doc is assigned into its ref.
   *
   * A key is published twice by design — once from the IndexedDB cache, once
   * from the server (stale-while-revalidate). Each publish takes the next
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
    this.revisions.set(key, ++this.revisionCounter)
    this.docs.get(key)!.value = doc
  }

  setCacheTimeout(minutes: number) {
    if (minutes < 1) {
      throw new Error('Cache timeout must be at least 1 minute')
    }
    this.cacheTimeout = minutes * 60 * 1000
  }

  async setDoc(doc: Doc, version?: number, record = true) {
    if (!doc?.doctype || !doc?.name) {
      throw new Error('Invalid doc: must have doctype and name')
    }
    doc.name = doc.name.toString()
    const key = this.getKey(doc.doctype, doc.name)
    // A stale write is dropped whole: no publish, no IDB write — persisting
    // it would hand the stale doc right back on the next cached read.
    const write = version != null ? { version, record } : this.currentWrite
    if (!this.admitAndRecord(key, write)) return
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
    //
    // Keyed on the document alone, so the first caller's `staleOnError` decides
    // whether the IDB copy survives this round. Two useDocs on one document with
    // different values for it is not a case worth splitting the read for: they
    // share the ref either way, and the loser only sees the cached copy kept or
    // dropped one cycle earlier than it asked for.
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
    // is newer than what the read is about to return. `undefined` is a value in
    // its own right here: it means nothing has ever been published for this key,
    // and cleanup() replaces it with a number rather than clearing it.
    const revisionAtStart = this.revisions.get(key)

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
    // A read only ever writes into a slot that still exists. The read was issued
    // before any delete that has since happened, so it still answers with the
    // deleted row — publishing it would re-create the entry.
    if (!this.docs.has(key)) return
    if (this.revisions.get(key) !== revisionAtStart) return

    this.publish(key, idbDoc)
  }

  async setDocs(docs: Doc[], version?: number, record = true) {
    const write = version != null ? { version, record } : this.currentWrite
    const docMap: Record<string, Doc> = {}
    for (const doc of docs) {
      if (!doc?.doctype || !doc?.name) continue
      doc.name = doc.name.toString()
      const key = this.getKey(doc.doctype, doc.name)
      // Stale per document, not per response: one response can carry a fresh
      // doc next to one that a later-dispatched request already wrote.
      if (!this.admitAndRecord(key, write)) continue
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
    this.inflight.delete(key)
    // Bumped, not deleted. A delete is an event reads in flight have to notice,
    // and clearing the entry would hand the next slot a revision an older read
    // still matches.
    this.revisions.set(key, ++this.revisionCounter)
    // A delete is a write, and it records a FRESH number, not its dispatch
    // version: a delete becomes true when it settles. Any write already in
    // flight — dispatched before or after the delete — must have been
    // committed by the server before the delete to have succeeded, so its
    // response is dead data and must not re-create the document. The same
    // stamp covers a racing reload answered before the delete committed.
    // Anything dispatched after this point takes a higher number and is
    // admitted. The delete itself is never gated — a delete that succeeded
    // is truthful whatever the dispatch order. `max`: the record only ever
    // moves forward.
    this.writeVersions.set(
      key,
      Math.max(this.writeVersions.get(key) ?? 0, ++this.revisionCounter),
    )
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
      this.writeVersions.clear()
    } catch (error) {
      console.error('Failed to clear all docs:', error)
      throw error
    }
  }
}

export const docStore = new DocStore()

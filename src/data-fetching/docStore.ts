import { Ref, ref, MaybeRefOrGetter, toValue } from 'vue'
import { idbStore } from './idbStore'
import { docKey, writeGate, type DocKey, type WriteStamp } from './writeGate'

type Doc = {
  doctype: string
  name: string
  [key: string]: any
}

class DocStore {
  private docs: Map<DocKey, Ref<Doc | null>>
  private lastFetched: Map<DocKey, number>
  private revisions: Map<DocKey, number>
  private inflight: Map<DocKey, Promise<void>>
  // Publish revisions, not the write gate: this orders the two publishes a key
  // gets per round (IndexedDB copy, then server copy) so a slow cached read can
  // tell it has been overtaken. Freshness across REQUESTS is `writeGate`'s job,
  // and the two counters stay separate because they answer different questions
  // — this one moves on every publish, including ones the gate never saw.
  //
  // Store-wide and only ever incremented. A per-key counter that restarts at 0
  // would let a snapshot taken before a key was cleaned up match the value a
  // later slot starts from, which is how a deleted doc comes back to life.
  private revisionCounter = 0
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

  /**
   * `stamp` is required, and there is no default. Every store write has to
   * say which request it came from — or say `LOCAL_WRITE` and mean it. A
   * future write site cannot forget the gate; it cannot compile without
   * answering the question.
   */
  async setDoc(doc: Doc, stamp: WriteStamp) {
    if (!doc?.doctype || !doc?.name) {
      throw new Error('Invalid doc: must have doctype and name')
    }
    doc.name = doc.name.toString()
    const key = docKey(doc.doctype, doc.name)
    // A stale write is dropped whole: no publish, no IDB write — persisting
    // it would hand the stale doc right back on the next cached read.
    if (!writeGate.admit(key, stamp)) return
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

  /** Same rule as `setDoc`: the stamp is required, per response. */
  async setDocs(docs: Doc[], stamp: WriteStamp) {
    const docMap: Record<string, Doc> = {}
    for (const doc of docs) {
      if (!doc?.doctype || !doc?.name) continue
      doc.name = doc.name.toString()
      const key = docKey(doc.doctype, doc.name)
      // Stale per document, not per response: one response can carry a fresh
      // doc next to one that a later-dispatched request already wrote.
      if (!writeGate.admit(key, stamp)) continue
      this.publish(key, doc)
      docMap[this.storePrefix + key] = doc
    }
    await idbStore.setMany(docMap)
  }

  /**
   * Drop the local copy of a document the server still has (a broken cached
   * doc, say). Unlike `removeDoc` it records nothing: an in-flight write may
   * settle after the invalidation and repopulate the store — that response
   * is still the server's truth.
   */
  async invalidateDoc(doctype: string, name: string) {
    if (!doctype || !name) return
    await this.cleanup(docKey(doctype, name))
  }

  /**
   * The document is deleted on the server. Takes no stamp: a delete that
   * succeeded is truthful whatever the dispatch order, so it is never gated —
   * it SEALS the key instead, rejecting every write still in flight for it
   * (see `writeGate.seal`).
   */
  removeDoc(doctype: string, name: string) {
    if (doctype && name) {
      writeGate.seal(docKey(doctype, name))
    }
    return this.invalidateDoc(doctype, name)
  }

  private getKey(doctype: string, name: string): DocKey {
    return docKey(doctype, name)
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
    // The gate is not sealed here: cleanup serves invalidation too, and an
    // invalidated doc still exists on the server — an in-flight write must
    // stay admitted. Sealing for a real delete lives in `removeDoc`.
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
      writeGate.clear()
    } catch (error) {
      console.error('Failed to clear all docs:', error)
      throw error
    }
  }
}

export const docStore = new DocStore()

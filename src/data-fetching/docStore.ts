import { Ref, ref, MaybeRefOrGetter, toValue } from 'vue'
import { idbStore } from './idbStore'

type Doc = {
  doctype: string
  name: string
  [key: string]: any
}

type DocKey = `${string}/${string}`

// Reserved key for the last-seen namespace record — not a `doc:`-prefixed
// entry, so it never turns up in a scan for actual document keys (clearAll,
// purgeStoredNamespace) and a doctype can never collide with it.
const NAMESPACE_META_KEY = 'docStore:lastNamespace'

export class DocStore {
  private docs: Map<DocKey, Ref<Doc | null>>
  private lastFetched: Map<DocKey, number>
  private revisions: Map<DocKey, number>
  private inflight: Map<DocKey, Promise<void>>
  // Store-wide and only ever incremented. A per-key counter that restarts at 0
  // would let a snapshot taken before a key was cleaned up match the value a
  // later slot starts from, which is how a deleted doc comes back to life.
  private revisionCounter = 0
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes
  private storePrefix = 'doc:'
  // Prefixes every key with the signed-in user, read once at construction
  // from the `user_id` cookie every logged-in Frappe session already carries
  // — no app wiring required. `null` (Guest, no cookie, or SSR) keeps keys
  // exactly `doctype/name`, unchanged from before namespacing existed.
  private namespace: string | null

  constructor() {
    this.docs = new Map<DocKey, Ref<Doc | null>>()
    this.lastFetched = new Map()
    this.revisions = new Map()
    this.inflight = new Map()
    this.namespace = this.readCookieNamespace()
    // Fire-and-forget: `this.namespace` above is set synchronously, so every
    // key computed this tick or later already reflects it. Only the IDB
    // reconciliation against the previous page load's namespace — and the
    // purge it may trigger — trails behind.
    this.reconcileNamespace().catch((error) => {
      console.error('Failed to reconcile doc cache namespace:', error)
    })
  }

  /**
   * Reads the standard Frappe session cookie `user_id`, the same cookie every
   * logged-in Frappe app already sets — nothing for an app to configure.
   * `undefined` (SSR, or a test environment with no DOM), a missing cookie,
   * and an explicit `Guest` value all resolve to `null`, matching today's
   * unnamespaced behavior for a signed-out visitor.
   */
  private readCookieNamespace(): string | null {
    if (typeof document === 'undefined' || !document.cookie) return null
    for (const pair of document.cookie.split(';')) {
      const eq = pair.indexOf('=')
      if (eq === -1) continue
      if (pair.slice(0, eq).trim() !== 'user_id') continue
      const raw = pair.slice(eq + 1).trim()
      let value: string
      try {
        value = decodeURIComponent(raw)
      } catch {
        value = raw
      }
      value = value.trim()
      return value && value !== 'Guest' ? value : null
    }
    return null
  }

  /**
   * Namespace changes are only ever detected here, at construction — there is
   * no live cookie watcher. In practice that's fine: a Frappe login/logout
   * flow reloads the document, which re-runs this module and constructs a
   * fresh store. An app that somehow swaps the session user without a reload
   * would not see the new namespace take effect until the next load.
   *
   * Compares the freshly-read namespace against the one recorded in IDB from
   * the last time this ran. Purging only fires when both are non-null and
   * differ — a real account handoff. Guest/no-cookie loads (`current` is
   * null) never touch the record at all, so an intervening logged-out page
   * load can't erase the trail: the next real login is still compared
   * against the last account that was actually signed in, not against
   * whatever happened in between.
   */
  private async reconcileNamespace() {
    const current = this.namespace
    if (!current) return
    const stored = (await idbStore.get(NAMESPACE_META_KEY)) as string | null
    if (stored === current) return
    if (stored) {
      // A different account was signed in as of the last page load. Purge it
      // now rather than let it sit in IDB indefinitely — a shared browser
      // should not keep accumulating every past account's cached docs.
      await this.purgeStoredNamespace(stored)
    }
    await idbStore.set(NAMESPACE_META_KEY, current)
  }

  private async purgeStoredNamespace(namespace: string) {
    // The in-memory `docs` map is always empty this early — this runs from
    // the constructor, before any getDoc/setDoc call populates it — so the
    // outgoing namespace's keys can only be found by scanning IDB directly,
    // the same way clearAll() does.
    const prefix = this.storePrefix + this.namespacePrefix(namespace)
    const allKeys = await idbStore.keys()
    const matching = allKeys.filter((key: string) => key.startsWith(prefix))
    await Promise.all(matching.map((key: string) => idbStore.delete(key)))
  }

  private namespacePrefix(namespace: string | null): string {
    return namespace ? `${namespace}::` : ''
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
    return `${this.namespacePrefix(this.namespace)}${doctype.trim()}/${name.trim()}` as DocKey
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
    await idbStore.delete(this.storePrefix + key)
  }

  async clearAll() {
    try {
      const allKeys = await idbStore.keys()
      const docKeys = allKeys.filter((key: string) =>
        key.startsWith(this.storePrefix),
      )
      await Promise.all(docKeys.map((key: string) => idbStore.delete(key)))
      await idbStore.delete(NAMESPACE_META_KEY)
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

// The package's one DocStore instance. Not part of the public surface — there
// is no app-facing API for this store at all. useDoc, useNewDoc, useDoctype
// and useList reach it with a relative import; every doc it caches is
// automatically scoped to whichever `user_id` cookie was present when this
// module first ran (see the constructor / readCookieNamespace above), so
// there is nothing for an app to call or configure.
export const docStore = new DocStore()

/**
 * @vitest-environment node
 */
import { computed, watchSyncEffect } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { docStore } from './docStore'
import { LOCAL_WRITE } from './writeGate'
import { idbStore } from './idbStore'

const DOCTYPE = 'User'

function idbKey(name: string) {
  return `doc:${DOCTYPE}/${name}`
}

/** A promise whose settlement the test controls, to hold an IDB call open. */
function defer<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

/** Let every pending microtask chain inside docStore run to completion. */
function flush() {
  return new Promise((r) => setTimeout(r, 0))
}

/** Push an entry past the cache timeout, as a long-lived useDoc would be. */
function makeStale(name: string) {
  ;(
    docStore as unknown as { lastFetched: Map<string, number> }
  ).lastFetched.set(`${DOCTYPE}/${name}`, Date.now() - 10 * 60 * 1000)
}

/** Whether the store holds a slot for this key at all. */
function hasSlot(name: string) {
  return (docStore as unknown as { docs: Map<string, unknown> }).docs.has(
    `${DOCTYPE}/${name}`,
  )
}

/**
 * Mirror useDoc's `doc` computed: it calls getDoc and dereferences the returned
 * ref *without* optional chaining, so a getDoc that returns undefined throws.
 * A synchronous watcher reproduces the in-browser render effect that re-runs
 * this computed the instant setDoc assigns the ref — the trigger for the crash.
 */
function subscribeLikeUseDoc(name: string) {
  const doc = computed(() => docStore.getDoc(DOCTYPE, name).value)
  const seen: unknown[] = []
  const stop = watchSyncEffect(() => {
    seen.push(doc.value)
  })
  return { doc, seen, stop }
}

describe('docStore', () => {
  beforeEach(async () => {
    await docStore.clearAll()
  })
  afterEach(async () => {
    // Restore first: a spy left in place by a failing assertion would hang the
    // next test on an idbStore call that never settles.
    vi.restoreAllMocks()
    await docStore.clearAll()
  })

  it('first uncached load: setDoc does not crash a synchronously-tracked reader and keeps the IDB copy', async () => {
    const name = 'user1'
    const { doc, stop } = subscribeLikeUseDoc(name)
    // Nothing cached yet.
    expect(doc.value).toBe(null)

    const record = { doctype: DOCTYPE, name, email: 'user1@example.com' }
    // Regression: before the fix this rejects. Assigning docRef.value synchronously
    // re-enters getDoc, which (lastFetched unset) saw the entry as stale, evicted
    // the ref it had just created, and the reader dereferenced undefined.
    await expect(
      docStore.setDoc({ ...record }, LOCAL_WRITE),
    ).resolves.toBeUndefined()

    expect(doc.value).toMatchObject(record)
    // The IDB copy setDoc wrote must survive — no spurious stale-reload eviction.
    expect(await idbStore.get(idbKey(name))).toMatchObject(record)
    stop()
  })

  it('stale access: getDoc never returns undefined (no self-eviction under its caller)', async () => {
    const name = 'user2'
    const record = { doctype: DOCTYPE, name }
    await docStore.setDoc({ ...record }, LOCAL_WRITE)

    makeStale(name)

    const ref = docStore.getDoc(DOCTYPE, name, { staleOnError: true })
    expect(ref).toBeDefined()
    expect(() => ref.value).not.toThrow()
    expect(ref.value).toMatchObject(record)
    expect(await idbStore.get(idbKey(name))).toMatchObject(record)
  })

  it('a slow cached read never overwrites a newer publish', async () => {
    const name = 'user3'
    const stale = { doctype: DOCTYPE, name, bio: 'stale' }
    const fresh = { doctype: DOCTYPE, name, bio: 'fresh' }
    await idbStore.set(idbKey(name), stale)

    // Hold the cached read open so the fresh copy lands first.
    const cachedRead = defer<unknown>()
    const getSpy = vi.spyOn(idbStore, 'get').mockReturnValue(cachedRead.promise)

    const { doc, seen, stop } = subscribeLikeUseDoc(name)
    expect(doc.value).toBe(null)

    await docStore.setDoc({ ...fresh }, LOCAL_WRITE)
    expect(doc.value).toMatchObject(fresh)

    cachedRead.resolve(stale)
    await flush()

    // docRef.value must never move backwards in time.
    expect(doc.value).toMatchObject(fresh)
    expect(seen).not.toContainEqual(expect.objectContaining({ bio: 'stale' }))

    getSpy.mockRestore()
    stop()
  })

  it('concurrent reads of one stale key hit IDB once', async () => {
    const name = 'user4'
    await docStore.setDoc({ doctype: DOCTYPE, name }, LOCAL_WRITE)
    makeStale(name)

    const getSpy = vi.spyOn(idbStore, 'get')
    for (let i = 0; i < 5; i++) {
      docStore.getDoc(DOCTYPE, name, { staleOnError: true })
    }
    await flush()

    expect(getSpy).toHaveBeenCalledTimes(1)
    getSpy.mockRestore()
  })

  it('setDoc publishes before the IDB write settles', async () => {
    const name = 'user5'
    const record = { doctype: DOCTYPE, name, bio: 'written' }

    const write = defer<void>()
    const setSpy = vi.spyOn(idbStore, 'set').mockReturnValue(write.promise)

    const pending = docStore.setDoc({ ...record }, LOCAL_WRITE)
    // Readers see the new value even while the write is in flight — and even if
    // it never lands. Matches setDocs, which already assigns before writing.
    expect(docStore.getDoc(DOCTYPE, name).value).toMatchObject(record)

    write.resolve()
    await pending
    setSpy.mockRestore()
  })

  it('publishes the cached doc raw: the store applies no transform', async () => {
    const name = 'user6'
    const cached = { doctype: DOCTYPE, name, count: 0 }
    await idbStore.set(idbKey(name), cached)

    const ref = docStore.getDoc(DOCTYPE, name)
    await flush()

    // Callers apply transform on read (useDoc does). If the store transformed
    // too, a non-idempotent transform would compound across the two publishes,
    // so the cached and fresh copies would carry different values.
    expect(ref.value).toStrictEqual(cached)
  })

  it('a read in flight when the doc is deleted does not bring it back', async () => {
    const name = 'user7'
    const record = { doctype: DOCTYPE, name }
    await idbStore.set(idbKey(name), record)

    const cachedRead = defer<unknown>()
    vi.spyOn(idbStore, 'get').mockReturnValue(cachedRead.promise)

    const ref = docStore.getDoc(DOCTYPE, name)
    await docStore.removeDoc(DOCTYPE, name)

    // The read was issued before the delete, so it still answers with the row.
    cachedRead.resolve(record)
    await flush()

    expect(ref.value).toBe(null)
    // Publishing would re-create the slot the delete removed.
    expect(hasSlot(name)).toBe(false)
  })

  it('a read in flight when the doc is deleted does not land in a later slot', async () => {
    const name = 'user8'
    const deleted = { doctype: DOCTYPE, name, bio: 'from before the delete' }

    const beforeDelete = defer<unknown>()
    const afterDelete = defer<unknown>()
    vi.spyOn(idbStore, 'get')
      .mockReturnValueOnce(beforeDelete.promise)
      .mockReturnValueOnce(afterDelete.promise)

    docStore.getDoc(DOCTYPE, name)
    await docStore.removeDoc(DOCTYPE, name)

    // Someone asks for the same key again, which opens a fresh slot. The read
    // from before the delete must not be able to write into it, so the revision
    // counter cannot restart when a key is cleaned up.
    const ref = docStore.getDoc(DOCTYPE, name)
    beforeDelete.resolve(deleted)
    await flush()

    expect(ref.value).toBe(null)

    afterDelete.resolve(null)
    await flush()
  })
})

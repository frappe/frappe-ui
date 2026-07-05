/**
 * @vitest-environment node
 */
import { computed, watchSyncEffect } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { docStore } from './docStore'
import { idbStore } from './idbStore'

const DOCTYPE = 'User'
const identity = <T>(d: T): T => d

function idbKey(name: string) {
  return `doc:${DOCTYPE}/${name}`
}

/**
 * Mirror useDoc's `doc` computed: it calls getDoc and dereferences the returned
 * ref *without* optional chaining, so a getDoc that returns undefined throws.
 * A synchronous watcher reproduces the in-browser render effect that re-runs
 * this computed the instant setDoc assigns the ref — the trigger for the crash.
 */
function subscribeLikeUseDoc(name: string) {
  const doc = computed(() => docStore.getDoc(DOCTYPE, name, identity).value)
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
    await expect(docStore.setDoc({ ...record })).resolves.toBeUndefined()

    expect(doc.value).toMatchObject(record)
    // The IDB copy setDoc wrote must survive — no spurious stale-reload eviction.
    expect(await idbStore.get(idbKey(name))).toMatchObject(record)
    stop()
  })

  it('stale access: getDoc never returns undefined (no self-eviction under its caller)', async () => {
    const name = 'user2'
    const record = { doctype: DOCTYPE, name }
    await docStore.setDoc({ ...record })

    // Force the entry past the cache timeout, as a long-lived useDoc would be.
    const key = `${DOCTYPE}/${name}`
    ;(
      docStore as unknown as { lastFetched: Map<string, number> }
    ).lastFetched.set(key, Date.now() - 10 * 60 * 1000)

    const ref = docStore.getDoc(DOCTYPE, name, identity, { staleOnError: true })
    expect(ref).toBeDefined()
    expect(() => ref.value).not.toThrow()
    expect(ref.value).toMatchObject(record)
    expect(await idbStore.get(idbKey(name))).toMatchObject(record)
  })
})

/**
 * @vitest-environment node
 */

import { delay, http, HttpResponse } from 'msw'
import { server } from '../mocks/node'
import { baseUrl, url } from '../mocks/utils'
import { docStore } from './docStore'
import { useDoc } from './useDoc/useDoc'
import { useDoctype } from './useDoctype/useDoctype'
import { useList } from './useList/useList'
import { useNewDoc } from './useNewDoc/useNewDoc'

interface User {
  name: string
  email: string
}

// Cross-instance staleness (#1017): every composable instance used to keep its
// own freshness state, so two instances writing the same document never saw
// each other. The gate now lives in `docStore`: a write carries the dispatch
// version of the request that produced it, and the store rejects a write for a
// document that a later-dispatched request has already written.
//
// The mock server answers slowly when a value starts with `slow`, so the test
// controls which submit settles last. Dispatch order is submit-call order.

function makeList() {
  return useList<User>({
    doctype: 'User',
    baseUrl,
    immediate: false,
    refetch: false,
  })
}

async function seedUser1() {
  await docStore.setDoc({
    doctype: 'User',
    name: 'user1',
    email: 'old@example.com',
  })
}

function storedEmail() {
  return docStore.getDoc('User', 'user1').value?.email
}

describe('cross-instance stale writes: two useList instances', () => {
  // Four orderings: which instance dispatches first x which submit settles
  // first. In every case the store must end on the later-dispatched submit.

  it('first instance dispatches first and settles last', async () => {
    await seedUser1()
    let a = makeList()
    let b = makeList()

    await Promise.all([
      a.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      b.setValue.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('quick-fresh@example.com')
  })

  it('first instance dispatches first and settles first', async () => {
    await seedUser1()
    let a = makeList()
    let b = makeList()

    await Promise.all([
      a.setValue.submit({ name: 'user1', email: 'quick-stale@example.com' }),
      b.setValue.submit({ name: 'user1', email: 'slow-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('slow-fresh@example.com')
  })

  it('second instance dispatches first and settles last', async () => {
    await seedUser1()
    let a = makeList()
    let b = makeList()

    await Promise.all([
      b.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      a.setValue.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('quick-fresh@example.com')
  })

  it('second instance dispatches first and settles first', async () => {
    await seedUser1()
    let a = makeList()
    let b = makeList()

    await Promise.all([
      b.setValue.submit({ name: 'user1', email: 'quick-stale@example.com' }),
      a.setValue.submit({ name: 'user1', email: 'slow-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('slow-fresh@example.com')
  })
})

describe('cross-instance stale writes: useList with useDoctype', () => {
  it('a stale useList setValue does not overwrite a useDoctype setValue', async () => {
    await seedUser1()
    let list = makeList()
    let dt = useDoctype<User>('User', { baseUrl })

    await Promise.all([
      list.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      dt.setValue.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('quick-fresh@example.com')
  })

  it('a stale useDoctype setValue does not overwrite a useList setValue', async () => {
    await seedUser1()
    let list = makeList()
    let dt = useDoctype<User>('User', { baseUrl })

    await Promise.all([
      dt.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      list.setValue.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('quick-fresh@example.com')
  })
})

describe('mixed docs-channel and hook-path stale writes', () => {
  // `runDocMethod update_email` answers with a `docs` array, which the global
  // `afterFetch` pushes into the stores. `setValue` writes through its
  // `onSuccess` hook. The two paths must share one freshness domain.

  it('a stale docs-channel response does not overwrite a hook write', async () => {
    await seedUser1()
    let dt = useDoctype<User>('User', { baseUrl })

    await Promise.all([
      dt.runDocMethod.submit({
        name: 'user1',
        method: 'update_email',
        params: { email: 'slow-stale@example.com' },
      }),
      dt.setValue.submit({ name: 'user1', email: 'quick-fresh@example.com' }),
    ])

    expect(storedEmail()).toBe('quick-fresh@example.com')
  })

  it('a stale hook write does not overwrite a docs-channel response', async () => {
    await seedUser1()
    let dt = useDoctype<User>('User', { baseUrl })

    await Promise.all([
      dt.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      dt.runDocMethod.submit({
        name: 'user1',
        method: 'update_email',
        params: { email: 'quick-fresh@example.com' },
      }),
    ])

    expect(storedEmail()).toBe('quick-fresh@example.com')
  })
})

describe('deletes record a version', () => {
  it('an older in-flight write cannot resurrect a deleted document', async () => {
    await seedUser1()
    let dt = useDoctype<User>('User', { baseUrl })

    // The save is dispatched first and settles last; the delete is dispatched
    // later and lands first. The server ends with the document deleted, so
    // the older save response must not re-create it in the store.
    await Promise.all([
      dt.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
      dt.delete.submit({ name: 'user1' }),
    ])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('a later-dispatched write settling after the delete cannot resurrect it either', async () => {
    await seedUser1()
    let dt = useDoctype<User>('User', { baseUrl })

    // The delete is dispatched first and lands first; the save is dispatched
    // later but settles last. For that save to have succeeded the server must
    // have committed it before the delete, so the server still holds the
    // document deleted — a delete is terminal regardless of dispatch order.
    await Promise.all([
      dt.delete.submit({ name: 'user1' }),
      dt.setValue.submit({ name: 'user1', email: 'slow-stale@example.com' }),
    ])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('a reload racing a delete cannot re-publish the deleted doc', async () => {
    await seedUser1()
    let dt = useDoctype<User>('User', { baseUrl })
    let doc = useDoc<User>({
      doctype: 'User',
      name: 'user1',
      baseUrl,
      immediate: false,
    })

    // The reload is dispatched after the delete but can be answered before
    // the delete commits. Whatever order the two settle in, the document
    // stays deleted.
    await Promise.all([dt.delete.submit({ name: 'user1' }), doc.reload()])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })
})

describe('reads do not record a version', () => {
  it('a reload answered before a slower save commits does not gate the save out', async () => {
    await seedUser1()
    let doc = useDoc<User>({
      doctype: 'User',
      name: 'user1',
      baseUrl,
      immediate: false,
    })

    // The save is dispatched first (slow); the reload is dispatched later and
    // the server answers it before the save commits (the GET mock returns the
    // pre-save email). The read is admitted but must not record: the save is
    // the mutation, and the server's final state holds it.
    let save = doc.setValue.submit({ email: 'slow-fresh@example.com' })
    let read = doc.reload()

    await Promise.all([save, read])

    expect(storedEmail()).toBe('slow-fresh@example.com')
  })
})

describe('invalidation is not a delete', () => {
  it('an in-flight save repopulates the store after a transform-throws eviction', async () => {
    await docStore.setDoc({
      doctype: 'User',
      name: 'user1',
      email: 'poison',
    })
    let doc = useDoc<User>({
      doctype: 'User',
      name: 'user1',
      baseUrl,
      immediate: false,
      transform: (d) => {
        if (d.email === 'poison') throw new Error('bad doc')
        return d
      },
    })

    // The save is in flight when the transform throws and evicts the doc.
    // Eviction invalidates — the server still has the document — so the
    // save's response must land and repopulate the store. Only a real
    // delete records the terminal stamp that rejects in-flight writes.
    // Pin the ordering without wall-clock margins: the fetch wrapper takes
    // the dispatch version right before calling the global fetch, so once
    // the spy has fired, the PUT holds its stamp. Dispatch is a bounded
    // chain of microtasks (the slow mock only delays server-side), so
    // draining them deterministically reaches it.
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    let save = doc.setValue.submit({ email: 'slow-fresh@example.com' })
    for (let i = 0; i < 100 && fetchSpy.mock.calls.length === 0; i++) {
      await Promise.resolve()
    }
    expect(fetchSpy).toHaveBeenCalled()
    fetchSpy.mockRestore()

    expect(doc.doc).toBe(null) // reads the poisoned doc, evicts it
    await save

    expect(storedEmail()).toBe('slow-fresh@example.com')
  })
})

describe('docs channel robustness', () => {
  it('ignores a docs entry without doctype and still lands the response', async () => {
    await seedUser1()
    server.use(
      http.post(url('/api/v2/method/User/mixed_docs'), () =>
        HttpResponse.json({
          data: 'ok',
          docs: [
            // No doctype, or no entry at all: identifies no document, must
            // be skipped — not throw inside the global afterFetch and
            // reject the response.
            null,
            { name: 'orphan' },
            {
              doctype: 'User',
              name: 'user1',
              email: 'mixed-fresh@example.com',
            },
          ],
        }),
      ),
    )
    let dt = useDoctype<User>('User', { baseUrl })

    await expect(dt.runMethod.submit({ method: 'mixed_docs' })).resolves.toBe(
      'ok',
    )
    expect(storedEmail()).toBe('mixed-fresh@example.com')
  })
})

describe('useNewDoc writes are stamped', () => {
  it('a stale earlier-dispatched write cannot overwrite a landed insert', async () => {
    let dt = useDoctype<User>('User', { baseUrl })

    // The setValue is dispatched first (slow); the insert to the same
    // caller-supplied name is dispatched later and lands first. The insert's
    // store write must carry its dispatch stamp and record, so the older
    // response is rejected — before the fix it ran outside the gate.
    let stale = dt.setValue.submit({
      name: 'race-insert',
      email: 'slow-stale@example.com',
    })
    let maker = useNewDoc<User>(
      'User',
      { name: 'race-insert', email: 'inserted@example.com' },
      { baseUrl },
    )
    let created = await maker.submit()
    await stale

    expect(created).toMatchObject({ email: 'inserted@example.com' })
    expect(docStore.getDoc('User', 'race-insert').value?.email).toBe(
      'inserted@example.com',
    )
  })

  it('each caller receives its own document when two instances insert one name', async () => {
    // The standard insert mock delays on `name`, which both instances share
    // here — delay on `email` instead so the older dispatch settles last.
    server.use(
      http.post(url('/api/v2/document/User'), async ({ request }) => {
        let body = (await request.json()) as Record<string, any>
        if (String(body.email).startsWith('slow')) await delay(60)
        return HttpResponse.json({ data: body })
      }),
    )

    // Instance A dispatches first and settles last; instance B's insert
    // lands first and wins the store. A's own write is rejected by the
    // gate — but A's caller must still resolve with A's document, not B's
    // store entry.
    let a = useNewDoc<User>(
      'User',
      { name: 'cross-insert', email: 'slow-a@example.com' },
      { baseUrl },
    )
    let b = useNewDoc<User>(
      'User',
      { name: 'cross-insert', email: 'fast-b@example.com' },
      { baseUrl },
    )

    let submitA = a.submit()
    let submitB = b.submit()
    let [docA, docB] = await Promise.all([submitA, submitB])

    expect(docA).toMatchObject({ email: 'slow-a@example.com' })
    expect(docB).toMatchObject({ email: 'fast-b@example.com' })
    expect(docStore.getDoc('User', 'cross-insert').value?.email).toBe(
      'fast-b@example.com',
    )
  })
})

describe('store gate records on success only', () => {
  it('a newer failed submit does not gate out an older success', async () => {
    await seedUser1()
    let a = makeList()
    let b = makeList()

    // The older submit is slow and succeeds; the newer one (from another
    // instance) fails at once. The failed submit wrote nothing on the server,
    // so the older response is what the server holds — it must land.
    let older = a.setValue.submit({
      name: 'user1',
      email: 'slow-old@example.com',
    })
    let newer = b.setValue.submit({ name: 'user1', email: 'quickfail' })

    await expect(newer).rejects.toThrow('setValue user1 failed')
    await older

    expect(storedEmail()).toBe('slow-old@example.com')
  })
})

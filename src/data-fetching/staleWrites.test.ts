/**
 * @vitest-environment node
 */

import { delay, http, HttpResponse } from 'msw'
import { server } from '../mocks/node'
import { baseUrl, url } from '../mocks/utils'
import { docStore } from './docStore'
import { LOCAL_WRITE } from './writeGate'
import { useDoc } from './useDoc/useDoc'
import { useDoctype } from './useDoctype/useDoctype'
import { useList } from './useList/useList'
import { useNewDoc } from './useNewDoc/useNewDoc'

interface User {
  name: string
  email: string
}

// The stale-write gate (#1017, #1028). Every request takes a sequence number
// when it is dispatched; `docStore` and `listStore` reject a write whose
// sequence is older than the newest already applied for that document. These
// tests enumerate the matrix that gate exists for, rather than one ordering
// per write path:
//
//   1. write path x write path x settle ordering, for the four paths that
//      carry a mutating write into the stores (below);
//   2. the other three write kinds the gate distinguishes — a read (admitted,
//      records nothing), a delete (seals the key), a local write (neither) —
//      each against both settle orderings;
//   3. two submits from ONE instance, where the composable's own newest-wins
//      rule could otherwise decide the store write.
//
// The mock server answers slowly when a value starts with `slow`, so each
// cell controls which of its two writes settles last. Dispatch order is
// pinned by `inDispatchOrder` rather than assumed from call order — the four
// paths do not take the same number of microtasks to reach `fetch`.

function makeList() {
  return useList<User>({
    doctype: 'User',
    baseUrl,
    immediate: false,
    refetch: false,
  })
}

function makeDoc() {
  return useDoc<User>({
    doctype: 'User',
    name: 'user1',
    baseUrl,
    immediate: false,
  })
}

async function seedUser1() {
  await docStore.setDoc(
    {
      doctype: 'User',
      name: 'user1',
      email: 'old@example.com',
    },
    // Not from a dispatched request, so it takes no sequence: seeding must
    // not gate out the writes the test is about.
    LOCAL_WRITE,
  )
}

function storedEmail() {
  return docStore.getDoc('User', 'user1').value?.email
}

/**
 * Call `first`, wait until its request has actually gone out, then call
 * `second`. The sequence is taken inside the fetch wrapper, so once the spy
 * has fired, `first` holds the lower number whatever its composable did on
 * the way there. Dispatch is a bounded chain of microtasks — the mock only
 * delays server-side — so draining them deterministically reaches it.
 */
async function inDispatchOrder(
  first: () => Promise<unknown>,
  second: () => Promise<unknown>,
) {
  const fetchSpy = vi.spyOn(globalThis, 'fetch')
  const older = first()
  for (let i = 0; i < 200 && fetchSpy.mock.calls.length === 0; i++) {
    await Promise.resolve()
  }
  expect(fetchSpy).toHaveBeenCalled()
  fetchSpy.mockRestore()
  const newer = second()
  return [older, newer] as const
}

// The four paths a mutating write reaches the stores by. Each entry builds a
// FRESH composable instance, so pairing a path with itself is the
// cross-instance case (#1017's original report). Every one of them writes
// `docStore` and `listStore` for User/user1.
const writePaths: Record<string, () => (email: string) => Promise<unknown>> = {
  // useAction -> onStoreWrite
  'useList().setValue': () => {
    const list = makeList()
    return (email) => list.setValue.submit({ name: 'user1', email })
  },
  // useAction -> onStoreWrite, a different composable on the same document
  'useDoctype().setValue': () => {
    const dt = useDoctype<User>('User', { baseUrl })
    return (email) => dt.setValue.submit({ name: 'user1', email })
  },
  // useIsolatedCall -> onStoreWrite
  'useDoc().setValue': () => {
    const doc = makeDoc()
    return (email) => doc.setValue.submit({ email })
  },
  // The docs side channel in useFrappeFetch's global afterFetch, which runs
  // before any per-call hook and so cannot be covered by a composable's gate.
  'docs side channel': () => {
    const dt = useDoctype<User>('User', { baseUrl })
    return (email) =>
      dt.runDocMethod.submit({
        name: 'user1',
        method: 'update_email',
        params: { email },
      })
  },
}

const pathNames = Object.keys(writePaths)

// Both settle orderings for one dispatch order. The store must end on the
// later-dispatched write either way — dispatch order is the intent, settle
// order is the network.
const settleOrderings = [
  {
    name: 'older settles last',
    olderEmail: 'slow-stale@example.com',
    newerEmail: 'fresh@example.com',
  },
  {
    name: 'older settles first',
    olderEmail: 'stale@example.com',
    newerEmail: 'slow-fresh@example.com',
  },
] as const

describe('write path x write path x settle ordering', () => {
  // A list holding a user1 row, so every cell asserts the row fan-out too:
  // `listStore.updateRow` asks the same gate `docStore.setDoc` does, and a
  // row left on a stale value is the same bug one level up.
  async function mountListWithUser1() {
    server.use(
      http.get(url('/api/v2/document/User'), () =>
        HttpResponse.json({
          data: [{ name: 'user1', email: 'seed@example.com' }],
        }),
      ),
    )
    const list = makeList()
    await list.reload()
    server.resetHandlers()
    return list
  }

  for (const olderPath of pathNames) {
    for (const newerPath of pathNames) {
      for (const ordering of settleOrderings) {
        it(`${olderPath} then ${newerPath}, ${ordering.name}`, async () => {
          await seedUser1()
          const list = await mountListWithUser1()
          const older = writePaths[olderPath]()
          const newer = writePaths[newerPath]()

          const [a, b] = await inDispatchOrder(
            () => older(ordering.olderEmail),
            () => newer(ordering.newerEmail),
          )
          await Promise.all([a, b])

          expect(storedEmail()).toBe(ordering.newerEmail)
          expect(list.data?.find((row) => row.name === 'user1')?.email).toBe(
            ordering.newerEmail,
          )
        })
      }
    }
  }
})

describe('a read is admitted on its sequence and records nothing', () => {
  // A GET is not an ordered write: the server may answer a later-dispatched
  // read before an earlier save commits. So a read may never make a save
  // stale, and a save always makes an older read stale. Both orderings must
  // end on the save, for every path the save can take.

  function slowRead() {
    server.use(
      http.get(url('/api/v2/document/User/user1'), async () => {
        await delay(60)
        return HttpResponse.json({
          data: { name: 'user1', email: 'read@example.com' },
        })
      }),
    )
  }

  function quickRead() {
    server.use(
      http.get(url('/api/v2/document/User/user1'), () =>
        HttpResponse.json({
          data: { name: 'user1', email: 'read@example.com' },
        }),
      ),
    )
  }

  for (const path of pathNames) {
    it(`read dispatched first and settling last loses to ${path}`, async () => {
      await seedUser1()
      slowRead()
      const doc = makeDoc()
      const save = writePaths[path]()

      const [read, write] = await inDispatchOrder(
        () => doc.reload(),
        () => save('saved@example.com'),
      )
      await Promise.all([read, write])

      expect(storedEmail()).toBe('saved@example.com')
    })

    it(`read dispatched second and settling first does not gate out ${path}`, async () => {
      await seedUser1()
      quickRead()
      const doc = makeDoc()
      const save = writePaths[path]()

      const [write, read] = await inDispatchOrder(
        () => save('slow-saved@example.com'),
        () => doc.reload(),
      )
      await Promise.all([write, read])

      expect(storedEmail()).toBe('slow-saved@example.com')
    })
  }
})

describe('a delete seals the document', () => {
  // A delete becomes true when it SETTLES: any write still in flight at that
  // moment must have been committed by the server before the delete to have
  // succeeded, so its response is dead data. All four dispatch x settle cells
  // therefore end with the document gone.

  function slowDelete() {
    server.use(
      http.delete(url('/api/v2/document/User/:name'), async () => {
        await delay(60)
        return HttpResponse.json({ data: 'deleted' })
      }),
    )
  }

  it('delete dispatched first, settling first', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })

    const [del, save] = await inDispatchOrder(
      () => dt.delete.submit({ name: 'user1' }),
      () => dt.setValue.submit({ name: 'user1', email: 'slow@example.com' }),
    )
    await Promise.all([del, save])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('delete dispatched first, settling last', async () => {
    await seedUser1()
    slowDelete()
    const dt = useDoctype<User>('User', { baseUrl })

    const [del, save] = await inDispatchOrder(
      () => dt.delete.submit({ name: 'user1' }),
      () => dt.setValue.submit({ name: 'user1', email: 'quick@example.com' }),
    )
    await Promise.all([del, save])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('delete dispatched second, settling first', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })

    const [save, del] = await inDispatchOrder(
      () => dt.setValue.submit({ name: 'user1', email: 'slow@example.com' }),
      () => dt.delete.submit({ name: 'user1' }),
    )
    await Promise.all([save, del])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('delete dispatched second, settling last', async () => {
    await seedUser1()
    slowDelete()
    const dt = useDoctype<User>('User', { baseUrl })

    const [save, del] = await inDispatchOrder(
      () => dt.setValue.submit({ name: 'user1', email: 'quick@example.com' }),
      () => dt.delete.submit({ name: 'user1' }),
    )
    await Promise.all([save, del])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })

  it('a reload racing a delete cannot re-publish the deleted doc', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })
    const doc = makeDoc()

    // The reload is dispatched after the delete but can be answered before
    // the delete commits. It is a read, so it records nothing and the seal
    // still stands.
    await Promise.all([dt.delete.submit({ name: 'user1' }), doc.reload()])

    expect(docStore.getDoc('User', 'user1').value).toBe(null)
  })
})

describe('a local write is admitted and records nothing', () => {
  it('lands after a network write, whatever that write recorded', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })

    await dt.setValue.submit({ name: 'user1', email: 'saved@example.com' })
    await docStore.setDoc(
      { doctype: 'User', name: 'user1', email: 'local@example.com' },
      LOCAL_WRITE,
    )

    expect(storedEmail()).toBe('local@example.com')
  })

  it('does not gate out a network write dispatched before it', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })

    const save = dt.setValue.submit({
      name: 'user1',
      email: 'slow-saved@example.com',
    })
    await docStore.setDoc(
      { doctype: 'User', name: 'user1', email: 'local@example.com' },
      LOCAL_WRITE,
    )
    await save

    expect(storedEmail()).toBe('slow-saved@example.com')
  })
})

describe('a sequence is recorded only by a write that landed', () => {
  // A newer submit that FAILED wrote nothing on the server, so it must not
  // make an older success stale. Both settle orderings.

  it('newer failure settles first, older success last', async () => {
    await seedUser1()
    const a = makeList()
    const b = makeList()

    const older = a.setValue.submit({
      name: 'user1',
      email: 'slow-old@example.com',
    })
    const newer = b.setValue.submit({ name: 'user1', email: 'quickfail' })

    await expect(newer).rejects.toThrow('setValue user1 failed')
    await older

    expect(storedEmail()).toBe('slow-old@example.com')
  })

  it('older success settles first, newer failure last', async () => {
    await seedUser1()
    const a = makeList()
    const b = makeList()

    const older = a.setValue.submit({
      name: 'user1',
      email: 'old@example.com',
    })
    const newer = b.setValue.submit({ name: 'user1', email: 'slow-quickfail' })

    await older
    await expect(newer).rejects.toThrow('setValue user1 failed')

    expect(storedEmail()).toBe('old@example.com')
  })
})

describe('one instance, two submits: the store gate decides, not submit order', () => {
  // A composable's own newest-wins rule is instance-wide and knows only which
  // submit STARTED last. Left in charge of store writes it drops writes the
  // per-document gate would have kept.

  it('the later-dispatched submit wins when it settles first', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })

    const [older, newer] = await inDispatchOrder(
      () =>
        dt.setValue.submit({ name: 'user1', email: 'slow-old@example.com' }),
      () => dt.setValue.submit({ name: 'user1', email: 'new@example.com' }),
    )
    await Promise.all([older, newer])

    expect(storedEmail()).toBe('new@example.com')
  })

  it('the later-dispatched submit wins when it settles last', async () => {
    await seedUser1()
    const dt = useDoctype<User>('User', { baseUrl })

    const [older, newer] = await inDispatchOrder(
      () => dt.setValue.submit({ name: 'user1', email: 'old@example.com' }),
      () =>
        dt.setValue.submit({ name: 'user1', email: 'slow-new@example.com' }),
    )
    await Promise.all([older, newer])

    expect(storedEmail()).toBe('slow-new@example.com')
  })

  it('an overtaken insert still lands in the store', async () => {
    const maker = useNewDoc<User>('User', {}, { baseUrl })

    // Two inserts from one instance, each creating a different document. The
    // first is slow, so the second overtakes it. Both documents exist on the
    // server, so both must be in the store: they share no key for the gate
    // to reject.
    maker.doc.name = 'slow-overtaken'
    maker.doc.email = 'overtaken@example.com'
    const first = maker.submit()

    maker.doc.name = 'quick-winner'
    maker.doc.email = 'winner@example.com'
    const second = maker.submit()

    await Promise.all([first, second])

    expect(docStore.getDoc('User', 'slow-overtaken').value?.email).toBe(
      'overtaken@example.com',
    )
    expect(docStore.getDoc('User', 'quick-winner').value?.email).toBe(
      'winner@example.com',
    )
  })

  it('a newer failed submit does not gate out an older success', async () => {
    await seedUser1()
    const doc = makeDoc()

    const older = doc.setValue.submit({ email: 'slow-old@example.com' })
    const newer = doc.setValue.submit({ email: 'quickfail' })

    await Promise.all([older, newer])

    expect(storedEmail()).toBe('slow-old@example.com')
  })
})

describe('useNewDoc inserts are stamped', () => {
  // An insert to a caller-supplied name is a write to a named document like
  // any other, so it takes both settle orderings against a save on that name.

  it('a stale earlier-dispatched save cannot overwrite a landed insert', async () => {
    const dt = useDoctype<User>('User', { baseUrl })

    const stale = dt.setValue.submit({
      name: 'race-insert',
      email: 'slow-stale@example.com',
    })
    const maker = useNewDoc<User>(
      'User',
      { name: 'race-insert', email: 'inserted@example.com' },
      { baseUrl },
    )
    const created = await maker.submit()
    await stale

    expect(created).toMatchObject({ email: 'inserted@example.com' })
    expect(docStore.getDoc('User', 'race-insert').value?.email).toBe(
      'inserted@example.com',
    )
  })

  it('a later-dispatched save overwrites an insert that settled first', async () => {
    const dt = useDoctype<User>('User', { baseUrl })
    const maker = useNewDoc<User>(
      'User',
      { name: 'insert-then-save', email: 'inserted@example.com' },
      { baseUrl },
    )

    const [insert, save] = await inDispatchOrder(
      () => maker.submit(),
      () =>
        dt.setValue.submit({
          name: 'insert-then-save',
          email: 'saved@example.com',
        }),
    )
    await Promise.all([insert, save])

    expect(docStore.getDoc('User', 'insert-then-save').value?.email).toBe(
      'saved@example.com',
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

describe('invalidation is not a delete', () => {
  it('an in-flight save repopulates the store after a transform-throws eviction', async () => {
    await docStore.setDoc(
      {
        doctype: 'User',
        name: 'user1',
        email: 'poison',
      },
      LOCAL_WRITE,
    )
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
    // delete seals the key against in-flight writes.
    const [save] = await inDispatchOrder(
      () => doc.setValue.submit({ email: 'slow-fresh@example.com' }),
      async () => {
        expect(doc.doc).toBe(null) // reads the poisoned doc, evicts it
      },
    )
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

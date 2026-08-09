/**
 * @vitest-environment node
 */

import { baseUrl } from '../mocks/utils'
import { docStore } from './docStore'
import { useDoctype } from './useDoctype/useDoctype'
import { useList } from './useList/useList'

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

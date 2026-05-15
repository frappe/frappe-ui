/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import './setup'
import { createDocStore } from '../DocStore'
import { createRequestManager } from '../RequestManager'
import { createCoreListHandle } from '../CoreListHandle'
import { BASE_URL, server, type TodoDoc } from './mocks'

function makeList(
  params: Omit<
    Parameters<typeof createCoreListHandle>[0],
    'store' | 'requestManager' | 'doctype'
  > = {},
) {
  const store = createDocStore()
  const rm = createRequestManager({ baseUrl: BASE_URL })
  const handle = createCoreListHandle<TodoDoc>({
    store,
    requestManager: rm,
    doctype: 'ToDo',
    ...params,
  })
  return { handle, store, rm }
}

describe('CoreListHandle', () => {
  it('data is empty before initial fetch', () => {
    const { handle } = makeList()
    expect(handle.data).toEqual([])
  })

  it('fetches list and populates data', async () => {
    const { handle } = makeList()
    await handle.promise
    expect(handle.data.length).toBeGreaterThan(0)
    expect(handle.data[0]).toMatchObject({
      name: expect.any(String),
      status: expect.any(String),
    })
  })

  it('stores all docs in DocStore', async () => {
    const { handle, store } = makeList()
    await handle.promise
    for (const item of handle.data) {
      expect(store.get('ToDo', item.name)).not.toBe(null)
    }
  })

  it('applies filters', async () => {
    const { handle } = makeList({ filters: { status: 'Open' } } as any)
    await handle.promise
    for (const item of handle.data) {
      expect(item.status).toBe('Open')
    }
  })

  it('setValue.call patches a doc in the list', async () => {
    const { handle } = makeList()
    await handle.promise

    const first = handle.data[0]
    await handle.setValue.call({
      name: first.name,
      description: 'Updated via list',
    })

    const updated = handle.data.find((d) => d.name === first.name)
    expect(updated?.description).toBe('Updated via list')
  })

  it('cross-list sync: update in one list reflects in another', async () => {
    const store = createDocStore()
    const rm = createRequestManager({ baseUrl: BASE_URL })

    const list1 = createCoreListHandle<TodoDoc>({
      store,
      requestManager: rm,
      doctype: 'ToDo',
    })
    const list2 = createCoreListHandle<TodoDoc>({
      store,
      requestManager: rm,
      doctype: 'ToDo',
    })

    await list1.promise
    await list2.promise

    const name = list1.data[0]?.name
    expect(name).toBeDefined()

    await list1.setValue.call({ name, description: 'Cross list update' })

    const inList2 = list2.data.find((d) => d.name === name)
    expect(inList2?.description).toBe('Cross list update')
  })

  it('delete.call removes doc from list', async () => {
    const { handle } = makeList()
    await handle.promise

    const initial = handle.data.length
    const nameToDelete = handle.data[0]?.name
    expect(nameToDelete).toBeDefined()

    await handle.delete.call(nameToDelete)

    expect(handle.data.length).toBe(initial - 1)
    expect(handle.data.find((d) => d.name === nameToDelete)).toBeUndefined()
  })

  it('insert.call adds doc to list', async () => {
    const { handle } = makeList()
    await handle.promise

    const before = handle.data.length
    const newDoc = await handle.insert.call({
      description: 'Brand new todo',
      status: 'Open',
      priority: 0,
    } as any)

    expect(handle.data.length).toBe(before + 1)
    expect(handle.data[0]?.name).toBe(newDoc.name)
    expect(handle.data[0]?.description).toBe('Brand new todo')
  })

  describe('pagination', () => {
    it('hasNextPage is false when all docs fit in one page', async () => {
      const { handle } = makeList({ limit: 50 } as any)
      await handle.promise
      expect(handle.hasNextPage).toBe(false)
    })

    it('hasNextPage is true when there are more pages', async () => {
      const { handle } = makeList({ limit: 1 } as any)
      await handle.promise
      expect(handle.hasNextPage).toBe(true)
    })

    it('hasPreviousPage is false on first page', async () => {
      const { handle } = makeList()
      await handle.promise
      expect(handle.hasPreviousPage).toBe(false)
    })

    it('next() fetches the next page and hasPreviousPage becomes true', async () => {
      const { handle } = makeList({ limit: 1 } as any)
      await handle.promise

      expect(handle.hasNextPage).toBe(true)
      const firstPageNames = handle.data.map((d) => d.name)

      await handle.next()

      // Should now show a different item
      const secondPageNames = handle.data.map((d) => d.name)
      expect(secondPageNames).not.toEqual(firstPageNames)
      expect(handle.hasPreviousPage).toBe(true)
    })

    it('previous() goes back to the prior page', async () => {
      const { handle } = makeList({ limit: 1 } as any)
      await handle.promise

      const firstPageNames = handle.data.map((d) => d.name)
      await handle.next()
      await handle.previous()

      expect(handle.data.map((d) => d.name)).toEqual(firstPageNames)
      expect(handle.hasPreviousPage).toBe(false)
    })
  })

  it('reload refetches the current page', async () => {
    const { handle } = makeList()
    await handle.promise
    const before = handle.data.length
    await handle.reload()
    expect(handle.data.length).toBe(before)
  })

  it('dispose stops doctype subscriptions', async () => {
    const { handle, store } = makeList()
    await handle.promise

    handle.dispose()

    // After dispose, DocStore updates should NOT propagate to handle.data
    const name = handle.data[0]?.name
    const snapshot = [...handle.data]
    store.set({ doctype: 'ToDo', name, description: 'after dispose' })

    // Data should remain as-is (subscription removed)
    expect(handle.data[0]?.description).toBe(snapshot[0]?.description)
  })

  it('setValue.callOptimistic reverts on server error', async () => {
    const { handle } = makeList()
    await handle.promise

    const name = handle.data[0]?.name
    server.use(
      http.patch(`${BASE_URL}/api/v2/document/ToDo/${name}`, () =>
        HttpResponse.json(
          {
            errors: [
              { title: 'Error', type: 'Error', message: 'Forced error' },
            ],
          },
          { status: 500 },
        ),
      ),
    )

    const originalDesc = handle.data.find((d) => d.name === name)?.description

    const callPromise = handle.setValue.callOptimistic(
      { name, description: 'Optimistic change' },
      (s) => {
        const doc = s.get('ToDo', name)
        if (doc) s.set({ ...doc, description: 'Optimistic change' })
      },
    )

    // Optimistic update is visible
    expect(handle.data.find((d) => d.name === name)?.description).toBe(
      'Optimistic change',
    )

    await expect(callPromise).rejects.toBeTruthy()

    // Reverted
    expect(handle.data.find((d) => d.name === name)?.description).toBe(
      originalDesc,
    )
  })
})

/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import './setup'
import { createDocStore } from '../DocStore'
import { createRequestManager } from '../RequestManager'
import { createCoreDocHandle } from '../CoreDocHandle'
import { FrappeResponseError } from '../FrappeResponseError'
import { BASE_URL, server, type TodoDoc } from './mocks'

function makeHandle(name: string) {
  const store = createDocStore()
  const rm = createRequestManager({ baseUrl: BASE_URL })
  const handle = createCoreDocHandle<TodoDoc>({
    store,
    requestManager: rm,
    doctype: 'ToDo',
    name,
  })
  return { handle, store }
}

describe('CoreDocHandle', () => {
  it('doc is null before initial fetch completes', async () => {
    const { handle } = makeHandle('todo-1')
    // promise hasn't resolved yet, but doc should initially be null
    expect(handle.doc).toBe(null)
    await handle.promise
  })

  it('fetches doc and updates doc property', async () => {
    const { handle } = makeHandle('todo-1')
    await handle.promise
    expect(handle.doc).toMatchObject({
      name: 'todo-1',
      description: 'First todo item',
      status: 'Open',
      priority: 1,
    })
  })

  it('stores the doc in DocStore', async () => {
    const { handle, store } = makeHandle('todo-1')
    await handle.promise
    const stored = store.get('ToDo', 'todo-1')
    expect(stored).toMatchObject({ name: 'todo-1', status: 'Open' })
  })

  it('doc is updated via DocStore subscription (cross-handle sync)', async () => {
    const store = createDocStore()
    const rm = createRequestManager({ baseUrl: BASE_URL })

    const handle1 = createCoreDocHandle<TodoDoc>({
      store,
      requestManager: rm,
      doctype: 'ToDo',
      name: 'todo-1',
    })
    const handle2 = createCoreDocHandle<TodoDoc>({
      store,
      requestManager: rm,
      doctype: 'ToDo',
      name: 'todo-1',
    })

    await handle1.promise
    await handle2.promise

    // Both see initial state
    expect(handle1.doc?.status).toBe('Open')
    expect(handle2.doc?.status).toBe('Open')

    // Update via handle1
    await handle1.setValue.call({ status: 'Closed' })

    // handle2 should reflect the update (DocStore subscription fires synchronously)
    expect(handle2.doc?.status).toBe('Closed')
  })

  it('setValue.call patches the doc', async () => {
    const { handle } = makeHandle('todo-1')
    await handle.promise

    await handle.setValue.call({ status: 'Closed', description: 'Updated' })

    expect(handle.doc?.status).toBe('Closed')
    expect(handle.doc?.description).toBe('Updated')
  })

  it('delete.call removes doc from store', async () => {
    const { handle, store } = makeHandle('todo-1')
    await handle.promise
    expect(handle.doc).not.toBe(null)

    await handle.delete.call()

    expect(handle.doc).toBe(null)
    expect(store.get('ToDo', 'todo-1')).toBe(null)
  })

  it('reload refetches the doc', async () => {
    const { handle } = makeHandle('todo-1')
    await handle.promise

    // Mutate via a different handle
    const store2 = createDocStore()
    const rm2 = createRequestManager({ baseUrl: BASE_URL })
    const other = createCoreDocHandle<TodoDoc>({
      store: store2,
      requestManager: rm2,
      doctype: 'ToDo',
      name: 'todo-1',
    })
    await other.promise
    await other.setValue.call({ description: 'Changed on server' })

    // Reload using the original handle's private store — will re-fetch server state
    await handle.reload()

    expect(handle.doc?.description).toBe('Changed on server')
  })

  it('dispose unsubscribes from DocStore', async () => {
    const { handle, store } = makeHandle('todo-1')
    await handle.promise

    handle.dispose()

    // After dispose, external store mutations should not update handle.doc
    store.set({
      doctype: 'ToDo',
      name: 'todo-1',
      status: 'Closed',
      description: 'disposed',
    })
    // handle.doc still reflects state from before (subscription removed)
    // After dispose, the snapshot is frozen — the subscription was removed
    expect(handle.doc?.description).not.toBe('disposed')
  })

  it('setValue.callOptimistic applies update immediately and reverts on error', async () => {
    const { handle, store } = makeHandle('todo-1')
    await handle.promise

    // Force a server error on next PATCH
    server.use(
      http.patch(`${BASE_URL}/api/v2/document/ToDo/todo-1`, () =>
        HttpResponse.json(
          {
            errors: [
              { title: 'Error', type: 'ServerError', message: 'Forced error' },
            ],
          },
          { status: 500 },
        ),
      ),
    )

    const originalStatus = handle.doc?.status

    const callPromise = handle.setValue.callOptimistic(
      { status: 'Closed' },
      (s) => {
        const doc = s.get('ToDo', 'todo-1')
        if (doc) s.set({ ...doc, status: 'Closed' })
      },
    )

    // Optimistic update should be visible immediately
    expect(handle.doc?.status).toBe('Closed')

    // After error, should revert
    await expect(callPromise).rejects.toBeTruthy()
    expect(handle.doc?.status).toBe(originalStatus)
  })

  it('handles 404 error correctly', async () => {
    const { handle } = makeHandle('non-existent')
    await expect(handle.promise).rejects.toBeInstanceOf(FrappeResponseError)
  })
})

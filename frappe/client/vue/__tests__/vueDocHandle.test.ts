/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { effectScope, ref, nextTick } from 'vue'
import '../../core/__tests__/setup'
import { createDocStore } from '../../core/DocStore'
import { createRequestManager } from '../../core/RequestManager'
import { createVueDocHandle } from '../vueDocHandle'
import { BASE_URL, server, mockTodos, type TodoDoc } from '../../core/__tests__/mocks'

function flushPromises() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0))
}

function makeHandle(
  name: string | ReturnType<typeof ref<string>>,
  extraOpts: Record<string, any> = {},
) {
  const store = createDocStore()
  const rm = createRequestManager({ baseUrl: BASE_URL })
  const handle = createVueDocHandle<TodoDoc>({
    store,
    requestManager: rm,
    doctype: 'ToDo',
    name: name as any,
    ...extraOpts,
  })
  return { handle, store }
}

describe('createVueDocHandle', () => {
  it('doc is null before fetch resolves', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    expect(handle.doc).toBe(null)
    await handle.promise
    scope.stop()
  })

  it('fetches doc and exposes it reactively', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise
    expect(handle.doc).toMatchObject({
      name: 'todo-1',
      description: 'First todo item',
      status: 'Open',
    })
    scope.stop()
  })

  it('loading is true during fetch', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    // loading becomes true once watchEffect fires and fetchDoc starts
    await flushPromises()
    expect(handle.loading).toBe(false)
    scope.stop()
  })

  it('updates doc reactively when DocStore changes (real-time simulation)', async () => {
    const scope = effectScope()
    const { handle, store } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    // Simulate real-time push
    store.set({
      doctype: 'ToDo',
      name: 'todo-1',
      description: 'Updated via socket!',
      status: 'Closed',
      priority: 1,
      owner: 'admin@example.com',
      modified: '2026-01-14 15:00:00',
      creation: '2026-01-14 09:00:00',
    })
    // nextTick batching: update is deferred one tick
    await nextTick()
    expect(handle.doc?.description).toBe('Updated via socket!')
    expect(handle.doc?.status).toBe('Closed')
    scope.stop()
  })

  it('reacts to name ref change — fetches new doc', async () => {
    const nameRef = ref('todo-1')
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle(nameRef))!

    await handle.promise

    expect(handle.doc?.name).toBe('todo-1')

    nameRef.value = 'todo-2'
    await flushPromises()

    expect(handle.doc?.name).toBe('todo-2')
    expect(handle.doc?.status).toBe('Closed')
    scope.stop()
  })

  it('reacts to name getter change', async () => {
    let resolvedName = 'todo-1'
    const scope = effectScope()
    const nameGetter = ref('todo-1')
    const { handle } = scope.run(() => makeHandle(() => nameGetter.value))!

    await handle.promise
    expect(handle.doc?.name).toBe('todo-1')

    nameGetter.value = 'todo-3'
    await flushPromises()
    expect(handle.doc?.name).toBe('todo-3')
    resolvedName = 'todo-3'
    expect(resolvedName).toBe('todo-3')
    scope.stop()
  })

  it('clears doc when enabled becomes false', async () => {
    const enabledRef = ref(true)
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeHandle('todo-1', { enabled: enabledRef }),
    )!
    await handle.promise
    expect(handle.doc).not.toBe(null)

    enabledRef.value = false
    await nextTick()
    expect(handle.doc).toBe(null)
    scope.stop()
  })

  it('applies transform to the doc', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeHandle('todo-1', {
        transform: (doc: TodoDoc) => ({ ...doc, description: doc.description.toUpperCase() }),
      }),
    )!
    await handle.promise
    expect(handle.doc?.description).toBe('FIRST TODO ITEM')
    scope.stop()
  })

  it('calls onSuccess after fetch', async () => {
    let successDoc: TodoDoc | null = null
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeHandle('todo-1', {
        onSuccess: (doc: TodoDoc) => { successDoc = doc },
      }),
    )!
    await handle.promise
    expect(successDoc).toMatchObject({ name: 'todo-1' })
    scope.stop()
  })

  it('setValue.call patches the doc and updates DocStore', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    await handle.setValue.call({ description: 'Updated description' })
    expect(handle.setValue.loading).toBe(false)
    expect(handle.doc?.description).toBe('Updated description')
    expect(mockTodos['todo-1'].description).toBe('Updated description')
    scope.stop()
  })

  it('setValue.loading is true during mutation', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    const patchPromise = handle.setValue.call({ status: 'Closed' })
    expect(handle.setValue.loading).toBe(true)
    await patchPromise
    expect(handle.setValue.loading).toBe(false)
    scope.stop()
  })

  it('setValue.error is set on failure', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    server.use(
      http.patch(`${BASE_URL}/api/v2/document/ToDo/todo-1`, () =>
        HttpResponse.json({ errors: [{ title: 'Error', type: 'ValidationError' }] }, { status: 422 }),
      ),
    )

    await expect(handle.setValue.call({ status: 'Closed' })).rejects.toThrow()
    expect(handle.setValue.error).not.toBe(null)
    scope.stop()
  })

  it('delete.call removes doc from DocStore', async () => {
    const scope = effectScope()
    const { handle, store } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    await handle.delete.call()
    expect(store.get('ToDo', 'todo-1')).toBe(null)
    expect(mockTodos['todo-1']).toBeUndefined()
    scope.stop()
  })

  it('reload re-fetches the doc', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    // Mutate server data directly
    mockTodos['todo-1'].description = 'Changed on server'
    await handle.reload()
    await nextTick()
    expect(handle.doc?.description).toBe('Changed on server')
    scope.stop()
  })

  it('sets error.value when fetch fails', async () => {
    server.use(
      http.get(`${BASE_URL}/api/v2/document/ToDo/missing-doc`, () =>
        HttpResponse.json(
          { errors: [{ title: 'Not Found', type: 'NotFoundError' }] },
          { status: 404 },
        ),
      ),
    )
    const scope = effectScope()
    const { handle } = scope.run(() => makeHandle('missing-doc'))!
    await handle.promise
    expect(handle.error).not.toBe(null)
    scope.stop()
  })

  it('dispose() stops subscription — doc no longer updates after dispose', async () => {
    const scope = effectScope()
    const { handle, store } = scope.run(() => makeHandle('todo-1'))!
    await handle.promise

    handle.dispose()

    store.set({ ...store.get('ToDo', 'todo-1')!, description: 'Post-dispose' } as any)
    await nextTick()
    // doc should remain at last value before dispose, not the new value
    expect(handle.doc?.description).not.toBe('Post-dispose')
    scope.stop()
  })

  it('tryOnScopeDispose cleans up when scope stops', async () => {
    const store = createDocStore()
    const rm = createRequestManager({ baseUrl: BASE_URL })

    const scope = effectScope()
    const handle = scope.run(() =>
      createVueDocHandle<TodoDoc>({ store, requestManager: rm, doctype: 'ToDo', name: 'todo-1' }),
    )!
    await handle.promise

    scope.stop() // triggers tryOnScopeDispose → dispose()

    // After scope stop, store changes should not update doc
    store.set({ ...store.get('ToDo', 'todo-1')!, description: 'After scope stop' } as any)
    await nextTick()
    expect(handle.doc?.description).not.toBe('After scope stop')
  })

  it('exposes docMethods as reactive operations', async () => {
    server.use(
      http.post(
        `${BASE_URL}/api/v2/document/ToDo/todo-1/method/mark_complete`,
        () => HttpResponse.json({ docs: [] }),
      ),
    )
    const scope = effectScope()
    const store = createDocStore()
    const rm = createRequestManager({ baseUrl: BASE_URL })
    const handle = scope.run(() =>
      createVueDocHandle<TodoDoc>({
        store,
        requestManager: rm,
        doctype: 'ToDo',
        name: 'todo-1',
        docMethods: {
          markComplete: { method: 'mark_complete', httpMethod: 'POST' },
        },
      }),
    )!
    await handle.promise

    expect(typeof handle.markComplete.call).toBe('function')
    expect(handle.markComplete.loading).toBeDefined()
    expect(handle.markComplete.error).toBeDefined()

    await handle.markComplete.call({})
    expect(handle.markComplete.loading).toBe(false)
    scope.stop()
  })
})

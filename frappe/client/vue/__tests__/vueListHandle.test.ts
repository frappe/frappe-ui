/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { effectScope, ref, nextTick } from 'vue'
import '../../core/__tests__/setup'
import { createDocStore } from '../../core/DocStore'
import { createRequestManager } from '../../core/RequestManager'
import { createVueListHandle } from '../vueListHandle'
import { BASE_URL, server, mockTodos, type TodoDoc } from '../../core/__tests__/mocks'

function flushPromises() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0))
}

function makeList(
  opts: Partial<Parameters<typeof createVueListHandle<TodoDoc>>[0]> = {},
) {
  const store = createDocStore()
  const rm = createRequestManager({ baseUrl: BASE_URL })
  const handle = createVueListHandle<TodoDoc>({
    store,
    requestManager: rm,
    doctype: 'ToDo',
    ...opts,
  })
  return { handle, store }
}

describe('createVueListHandle', () => {
  it('data is empty before fetch resolves', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    expect(handle.data).toEqual([])
    await handle.promise
    scope.stop()
  })

  it('fetches list and exposes reactive data', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise
    expect(handle.data.length).toBeGreaterThan(0)
    expect(handle.data.every((d) => 'name' in d)).toBe(true)
    scope.stop()
  })

  it('filters with a static value', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeList({ filters: { status: 'Open' } }),
    )!
    await handle.promise
    expect(handle.data.every((d) => d.status === 'Open')).toBe(true)
    scope.stop()
  })

  it('filters with a reactive ref — refetches on change', async () => {
    const statusFilter = ref<string>('Open')
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeList({ filters: { status: statusFilter } }),
    )!
    await handle.promise
    const openCount = handle.data.length
    expect(handle.data.every((d) => d.status === 'Open')).toBe(true)

    statusFilter.value = 'Closed'
    await flushPromises()

    expect(handle.data.every((d) => d.status === 'Closed')).toBe(true)
    expect(handle.data.length).toBeGreaterThan(0)
    scope.stop()
  })

  it('filters with a getter function — refetches when getter result changes', async () => {
    const key = ref('Open')
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeList({ filters: { status: () => key.value } }),
    )!
    await handle.promise
    expect(handle.data.every((d) => d.status === 'Open')).toBe(true)

    key.value = 'Closed'
    await flushPromises()
    expect(handle.data.every((d) => d.status === 'Closed')).toBe(true)
    scope.stop()
  })

  it('omits filter keys where getter returns undefined', async () => {
    const includeStatus = ref(false)
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeList({ filters: { status: () => (includeStatus.value ? 'Closed' : undefined) } }),
    )!
    await handle.promise
    // When status filter is undefined, all todos are returned
    expect(handle.data.length).toBe(3)
    scope.stop()
  })

  it('skips fetch when enabled is false', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList({ enabled: false }))!
    await flushPromises()
    expect(handle.data).toEqual([])
    scope.stop()
  })

  it('fetches when enabled transitions from false to true', async () => {
    const enabledRef = ref(false)
    const scope = effectScope()
    const { handle } = scope.run(() => makeList({ enabled: enabledRef }))!
    await flushPromises()
    expect(handle.data).toEqual([])

    enabledRef.value = true
    await flushPromises()
    expect(handle.data.length).toBeGreaterThan(0)
    scope.stop()
  })

  it('updates data reactively when DocStore changes (real-time)', async () => {
    const scope = effectScope()
    const { handle, store } = scope.run(() => makeList())!
    await handle.promise

    // Simulate a real-time update to a doc in the list
    const firstName = handle.data[0]?.name
    expect(firstName).toBeDefined()
    store.set({
      doctype: 'ToDo',
      name: firstName!,
      description: 'Real-time update',
      status: 'Closed',
      priority: 99,
      owner: 'admin@example.com',
      modified: '2026-01-14 16:00:00',
      creation: '2026-01-14 09:00:00',
    })
    // Store notifies subscribeDoctype → bumps _storeVersion → computed recalculates
    await nextTick()
    const updated = handle.data.find((d) => d.name === firstName)
    expect(updated?.description).toBe('Real-time update')
    scope.stop()
  })

  it('applies transform to each doc', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() =>
      makeList({
        transform: (doc: TodoDoc) => ({ ...doc, _label: `[${doc.status}]` }),
      }),
    )!
    await handle.promise
    expect(handle.data.every((d) => (d as any)._label !== undefined)).toBe(true)
    scope.stop()
  })

  it('paginates with next() and previous()', async () => {
    // Seed extra todos to test pagination
    for (let i = 4; i <= 6; i++) {
      mockTodos[`todo-${i}`] = {
        name: `todo-${i}`,
        description: `Todo ${i}`,
        status: 'Open',
        priority: i,
        owner: 'admin@example.com',
        modified: `2026-01-${14 + i} 10:00:00`,
        creation: `2026-01-${14 + i} 09:00:00`,
      }
    }

    const scope = effectScope()
    const { handle } = scope.run(() => makeList({ limit: 2 }))!
    await handle.promise
    const firstPageNames = handle.data.map((d) => d.name)
    expect(firstPageNames.length).toBe(2)
    expect(handle.hasPreviousPage).toBe(false)
    expect(handle.hasNextPage).toBe(true)

    await handle.next()
    const secondPageNames = handle.data.map((d) => d.name)
    expect(secondPageNames.length).toBe(2)
    expect(handle.hasPreviousPage).toBe(true)
    // names on second page differ from first
    expect(secondPageNames).not.toEqual(firstPageNames)

    await handle.previous()
    expect(handle.data.map((d) => d.name)).toEqual(firstPageNames)
    expect(handle.hasPreviousPage).toBe(false)
    scope.stop()
  })

  it('insert.call adds a new doc to the list', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise
    const beforeCount = handle.data.length

    await handle.insert.call({ description: 'Brand new todo', status: 'Open' })
    expect(handle.data.length).toBe(beforeCount + 1)
    expect(handle.data[0].description).toBe('Brand new todo')
    scope.stop()
  })

  it('setValue.call updates a doc in the list', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise

    const targetName = handle.data.find((d) => d.name === 'todo-1')?.name
    expect(targetName).toBe('todo-1')

    await handle.setValue.call({ name: 'todo-1', status: 'Closed' })
    const updated = handle.data.find((d) => d.name === 'todo-1')
    expect(updated?.status).toBe('Closed')
    scope.stop()
  })

  it('delete.call removes a doc from the list', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise
    const beforeCount = handle.data.length
    const target = handle.data[0].name

    await handle.delete.call(target)
    expect(handle.data.find((d) => d.name === target)).toBeUndefined()
    expect(handle.data.length).toBe(beforeCount - 1)
    scope.stop()
  })

  it('reload() re-fetches the current page', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise

    mockTodos['todo-new'] = {
      name: 'todo-new',
      description: 'Added externally',
      status: 'Open',
      priority: 10,
      owner: 'admin@example.com',
      modified: '2026-01-15 10:00:00',
      creation: '2026-01-15 09:00:00',
    }

    await handle.reload()
    expect(handle.data.some((d) => d.name === 'todo-new')).toBe(true)
    scope.stop()
  })

  it('dispose() stops doctype subscription', async () => {
    const scope = effectScope()
    const { handle, store } = scope.run(() => makeList())!
    await handle.promise

    const firstName = handle.data[0]?.name
    handle.dispose()

    // This update should not change data since we unsubscribed
    store.set({
      doctype: 'ToDo',
      name: firstName!,
      description: 'Post-dispose update',
      status: 'Open',
      priority: 1,
      owner: '',
      modified: '',
      creation: '',
    })
    await nextTick()
    // data should NOT reflect the update (subscription was removed)
    const item = handle.data.find((d) => d.name === firstName)
    expect(item?.description).not.toBe('Post-dispose update')
    scope.stop()
  })

  it('loading is false after first fetch', async () => {
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise
    expect(handle.loading).toBe(false)
    scope.stop()
  })

  it('error is set on failed fetch', async () => {
    server.use(
      http.get(`${BASE_URL}/api/v2/document/ToDo`, () =>
        HttpResponse.json({ errors: [{ title: 'Server error', type: 'Error' }] }, { status: 500 }),
      ),
    )
    const scope = effectScope()
    const { handle } = scope.run(() => makeList())!
    await handle.promise
    expect(handle.error).not.toBe(null)
    scope.stop()
  })
})

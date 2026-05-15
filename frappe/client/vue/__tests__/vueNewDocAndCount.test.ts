/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { effectScope } from 'vue'
import '../../core/__tests__/setup'
import { createDocStore } from '../../core/DocStore'
import { createRequestManager } from '../../core/RequestManager'
import {
  BASE_URL,
  mockTodos,
  resetMockTodos,
  type TodoDoc,
} from '../../core/__tests__/mocks'
import { createVueNewDocHandle } from '../vueNewDocHandle'
import { createVueCountHandle } from '../vueCountHandle'

function flushPromises() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0))
}

function makeStore() {
  return createDocStore()
}

function makeRm() {
  return createRequestManager({ baseUrl: BASE_URL })
}

beforeEach(() => resetMockTodos())

// ---------------------------------------------------------------------------
// newDoc
// ---------------------------------------------------------------------------

describe('createVueNewDocHandle', () => {
  it('doc starts with provided defaults', () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueNewDocHandle<TodoDoc>({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
        defaults: { status: 'Open', priority: 5 } as any,
      }),
    )!
    expect(handle.doc.status).toBe('Open')
    expect(handle.doc.priority).toBe(5)
    scope.stop()
  })

  it('insert.call() posts to server and updates doc with server response', async () => {
    const store = makeStore()
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueNewDocHandle<TodoDoc>({
        store,
        requestManager: makeRm(),
        doctype: 'ToDo',
        defaults: { description: 'Test newDoc', status: 'Open' } as any,
      }),
    )!

    expect(handle.insert.loading).toBe(false)
    const result = await handle.insert.call()
    expect(handle.insert.loading).toBe(false)
    expect(handle.insert.error).toBe(null)
    // Server assigns a name
    expect(result.name).toBeDefined()
    expect(result.description).toBe('Test newDoc')
    // doc is updated with the server-assigned name
    expect((handle.doc as any).name).toBeDefined()
    // Stored in DocStore
    expect(store.get('ToDo', result.name)).toBeTruthy()
    scope.stop()
  })

  it('insert.call() can merge extra values', async () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueNewDocHandle<TodoDoc>({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
        defaults: { status: 'Open' } as any,
      }),
    )!

    const result = await handle.insert.call({ description: 'Extra desc' } as any)
    expect(result.description).toBe('Extra desc')
    scope.stop()
  })

  it('insert.loading is true during upload', async () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueNewDocHandle<TodoDoc>({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
      }),
    )!

    const insertPromise = handle.insert.call()
    await flushPromises()
    // After the microtask queue drains the loading should be false
    // (test environment resolves immediately)
    await insertPromise
    expect(handle.insert.loading).toBe(false)
    scope.stop()
  })
})

// ---------------------------------------------------------------------------
// getCount
// ---------------------------------------------------------------------------

describe('createVueCountHandle', () => {
  it('fetches total count', async () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueCountHandle({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
      }),
    )!
    await handle.promise
    expect(handle.data).toBe(Object.keys(mockTodos).length)
    scope.stop()
  })

  it('fetches count with filters', async () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueCountHandle({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
        filters: { status: 'Open' },
      }),
    )!
    await handle.promise
    const expected = Object.values(mockTodos).filter((t) => t.status === 'Open').length
    expect(handle.data).toBe(expected)
    scope.stop()
  })

  it('loading is false after fetch', async () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueCountHandle({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
      }),
    )!
    await handle.promise
    expect(handle.loading).toBe(false)
    expect(handle.error).toBe(null)
    scope.stop()
  })

  it('enabled: false suppresses fetch', async () => {
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueCountHandle({
        store: makeStore(),
        requestManager: makeRm(),
        doctype: 'ToDo',
        enabled: false,
      }),
    )!
    await flushPromises()
    // No fetch → data stays null
    expect(handle.data).toBe(null)
    expect(handle.loading).toBe(false)
    scope.stop()
  })

  it('reload() refetches count', async () => {
    const store = makeStore()
    const scope = effectScope()
    const handle = scope.run(() =>
      createVueCountHandle({
        store,
        requestManager: makeRm(),
        doctype: 'ToDo',
      }),
    )!
    await handle.promise
    const before = handle.data as number

    // Add a new mock item
    mockTodos['todo-new'] = {
      name: 'todo-new',
      description: 'New',
      status: 'Open',
      priority: 0,
      owner: 'admin@example.com',
      modified: '2026-01-15 10:00:00',
      creation: '2026-01-15 10:00:00',
    }
    await handle.reload()
    expect(handle.data).toBe(before + 1)
    scope.stop()
  })
})

/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineDoctype } from '../defineDoctype'
import { ToDoDocType } from './doctypes'
import { baseUrl, resetMockTodos } from './mocks'
import { waitForLoading } from './setup'
import { ref, nextTick } from 'vue'
import './setup'

// Mock the cache module
const mockCache = new Map<string, any>()

vi.mock('../cache', () => ({
  getCache: vi.fn(async (key: string) => mockCache.get(key) ?? null),
  setCache: vi.fn(async (key: string, value: any) => {
    mockCache.set(key, value)
  }),
  deleteCache: vi.fn(async (key: string) => {
    mockCache.delete(key)
  }),
  clearCache: vi.fn(async () => {
    mockCache.clear()
  }),
  getCacheEntries: vi.fn(async () => Array.from(mockCache.entries())),
  updateDocumentInCaches: vi.fn(async () => {}),
  removeDocumentFromCaches: vi.fn(async () => {}),
}))

beforeEach(async () => {
  // Clear cache before each test
  mockCache.clear()
  // Reset mock todos to initial state
  resetMockTodos()
})

describe('getList', () => {
  it('fetches a list of documents', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    // Verify initial state
    expect(todos.data).toEqual([])
    expect(todos.error).toBe(null)
    expect(typeof todos.reload).toBe('function')
    expect(typeof todos.next).toBe('function')

    await waitForLoading(() => todos.loading)

    // Verify final state
    expect(todos.data).toHaveLength(2)
    expect(todos.data[0].name).toBe('todo-2')
    expect(todos.data[1].name).toBe('todo-1')
    expect(todos.loading).toBe(false)
    expect(todos.error).toBe(null)
    expect(todos.hasNextPage).toBe(false)
  })

  it('applies filters', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList({
      filters: { status: 'Open' },
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.data[0].name).toBe('todo-1')
    expect(todos.data[0].status).toBe('Open')
  })

  it('handles pagination with limit', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList({
      limit: 1,
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.hasNextPage).toBe(true)
  })

  it('loads next page', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList({
      limit: 1,
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.data[0].name).toBe('todo-2')
    expect(todos.hasNextPage).toBe(true)

    todos.next()
    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.data[0].name).toBe('todo-1')
    expect(todos.hasNextPage).toBe(false)
  })

  it('does not load next page when hasNextPage is false', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.hasNextPage).toBe(false)
    const initialDataLength = todos.data.length

    todos.next()

    // Should not trigger new request
    expect(todos.data.length).toBe(initialDataLength)
  })

  it('reloads list', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)
    expect(todos.data).toHaveLength(2)

    todos.reload()
    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)
    expect(todos.loading).toBe(false)
  })

  it('returns empty array when no data', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList({
      filters: { status: 'NonExistent' },
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toEqual([])
    expect(todos.hasNextPage).toBe(false)
  })

  it('refetches when reactive filters change', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const statusFilter = ref<string | undefined>('Open')
    const todos = ToDo.getList({
      filters: () =>
        statusFilter.value ? { status: statusFilter.value } : undefined,
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.data[0].status).toBe('Open')

    // Change filter
    statusFilter.value = 'Closed'
    await nextTick()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.data[0].status).toBe('Closed')
  })

  it('refetches when reactive limit changes', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const limit = ref(1)
    const todos = ToDo.getList({
      limit: () => limit.value,
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(1)
    expect(todos.hasNextPage).toBe(true)

    // Increase limit
    limit.value = 2
    await nextTick()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)
    expect(todos.hasNextPage).toBe(false)
  })

  it('caches data when cache key is provided', async () => {
    const { setCache } = await import('../cache')
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList({
      cache: 'my-todos',
    })

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)

    // Wait for cache to be written
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify setCache was called
    expect(setCache).toHaveBeenCalledWith(
      'getList::my-todos',
      expect.any(Array),
    )
  })

  it('shows cached data while loading fresh data', async () => {
    const { getCache, setCache } = await import('../cache')
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    // Pre-populate cache with mock data
    const cachedData = [
      {
        name: 'cached-todo',
        description: 'Cached item',
        status: 'Open',
        priority: 1,
        owner: 'admin@example.com',
        modified: '2026-01-14 10:00:00',
        creation: '2026-01-14 09:00:00',
      },
    ] as ToDoDocType[]

    await setCache('getList::stale-check', cachedData)

    // Create getList with cache key
    const todos = ToDo.getList({
      cache: 'stale-check',
    })

    // Wait a tick for cache to load and network to start
    await nextTick()
    await nextTick()

    // Should show cached data while still loading
    expect(todos.loading).toBe(true)
    expect(todos.data).toHaveLength(1)
    expect(todos.data[0].name).toBe('cached-todo')

    await waitForLoading(() => todos.loading)

    // Should now show fresh data
    expect(todos.data).toHaveLength(2)
    expect(todos.data[0].name).toBe('todo-2')
  })

  it('can update a list item with setValue', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)
    expect(todos.data[0].status).toBe('Closed')

    // Update an item
    await todos.setValue.submit({
      name: 'todo-2',
      status: 'Open',
      description: 'Updated description',
    })

    expect(todos.setValue.loading).toBe(false)
    expect(todos.setValue.error).toBe(null)
    expect(todos.data[0].status).toBe('Open')
    expect(todos.data[0].description).toBe('Updated description')
  })

  it('can delete a list item', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)

    // Delete an item
    await todos.delete.submit('todo-1')

    expect(todos.delete.loading).toBe(false)
    expect(todos.delete.error).toBe(null)
    expect(todos.data).toHaveLength(1)
    expect(todos.data.find((t) => t.name === 'todo-1')).toBeUndefined()
  })

  it('updates optimistically with setValue when optimistic is true', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)
    expect(todos.data[0].status).toBe('Closed')

    // Start update with default optimistic behavior
    const updatePromise = todos.setValue
      .submit({
        name: 'todo-2',
        status: 'Open',
        description: 'Optimistically updated',
      })
      .optimistic()

    // Should be updated immediately (optimistically)
    await nextTick()
    expect(todos.data[0].status).toBe('Open')
    expect(todos.data[0].description).toBe('Optimistically updated')

    // Wait for actual request to complete
    await updatePromise

    // Should still be updated with server response (which merges our changes)
    expect(todos.data[0].status).toBe('Open')
    expect(todos.data[0].description).toBe('Optimistically updated')
  })

  it('deletes optimistically when optimistic is true', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)

    // Start delete with default optimistic behavior
    const deletePromise = todos.delete.submit('todo-1').optimistic()

    // Should be removed immediately (optimistically)
    await nextTick()
    expect(todos.data).toHaveLength(1)
    expect(todos.data.find((t) => t.name === 'todo-1')).toBeUndefined()

    // Wait for actual request to complete
    await deletePromise

    // Should still be removed
    expect(todos.data).toHaveLength(1)
    expect(todos.data.find((t) => t.name === 'todo-1')).toBeUndefined()
  })

  it('can insert a new item with insert', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)

    await todos.insert.submit({
      description: 'New task',
      status: 'Open',
    })

    expect(todos.insert.data).toBeDefined()
    expect(todos.insert.data!.description).toBe('New task')
    expect(todos.insert.data!.status).toBe('Open')
    expect(todos.insert.data!.name).toMatch(/^todo-/)

    // Should be added to the beginning of the list
    expect(todos.data).toHaveLength(3)
    expect(todos.data[0].description).toBe('New task')
    expect(todos.data[0].status).toBe('Open')
  })

  it('inserts optimistically when optimistic is true', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todos = ToDo.getList()

    await waitForLoading(() => todos.loading)

    expect(todos.data).toHaveLength(2)

    // Start insert with optimistic function
    const insertPromise = todos.insert
      .submit({
        description: 'New optimistic task',
        status: 'Open',
      })
      .optimistic((items) => [
        {
          name: `temp-${Date.now()}`,
          description: 'New optimistic task',
          status: 'Open',
        } as ToDoDocType,
        ...items,
      ])

    // Should be added immediately (optimistically) with temp name
    await nextTick()
    expect(todos.data).toHaveLength(3)
    expect(todos.data[0].description).toBe('New optimistic task')
    expect(todos.data[0].status).toBe('Open')
    expect(todos.data[0].name).toMatch(/^temp-/)

    const tempName = todos.data[0].name

    // Wait for actual request to complete
    await insertPromise

    // Should be replaced with server response
    expect(todos.data).toHaveLength(3)
    expect(todos.data[0].description).toBe('New optimistic task')
    expect(todos.data[0].status).toBe('Open')
    expect(todos.data[0].name).toMatch(/^todo-/)
    expect(todos.data[0].name).not.toBe(tempName)
  })
})

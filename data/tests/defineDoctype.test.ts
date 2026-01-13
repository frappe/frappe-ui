/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { defineDoctype } from '../defineDoctype'
import { ToDoDocType } from './doctypes'
import { baseUrl, server, mockTodos } from './mocks'
import { waitFor, waitForLoading } from './setup'
import { http, HttpResponse } from 'msw'
import { ref, nextTick } from 'vue'
import './setup'

describe('defineDoctype', () => {
  describe('getDoc', () => {
    it('fetches a document and returns expected object', async () => {
      const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

      const todo = ToDo.getDoc('todo-1')

      // Verify initial state
      expect(todo.doc).toBe(null)
      expect(todo.error).toBe(null)
      expect(typeof todo.reload).toBe('function')

      await waitForLoading(() => todo.loading)

      // Verify final state
      expect(todo.doc).toStrictEqual({
        name: 'todo-1',
        description: 'First todo item',
        status: 'Open',
        priority: 1,
        assigned_to: 'user1@example.com',
        owner: 'admin@example.com',
        modified: '2026-01-14 10:00:00',
        creation: '2026-01-14 09:00:00',
      })
      expect(todo.error).toBe(null)
      expect(todo.loading).toBe(false)
    })

    it('handles error when document is not found', async () => {
      const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

      const todo = ToDo.getDoc('non-existent')

      await waitForLoading(() => todo.loading)

      expect(todo.doc).toBe(null)
      expect(todo.error).toBeTruthy()
      expect(todo.error.type).toBe('NotFoundError')
    })

    it('can reload the document', async () => {
      const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

      const todo = ToDo.getDoc('todo-1')

      await waitForLoading(() => todo.loading)

      expect(todo.doc?.name).toBe('todo-1')

      // Trigger reload
      todo.reload()

      await waitForLoading(() => todo.loading)

      // Should have the same data
      expect(todo.doc?.name).toBe('todo-1')
      expect(todo.doc?.description).toBe('First todo item')
    })

    it('fetches different document with different name', async () => {
      const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

      const todo1 = ToDo.getDoc('todo-1')
      const todo2 = ToDo.getDoc('todo-2')

      // Wait for both to finish loading
      await waitFor(() => !todo1.loading && !todo2.loading)

      expect(todo1.doc?.name).toBe('todo-1')
      expect(todo1.doc?.status).toBe('Open')

      expect(todo2.doc?.name).toBe('todo-2')
      expect(todo2.doc?.status).toBe('Closed')
    })
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
  })
})

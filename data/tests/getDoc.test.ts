/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { defineDoctype } from '../defineDoctype'
import { ToDoDocType } from './doctypes'
import { baseUrl } from './mocks'
import { waitFor, waitForLoading } from './setup'
import { ref, nextTick } from 'vue'
import './setup'

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

  it('refetches when reactive name changes', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todoName = ref('todo-1')
    const todo = ToDo.getDoc(todoName)

    await waitForLoading(() => todo.loading)

    expect(todo.doc?.name).toBe('todo-1')
    expect(todo.doc?.status).toBe('Open')

    // Change the name
    todoName.value = 'todo-2'

    // Wait for Vue to process the change
    await nextTick()
    await nextTick()

    await waitForLoading(() => todo.loading)

    // Should now have todo-2 data
    expect(todo.doc?.name).toBe('todo-2')
    expect(todo.doc?.status).toBe('Closed')
  })

  it('can update document fields with setValue', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todo = ToDo.getDoc('todo-1')

    await waitForLoading(() => todo.loading)

    expect(todo.doc?.status).toBe('Open')
    expect(todo.doc?.description).toBe('First todo item')

    // Update fields
    await todo.setValue.submit({
      status: 'Closed',
      description: 'Updated description',
    })

    expect(todo.setValue.loading).toBe(false)
    expect(todo.setValue.error).toBe(null)
    expect(todo.doc?.status).toBe('Closed')
    expect(todo.doc?.description).toBe('Updated description')
  })

  it('can delete a document', async () => {
    const ToDo = defineDoctype<ToDoDocType>('ToDo', { baseUrl })

    const todo = ToDo.getDoc('todo-1')

    await waitForLoading(() => todo.loading)

    expect(todo.doc?.name).toBe('todo-1')

    // Delete the document
    await todo.delete.submit()

    expect(todo.delete.loading).toBe(false)
    expect(todo.delete.error).toBe(null)
    expect(todo.doc).toBe(null)
  })
})

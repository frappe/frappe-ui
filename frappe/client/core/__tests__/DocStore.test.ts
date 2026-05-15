/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { createDocStore } from '../DocStore'

describe('DocStore', () => {
  describe('get / set', () => {
    it('returns null for non-existent doc', () => {
      const store = createDocStore()
      expect(store.get('ToDo', 'todo-1')).toBe(null)
    })

    it('stores and retrieves a doc', () => {
      const store = createDocStore()
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      expect(store.get('ToDo', 'todo-1')).toMatchObject({
        doctype: 'ToDo',
        name: 'todo-1',
        status: 'Open',
      })
    })

    it('merges into existing doc (does not replace)', () => {
      const store = createDocStore()
      store.set({
        doctype: 'ToDo',
        name: 'todo-1',
        status: 'Open',
        priority: 1,
      })
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Closed' })
      const doc = store.get('ToDo', 'todo-1')
      expect(doc?.status).toBe('Closed')
      // priority should still be there from first set
      expect(doc?.priority).toBe(1)
    })

    it('does not bleed data between doctypes', () => {
      const store = createDocStore()
      store.set({ doctype: 'ToDo', name: 'x', value: 1 })
      expect(store.get('Note', 'x')).toBe(null)
    })
  })

  describe('setMany', () => {
    it('sets multiple docs at once', () => {
      const store = createDocStore()
      store.setMany([
        { doctype: 'ToDo', name: 'a', status: 'Open' },
        { doctype: 'ToDo', name: 'b', status: 'Closed' },
      ])
      expect(store.get('ToDo', 'a')?.status).toBe('Open')
      expect(store.get('ToDo', 'b')?.status).toBe('Closed')
    })

    it('merges into existing docs', () => {
      const store = createDocStore()
      store.set({ doctype: 'ToDo', name: 'a', status: 'Open', priority: 5 })
      store.setMany([{ doctype: 'ToDo', name: 'a', status: 'Closed' }])
      expect(store.get('ToDo', 'a')?.priority).toBe(5)
      expect(store.get('ToDo', 'a')?.status).toBe('Closed')
    })
  })

  describe('remove', () => {
    it('removes a doc', () => {
      const store = createDocStore()
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      store.remove('ToDo', 'todo-1')
      expect(store.get('ToDo', 'todo-1')).toBe(null)
    })
  })

  describe('subscribe', () => {
    it('fires synchronously on set', () => {
      const store = createDocStore()
      const listener = vi.fn()
      store.subscribe('ToDo', 'todo-1', listener)

      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'todo-1', status: 'Open' }),
      )
    })

    it('fires with null on remove', () => {
      const store = createDocStore()
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      const listener = vi.fn()
      store.subscribe('ToDo', 'todo-1', listener)
      store.remove('ToDo', 'todo-1')

      expect(listener).toHaveBeenCalledWith(null)
    })

    it('does not fire after unsubscribe', () => {
      const store = createDocStore()
      const listener = vi.fn()
      const unsub = store.subscribe('ToDo', 'todo-1', listener)
      unsub()
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('fires for the correct doc only', () => {
      const store = createDocStore()
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      store.subscribe('ToDo', 'todo-1', listener1)
      store.subscribe('ToDo', 'todo-2', listener2)
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).not.toHaveBeenCalled()
    })
  })

  describe('subscribeDoctype', () => {
    it('fires for any doc change in the doctype', () => {
      const store = createDocStore()
      const listener = vi.fn()
      store.subscribeDoctype('ToDo', listener)

      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      store.set({ doctype: 'ToDo', name: 'todo-2', status: 'Closed' })

      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenNthCalledWith(
        1,
        'todo-1',
        expect.objectContaining({ name: 'todo-1' }),
      )
      expect(listener).toHaveBeenNthCalledWith(
        2,
        'todo-2',
        expect.objectContaining({ name: 'todo-2' }),
      )
    })

    it('does not fire for a different doctype', () => {
      const store = createDocStore()
      const listener = vi.fn()
      store.subscribeDoctype('Note', listener)
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('unsubscribes correctly', () => {
      const store = createDocStore()
      const listener = vi.fn()
      const unsub = store.subscribeDoctype('ToDo', listener)
      unsub()
      store.set({ doctype: 'ToDo', name: 'todo-1', status: 'Open' })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('hydrate', () => {
    it('loads docs without notifying subscribers', () => {
      const store = createDocStore()
      const listener = vi.fn()
      store.subscribe('ToDo', 'todo-1', listener)

      store.hydrate([{ doctype: 'ToDo', name: 'todo-1', status: 'Open' }])

      expect(listener).not.toHaveBeenCalled()
      expect(store.get('ToDo', 'todo-1')?.status).toBe('Open')
    })
  })

  describe('getAll', () => {
    it('returns all docs for a doctype', () => {
      const store = createDocStore()
      store.set({ doctype: 'ToDo', name: 'a' })
      store.set({ doctype: 'ToDo', name: 'b' })
      store.set({ doctype: 'Note', name: 'c' })

      const todos = store.getAll('ToDo')
      expect(todos).toHaveLength(2)
      expect(todos.map((d) => d.name).sort()).toEqual(['a', 'b'])
    })

    it('returns empty array when no docs', () => {
      const store = createDocStore()
      expect(store.getAll('ToDo')).toEqual([])
    })
  })
})

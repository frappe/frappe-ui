import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createConnection } from '../connection'
import { createStore, memoryAdapter } from '../store'
import { createQueue, memoryQueueAdapter } from '../queue'
import { createMockTransport } from './mock-transport'

function newHarness() {
  const server = createMockTransport()
  const store = createStore({ adapter: memoryAdapter() })
  const queue = createQueue({ adapter: memoryQueueAdapter() })
  const conn = createConnection({ transport: server.transport, store, queue })
  return { server, store, queue, conn }
}

describe('connection — subscribe/pull lifecycle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('subscribe pulls the initial snapshot into the store', async () => {
    const { server, store, conn } = newHarness()
    server.insert('Task', { name: 't1', title: 'A', status: 'Open' })
    server.insert('Task', { name: 't2', title: 'B', status: 'Open' })

    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    expect(store.list('Task').map((d) => d.name).sort()).toEqual(['t1', 't2'])
  })

  it('a sync.change triggers a debounced pull that lands the update', async () => {
    const { server, store, conn } = newHarness()
    server.insert('Task', { name: 't1', title: 'A', status: 'Open' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    server.update('Task', 't1', { title: 'A2' })
    await vi.runAllTimersAsync()
    await Promise.resolve()

    expect(store.get('Task', 't1')?.title).toBe('A2')
  })

  it('multiple changes coalesce into one pull (debounce)', async () => {
    const { server, conn } = newHarness()
    server.insert('Task', { name: 't1' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    const before = server.pullCalls.length
    server.update('Task', 't1', { title: 'x' })
    server.update('Task', 't1', { title: 'y' })
    server.update('Task', 't1', { title: 'z' })
    await vi.runAllTimersAsync()
    // Expect one additional pull, not three.
    expect(server.pullCalls.length - before).toBe(1)
  })

  it('resync: true triggers a snapshot rebuild from a fresh pull', async () => {
    const { server, store, conn } = newHarness()
    server.insert('Task', { name: 't1' })
    server.insert('Task', { name: 't2' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    // Server drops old cursor and returns resync
    server.simulateResyncNext()
    server.update('Task', 't1', { title: 'zap' })
    await vi.runAllTimersAsync()

    // After resync, docs are still present (they came from the fresh pull that followed)
    expect(store.list('Task').length).toBeGreaterThan(0)
  })

  it('deletes since cursor are applied to the store', async () => {
    const { server, store, conn } = newHarness()
    server.insert('Task', { name: 't1' })
    server.insert('Task', { name: 't2' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    server.delete('Task', 't1')
    await vi.runAllTimersAsync()
    expect(store.get('Task', 't1')).toBeNull()
    expect(store.get('Task', 't2')).not.toBeNull()
  })

  it('unsubscribe stops pull traffic for that sub', async () => {
    const { server, conn } = newHarness()
    server.insert('Task', { name: 't1' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready
    const before = server.pullCalls.length
    sub.dispose()
    server.update('Task', 't1', { title: 'x' })
    await vi.runAllTimersAsync()
    // No new pull after unsubscribe
    expect(server.pullCalls.length).toBe(before)
  })
})

describe('connection — push draining', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('enqueued mutation drains as one push and clears from queue', async () => {
    const { server, queue, conn } = newHarness()
    server.insert('Task', { name: 't1', title: 'A', modified: '1' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    await conn.push({
      id: 'm1',
      op: 'set_value',
      doctype: 'Task',
      name: 't1',
      values: { status: 'Done' },
      base: '1',
    })
    await vi.runAllTimersAsync()

    expect(server.pushCalls).toHaveLength(1)
    expect(queue.pending()).toEqual([])
  })

  it('a single in-flight push at a time — later enqueues wait', async () => {
    const { server, conn } = newHarness()
    let resolveFirst!: (v: any) => void
    server.handlePushWith(
      () => new Promise((r) => (resolveFirst = r)),
    )
    void conn.push({ id: 'm1', op: 'set_value', doctype: 'Task', name: 't1', values: { s: 1 } })
    void conn.push({ id: 'm2', op: 'set_value', doctype: 'Task', name: 't1', values: { s: 2 } })
    await vi.runAllTimersAsync()
    // Only one push batch out so far
    expect(server.pushCalls.length).toBeLessThanOrEqual(1)
    // Free the queue by switching back to default handler and resolving
    server.handlePushWith((mutations) => ({
      results: mutations.map((m) => ({ id: m.id, status: 'applied' as const })),
    }))
    resolveFirst({
      results: [{ id: 'm1', status: 'applied' }],
    })
    await vi.runAllTimersAsync()
    // Second batch is now sent
    expect(server.pushCalls.length).toBeGreaterThanOrEqual(2)
  })

  it('conflict result → queue drops mutation, conflict emitted', async () => {
    const { server, queue, conn } = newHarness()
    server.insert('Task', { name: 't1', title: 'A', modified: '5' })
    const sub = conn.subscribe({ kind: 'list', doctype: 'Task' })
    await vi.runAllTimersAsync()
    await sub.ready

    const conflicts: any[] = []
    conn.onConflict((c) => conflicts.push(c))

    await conn.push({
      id: 'm1',
      op: 'set_value',
      doctype: 'Task',
      name: 't1',
      values: { status: 'Done' },
      base: 'STALE',
    })
    await vi.runAllTimersAsync()

    expect(queue.pending()).toEqual([])
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].id).toBe('m1')
  })

  it('temp-name rename propagates to later queued mutations before drain', async () => {
    const { server, queue, conn } = newHarness()

    // Pause the first batch so m2 gets enqueued while m1 is in flight.
    let resolveFirst!: (v: any) => void
    server.handlePushWith(() => new Promise((r) => (resolveFirst = r)))

    void conn.push({
      id: 'm1',
      op: 'insert',
      doctype: 'Task',
      name: 'local:1',
      values: { title: 'X' },
    })
    // Let m1's drain reach the paused transport.push before enqueuing m2, so m2 is
    // guaranteed to land in a *later* batch (not folded into the first).
    await vi.runAllTimersAsync()
    await Promise.resolve()
    await Promise.resolve()
    void conn.push({
      id: 'm2',
      op: 'set_value',
      doctype: 'Task',
      name: 'local:1', // app hasn't awaited m1
      values: { status: 'Done' },
    })
    await vi.runAllTimersAsync()

    // Second-batch handler: default (echo)
    server.handlePushWith((mutations) => ({
      results: mutations.map((m) => ({ id: m.id, status: 'applied' as const, doc: { name: m.name } as any })),
    }))
    // Ack the first insert with the server-assigned name TASK-1
    resolveFirst({
      results: [{ id: 'm1', status: 'applied', doc: { name: 'TASK-1', title: 'X' } }],
    })
    await vi.runAllTimersAsync()

    const m2Call = server.pushCalls.find((c) => c.mutations.some((mm) => mm.id === 'm2'))!
    const sent = m2Call.mutations.find((mm) => mm.id === 'm2')!
    expect(sent.name).toBe('TASK-1')
    expect(queue.pending()).toEqual([])
  })
})

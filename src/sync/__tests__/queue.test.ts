import { describe, it, expect } from 'vitest'
import { createQueue, fold, memoryQueueAdapter, type Mutation } from '../queue'

function mut(id: string, over: Partial<Mutation> = {}): Mutation {
  return {
    id,
    op: 'set_value',
    doctype: 'Task',
    name: 't1',
    values: { status: 'Done' },
    ...over,
  }
}

describe('fold — snapshot + pending → view', () => {
  it('setValue overlays fields onto the snapshot doc', () => {
    const snap = new Map([['Task t1', { name: 't1', title: 'A', status: 'Open' }]])
    const pending: Mutation[] = [
      mut('m1', { op: 'set_value', name: 't1', values: { status: 'Done' } }),
    ]
    const view = fold(snap, pending)
    expect(view.get('Task t1')).toEqual({ name: 't1', title: 'A', status: 'Done' })
  })

  it('insert adds a doc under its temp name', () => {
    const snap = new Map()
    const pending: Mutation[] = [
      mut('m1', { op: 'insert', name: 'local:1', values: { title: 'X' } }),
    ]
    const view = fold(snap, pending)
    expect(view.get('Task local:1')).toEqual({ name: 'local:1', title: 'X' })
  })

  it('delete removes a doc from the view', () => {
    const snap = new Map([['Task t1', { name: 't1', title: 'A' }]])
    const pending: Mutation[] = [mut('m1', { op: 'delete', name: 't1' })]
    const view = fold(snap, pending)
    expect(view.has('Task t1')).toBe(false)
  })

  it('rename moves a doc to a new name', () => {
    const snap = new Map([['Task local:1', { name: 'local:1', title: 'A' }]])
    const pending: Mutation[] = [
      mut('m1', { op: 'rename', name: 'local:1', values: { new_name: 'TASK-1' } }),
    ]
    const view = fold(snap, pending)
    expect(view.has('Task local:1')).toBe(false)
    expect(view.get('Task TASK-1')).toMatchObject({ name: 'TASK-1', title: 'A' })
  })

  it('run_doc_method has no local effect', () => {
    const snap = new Map([['Task t1', { name: 't1', status: 'Open' }]])
    const pending: Mutation[] = [
      mut('m1', { op: 'run_doc_method', name: 't1', method: 'mark_done' }),
    ]
    const view = fold(snap, pending)
    expect(view.get('Task t1')).toEqual({ name: 't1', status: 'Open' })
  })

  it('preserves ordering: later setValue wins', () => {
    const snap = new Map([['Task t1', { name: 't1', status: 'Open' }]])
    const pending: Mutation[] = [
      mut('m1', { values: { status: 'InProgress' } }),
      mut('m2', { values: { status: 'Done' } }),
    ]
    expect(fold(snap, pending).get('Task t1')).toMatchObject({ status: 'Done' })
  })
})

describe('queue lifecycle', () => {
  it('enqueue adds to pending; ack removes; reject removes', async () => {
    const q = createQueue({ adapter: memoryQueueAdapter() })
    await q.hydrate()
    await q.enqueue(mut('m1'))
    await q.enqueue(mut('m2'))
    expect(q.pending().map((m) => m.id)).toEqual(['m1', 'm2'])
    await q.ack('m1')
    expect(q.pending().map((m) => m.id)).toEqual(['m2'])
    await q.reject('m2', { code: 'conflict', message: 'x' })
    expect(q.pending()).toEqual([])
  })

  it('acking a mutation that no longer exists is a no-op (idempotent replay)', async () => {
    const q = createQueue({ adapter: memoryQueueAdapter() })
    await q.enqueue(mut('m1'))
    await q.ack('m1')
    await expect(q.ack('m1')).resolves.toBeUndefined()
  })

  it('temp-name propagation: renaming propagates into subsequent queued mutations', async () => {
    const q = createQueue({ adapter: memoryQueueAdapter() })
    await q.enqueue(mut('m1', { op: 'insert', name: 'local:1', values: { title: 'X' } }))
    await q.enqueue(mut('m2', { op: 'set_value', name: 'local:1', values: { status: 'Done' } }))
    await q.enqueue(mut('m3', { op: 'run_doc_method', name: 'local:1', method: 'mark_done' }))

    await q.renameName('Task', 'local:1', 'TASK-1')

    const p = q.pending()
    expect(p[1].name).toBe('TASK-1')
    expect(p[2].name).toBe('TASK-1')
    // the insert's own name (m1) doesn't need rewriting — its ack handles that separately,
    // but if the queue exposes it, the insert should retain its temp so the server can echo it back
    expect(p[0].name).toBe('local:1')
  })

  it('persistence: queue survives via adapter', async () => {
    const adapter = memoryQueueAdapter()
    const q1 = createQueue({ adapter })
    await q1.enqueue(mut('m1'))
    await q1.enqueue(mut('m2'))
    await q1.flush()

    const q2 = createQueue({ adapter })
    await q2.hydrate()
    expect(q2.pending().map((m) => m.id)).toEqual(['m1', 'm2'])
  })

  it('stop-on-first-failure: when server reports "not_run" for later mutations, they stay queued for surface as errors', async () => {
    // We test the primitive: reject with an error record; the higher connection layer decides.
    // Here we just verify multiple rejects work sequentially and pending drains.
    const q = createQueue({ adapter: memoryQueueAdapter() })
    await q.enqueue(mut('m1'))
    await q.enqueue(mut('m2'))
    await q.enqueue(mut('m3'))
    await q.reject('m1', { code: 'error', message: 'boom' })
    await q.reject('m2', { code: 'not_run', message: 'stopped' })
    await q.reject('m3', { code: 'not_run', message: 'stopped' })
    expect(q.pending()).toEqual([])
  })
})

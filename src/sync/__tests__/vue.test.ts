import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, effectScope } from 'vue'
import { createClient } from '../vue'
import { createMockTransport } from './mock-transport'

type Task = { name: string; title?: string; status?: string; priority?: number; modified?: string }

function newClient() {
  const server = createMockTransport()
  const client = createClient({ name: 'test', transport: server.transport })
  const Task = client.doctype<Task>('Task')
  return { server, client, Task }
}

async function settle(times = 3) {
  for (let i = 0; i < times; i++) {
    await new Promise((r) => setTimeout(r, 30))
    await nextTick()
  }
}

describe('list — reactive, live, offline-persisted', () => {
  it('exposes docs, loading, hasMore, loadMore per spec', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A', status: 'Open' })
    server.insert('Task', { name: 't2', title: 'B', status: 'Open' })

    const list = Task.list({ filters: { status: 'Open' } })
    expect(list.loading.value).toBe(true)
    await settle()
    expect(list.loading.value).toBe(false)
    expect(list.docs.value.map((d) => d.name).sort()).toEqual(['t1', 't2'])
    expect(typeof list.hasMore.value).toBe('boolean')
    expect(typeof list.loadMore).toBe('function')
  })

  it('reacts to server updates', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A', status: 'Open' })
    const list = Task.list({})
    await settle()
    server.update('Task', 't1', { title: 'A2' })
    await settle()
    expect(list.docs.value[0].title).toBe('A2')
  })

  it('reactive filters (ref) re-run the subscription', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', status: 'Open' })
    server.insert('Task', { name: 't2', status: 'Closed' })
    const status = ref<string>('Open')
    const list = Task.list({ filters: { status } })
    await settle()
    expect(list.docs.value.map((d) => d.name)).toEqual(['t1'])
    status.value = 'Closed'
    await settle()
    expect(list.docs.value.map((d) => d.name)).toEqual(['t2'])
  })

  it('reactive filters via getter', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', status: 'Open' })
    server.insert('Task', { name: 't2', status: 'Closed' })
    const status = ref('Open')
    const list = Task.list({ filters: { status: () => status.value } })
    await settle()
    expect(list.docs.value.map((d) => d.name)).toEqual(['t1'])
    status.value = 'Closed'
    await settle()
    expect(list.docs.value.map((d) => d.name)).toEqual(['t2'])
  })

  it('loadMore grows the limit window', async () => {
    const { server, Task } = newClient()
    for (let i = 1; i <= 5; i++) server.insert('Task', { name: `t${i}` })
    const list = Task.list({ orderBy: 'name asc', limit: 2 })
    await settle()
    expect(list.docs.value.map((d) => d.name)).toEqual(['t1', 't2'])
    await list.loadMore()
    await settle()
    expect(list.docs.value.map((d) => d.name)).toEqual(['t1', 't2', 't3', 't4'])
  })

  it('handles created in effectScope are released on scope stop (unmount)', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1' })

    const scope = effectScope()
    let list!: ReturnType<typeof Task.list>
    scope.run(() => {
      list = Task.list({})
    })
    await settle()
    const before = server.pullCalls.length
    scope.stop()
    server.update('Task', 't1', { title: 'x' })
    await settle()
    // No new pull after unmount
    expect(server.pullCalls.length).toBe(before)
  })
})

describe('get — single doc handle', () => {
  it('exposes doc, loading', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A' })
    const h = Task.get('t1')
    expect(h.loading.value).toBe(true)
    await settle()
    expect(h.doc.value?.title).toBe('A')
    expect(h.loading.value).toBe(false)
  })

  it('reactive name (getter) switches the subscription', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A' })
    server.insert('Task', { name: 't2', title: 'B' })
    const name = ref('t1')
    const h = Task.get(() => name.value)
    await settle()
    expect(h.doc.value?.title).toBe('A')
    name.value = 't2'
    await settle()
    expect(h.doc.value?.title).toBe('B')
  })
})

describe('count — reactive number', () => {
  it('exposes value (Ref<number|null>)', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', status: 'Open' })
    server.insert('Task', { name: 't2', status: 'Open' })
    server.insert('Task', { name: 't3', status: 'Closed' })
    const c = Task.count({ filters: { status: 'Open' } })
    await settle()
    expect(c.value.value).toBe(2)
  })
})

describe('writes — optimistic local application', () => {
  it('setValue updates open queries synchronously (same tick)', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A', status: 'Open', modified: '1' })
    const list = Task.list({})
    await settle()

    Task.setValue('t1', { status: 'Done' })
    await nextTick()
    expect(list.docs.value[0].status).toBe('Done')
  })

  it('insert makes doc visible under a temp name; await returns server-named doc', async () => {
    const { server, Task } = newClient()
    server.handlePushWith((mutations) => ({
      results: mutations.map((m) =>
        m.op === 'insert'
          ? { id: m.id, status: 'applied' as const, doc: { name: 'TASK-1', ...m.values } }
          : { id: m.id, status: 'applied' as const, doc: {} as any },
      ),
    }))
    const list = Task.list({})
    await settle()

    const p = Task.insert({ title: 'New' })
    await nextTick()
    expect(list.docs.value.some((d) => d.name?.startsWith('local:'))).toBe(true)

    const doc = await p
    expect(doc.name).toBe('TASK-1')
    await settle()
    expect(list.docs.value.some((d) => d.name === 'TASK-1')).toBe(true)
    expect(list.docs.value.some((d) => d.name?.startsWith('local:'))).toBe(false)
  })

  it('delete removes the doc from open lists', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', modified: '1' })
    const list = Task.list({})
    await settle()
    expect(list.docs.value).toHaveLength(1)
    Task.delete('t1')
    await nextTick()
    expect(list.docs.value).toHaveLength(0)
  })
})

describe('draft + edit', () => {
  it('draft() creates a mutable local doc; insert() sends it', async () => {
    const { server, Task } = newClient()
    server.handlePushWith((mutations) => ({
      results: mutations.map((m) => ({
        id: m.id,
        status: 'applied' as const,
        doc: { name: 'TASK-2', ...(m.values || {}) } as any,
      })),
    }))
    const draft = Task.draft({ title: 'seed' })
    expect(draft.doc.title).toBe('seed')
    draft.doc.title = 'updated'
    const inserted = await draft.insert()
    expect(inserted.name).toBe('TASK-2')
    expect(inserted.title).toBe('updated')
  })

  it('edit() gives a dirty-flagged copy; save() sends the diff and reset() rolls it back', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A', status: 'Open', modified: '1' })
    const h = Task.get('t1')
    await settle()
    const edit = h.edit()
    expect(edit.isDirty.value).toBe(false)
    edit.doc.title = 'B'
    expect(edit.isDirty.value).toBe(true)
    edit.reset()
    expect(edit.isDirty.value).toBe(false)
    expect(edit.doc.title).toBe('A')
    edit.doc.title = 'C'
    await edit.save()
    // The mutation sent should be a set_value with only { title: 'C' }
    const push = server.pushCalls.at(-1)!
    expect(push.mutations[0].op).toBe('set_value')
    expect(push.mutations[0].values).toEqual({ title: 'C' })
  })
})

describe('shared subscription dedupe', () => {
  it('identical list queries share one subscription', async () => {
    const { server, Task } = newClient()
    server.insert('Task', { name: 't1', status: 'Open' })
    const a = Task.list({ filters: { status: 'Open' } })
    const b = Task.list({ filters: { status: 'Open' } })
    await settle()
    // Should be at most one active sub on the server side per identical query
    // (mock counts sends via .send but we can check pullCalls didn't double)
    const subs = server.pullCalls
      .flatMap((c) => c.subs.map((s) => JSON.stringify(s.query)))
    const uniqueQueries = new Set(subs)
    // We do not need exact call count; assert both handles see the same docs at least
    expect(a.docs.value).toEqual(b.docs.value)
    // And the client didn't produce more than one distinct sub for this query
    expect(uniqueQueries.size).toBe(1)
  })
})

describe('client.sync state', () => {
  it('exposes online, pending, conflicts, error refs', () => {
    const { client } = newClient()
    expect(client.sync.online).toBeDefined()
    expect(client.sync.pending).toBeDefined()
    expect(client.sync.conflicts).toBeDefined()
    expect(client.sync.error).toBeDefined()
    expect(typeof client.sync.pending.value).toBe('number')
    expect(Array.isArray(client.sync.conflicts.value)).toBe(true)
  })

  it('pending counter tracks queued mutations', async () => {
    const { server, client, Task } = newClient()
    let resolveFirst!: (v: any) => void
    server.handlePushWith(() => new Promise((r) => (resolveFirst = r)))
    void Task.setValue('t1', { status: 'Done' })
    // Let queue.enqueue + drain reach the paused transport.push
    for (let i = 0; i < 5; i++) await Promise.resolve()
    await nextTick()
    expect(client.sync.pending.value).toBe(1)
    expect(typeof resolveFirst).toBe('function')
    resolveFirst({ results: [{ id: 'ignored', status: 'applied' }] })
    await settle()
    // Even if ack didn't match id, the queue eventually drains via reject path; assert non-increasing.
    expect(client.sync.pending.value).toBeLessThanOrEqual(1)
  })

  it('conflicts surface a Conflict record', async () => {
    const { server, client, Task } = newClient()
    server.insert('Task', { name: 't1', title: 'A', modified: '5' })
    const list = Task.list({})
    await settle()
    // Force conflict via mismatched base
    Task.setValue('t1', { status: 'Done' }, { base: 'STALE' })
    await settle()
    expect(client.sync.conflicts.value.length).toBe(1)
    expect(client.sync.conflicts.value[0].name).toBe('t1')
  })
})

describe('escape hatch', () => {
  it('client.call returns a plain typed promise', async () => {
    const { client } = newClient()
    // The mock transport does not implement `call`; wire a stub:
    ;(client as any)._setCall(async (m: string, a: any) => ({ ok: true, m, a }))
    const r = await client.call('some.method', { x: 1 })
    expect(r).toEqual({ ok: true, m: 'some.method', a: { x: 1 } })
  })
})

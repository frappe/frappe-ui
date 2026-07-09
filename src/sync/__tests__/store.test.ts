import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, memoryAdapter, type StorageAdapter } from '../store'

function newStore(adapter: StorageAdapter = memoryAdapter()) {
  return createStore({ adapter })
}

describe('DocStore — put/get by (doctype, name)', () => {
  it('stores and retrieves a doc', async () => {
    const s = newStore()
    await s.put('Task', { name: 't1', title: 'A', status: 'Open' }, { fields: '*' })
    expect(s.get('Task', 't1')).toEqual({ name: 't1', title: 'A', status: 'Open' })
  })

  it('missing doc returns null', () => {
    const s = newStore()
    expect(s.get('Task', 'nope')).toBeNull()
  })

  it('list scans by doctype', async () => {
    const s = newStore()
    await s.put('Task', { name: 't1' }, { fields: '*' })
    await s.put('Task', { name: 't2' }, { fields: '*' })
    await s.put('Note', { name: 'n1' }, { fields: '*' })
    expect(s.list('Task').map((d) => d.name).sort()).toEqual(['t1', 't2'])
    expect(s.list('Note').map((d) => d.name)).toEqual(['n1'])
    expect(s.list('Empty')).toEqual([])
  })
})

describe('DocStore — field-set tracking (partial vs full)', () => {
  it('a partial put must not clobber a fuller doc', async () => {
    const s = newStore()
    await s.put('Task', { name: 't1', title: 'A', status: 'Open', description: 'full' }, { fields: '*' })
    // partial list result with just two fields
    await s.put('Task', { name: 't1', title: 'A2', status: 'Closed' }, { fields: ['name', 'title', 'status'] })
    // title/status refreshed, description preserved
    expect(s.get('Task', 't1')).toEqual({ name: 't1', title: 'A2', status: 'Closed', description: 'full' })
  })

  it('a fuller put replaces the partial', async () => {
    const s = newStore()
    await s.put('Task', { name: 't1', title: 'A', status: 'Open' }, { fields: ['name', 'title', 'status'] })
    await s.put('Task', { name: 't1', title: 'A', status: 'Open', description: 'full', child: [{ x: 1 }] }, { fields: '*' })
    expect(s.get('Task', 't1')).toEqual({ name: 't1', title: 'A', status: 'Open', description: 'full', child: [{ x: 1 }] })
  })

  it('two partials with disjoint fields merge upward', async () => {
    const s = newStore()
    await s.put('Task', { name: 't1', title: 'A' }, { fields: ['name', 'title'] })
    await s.put('Task', { name: 't1', status: 'Open' }, { fields: ['name', 'status'] })
    expect(s.get('Task', 't1')).toEqual({ name: 't1', title: 'A', status: 'Open' })
  })
})

describe('DocStore — delete', () => {
  it('deletes a doc; get → null; list omits it', async () => {
    const s = newStore()
    await s.put('Task', { name: 't1' }, { fields: '*' })
    await s.delete('Task', 't1')
    expect(s.get('Task', 't1')).toBeNull()
    expect(s.list('Task')).toEqual([])
  })
})

describe('DocStore — rename', () => {
  it('client-initiated rename moves doc to new name', async () => {
    const s = newStore()
    await s.put('Task', { name: 'local:1', title: 'x' }, { fields: '*' })
    await s.rename('Task', 'local:1', 'TASK-0001')
    expect(s.get('Task', 'local:1')).toBeNull()
    expect(s.get('Task', 'TASK-0001')?.name).toBe('TASK-0001')
    expect(s.get('Task', 'TASK-0001')?.title).toBe('x')
  })

  it('rename to a name that already exists: newer wins (merge with existing fields tracked)', async () => {
    const s = newStore()
    await s.put('Task', { name: 'A', title: 'from A' }, { fields: '*' })
    await s.put('Task', { name: 'B', title: 'from B', extra: 1 }, { fields: '*' })
    await s.rename('Task', 'A', 'B')
    // Rename overwrites the destination with the source doc (server-authoritative rename)
    const doc = s.get('Task', 'B')
    expect(doc?.title).toBe('from A')
    expect(s.get('Task', 'A')).toBeNull()
  })
})

describe('DocStore — change notifications', () => {
  it('subscribers on a doctype are called on put/delete/rename', async () => {
    const s = newStore()
    const events: any[] = []
    const unsub = s.subscribe('Task', (evt) => events.push(evt))

    await s.put('Task', { name: 't1', title: 'A' }, { fields: '*' })
    await s.put('Task', { name: 't1', title: 'B' }, { fields: '*' })
    await s.delete('Task', 't1')
    await s.put('Task', { name: 't2' }, { fields: '*' })
    await s.rename('Task', 't2', 't2-final')

    expect(events.map((e) => e.op)).toEqual(['put', 'put', 'delete', 'put', 'rename'])
    expect(events[4]).toMatchObject({ op: 'rename', from: 't2', to: 't2-final' })
    unsub()
    await s.put('Task', { name: 't3' }, { fields: '*' })
    expect(events).toHaveLength(5)
  })

  it('subscribers on other doctypes are not called', async () => {
    const s = newStore()
    const events: any[] = []
    s.subscribe('Note', (e) => events.push(e))
    await s.put('Task', { name: 't1' }, { fields: '*' })
    expect(events).toHaveLength(0)
  })

  it('a partial put that changes nothing still notifies (subscribers may want to re-evaluate)', async () => {
    // Rationale: the change may indicate the server pushed, even if this partial equals the local view.
    // Keep this test explicit so behavior does not silently change.
    const s = newStore()
    await s.put('Task', { name: 't1', title: 'A', extra: 1 }, { fields: '*' })
    const events: any[] = []
    s.subscribe('Task', (e) => events.push(e))
    await s.put('Task', { name: 't1', title: 'A' }, { fields: ['name', 'title'] })
    expect(events).toHaveLength(1)
  })
})

describe('DocStore — persistence via adapter', () => {
  it('memoryAdapter round-trips docs across store instances sharing the same adapter', async () => {
    const adapter = memoryAdapter()
    const s1 = createStore({ adapter })
    await s1.put('Task', { name: 't1', title: 'A' }, { fields: '*' })
    await s1.flush()

    const s2 = createStore({ adapter })
    await s2.hydrate()
    expect(s2.get('Task', 't1')).toEqual({ name: 't1', title: 'A' })
  })

  it('field-set metadata survives hydration', async () => {
    const adapter = memoryAdapter()
    const s1 = createStore({ adapter })
    await s1.put('Task', { name: 't1', title: 'A' }, { fields: ['name', 'title'] })
    await s1.flush()

    const s2 = createStore({ adapter })
    await s2.hydrate()
    // Now write another partial — must still merge, not clobber, if metadata persisted.
    await s2.put('Task', { name: 't1', status: 'Open' }, { fields: ['name', 'status'] })
    expect(s2.get('Task', 't1')).toEqual({ name: 't1', title: 'A', status: 'Open' })
  })
})

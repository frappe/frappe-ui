/**
 * Mutation queue — ordered, persisted, replayable.
 *
 * The queue owns pending mutations from the moment they leave the app (insert/setValue/
 * delete/run_doc_method/rename) until the server acknowledges them. It never rolls back:
 * an accepted mutation drops out of the queue as the authoritative doc lands in the
 * snapshot; a rejected mutation drops out and the view "reverts" simply because the
 * fold no longer sees it.
 *
 * Persistence is behind QueueAdapter — the same shape as StorageAdapter, but scoped
 * to mutation records.
 */

import type { Doc } from './filters'

export type MutationOp = 'insert' | 'set_value' | 'delete' | 'rename' | 'run_doc_method'

export type Mutation = {
  id: string
  op: MutationOp
  doctype: string
  name?: string
  values?: Record<string, any>
  method?: string
  args?: any
  base?: string
}

export type MutationError = { code: string; message: string }

export interface QueueAdapter {
  loadAll(): Promise<Mutation[]>
  save(mutations: Mutation[]): Promise<void>
  remove(ids: string[]): Promise<void>
  clear(): Promise<void>
}

export function memoryQueueAdapter(): QueueAdapter {
  const data = new Map<string, Mutation>()
  return {
    async loadAll() {
      return Array.from(data.values())
    },
    async save(muts) {
      for (const m of muts) data.set(m.id, { ...m })
    },
    async remove(ids) {
      for (const id of ids) data.delete(id)
    },
    async clear() {
      data.clear()
    },
  }
}

export interface Queue {
  hydrate(): Promise<void>
  flush(): Promise<void>
  enqueue(m: Mutation): Promise<void>
  ack(id: string): Promise<void>
  reject(id: string, err: MutationError): Promise<void>
  pending(): Mutation[]
  renameName(doctype: string, from: string, to: string): Promise<void>
  onChange(fn: () => void): () => void
}

export function createQueue(opts: { adapter: QueueAdapter }): Queue {
  const { adapter } = opts
  const list: Mutation[] = []
  const dirty = new Set<string>()
  const removed = new Set<string>()
  const listeners = new Set<() => void>()
  const notify = () => {
    for (const fn of listeners) fn()
  }

  function markDirty(id: string) {
    dirty.add(id)
    removed.delete(id)
  }
  function markRemoved(id: string) {
    removed.add(id)
    dirty.delete(id)
  }

  return {
    async hydrate() {
      const loaded = await adapter.loadAll()
      list.length = 0
      list.push(...loaded)
    },

    async flush() {
      const toSave: Mutation[] = []
      for (const id of dirty) {
        const m = list.find((x) => x.id === id)
        if (m) toSave.push(m)
      }
      if (toSave.length) await adapter.save(toSave)
      if (removed.size) await adapter.remove(Array.from(removed))
      dirty.clear()
      removed.clear()
    },

    async enqueue(m) {
      list.push({ ...m })
      markDirty(m.id)
      notify()
    },

    async ack(id) {
      const idx = list.findIndex((x) => x.id === id)
      if (idx === -1) return
      list.splice(idx, 1)
      markRemoved(id)
      notify()
    },

    async reject(id, _err) {
      const idx = list.findIndex((x) => x.id === id)
      if (idx === -1) return
      list.splice(idx, 1)
      markRemoved(id)
      notify()
    },

    onChange(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },

    pending() {
      return list.map((m) => ({ ...m }))
    },

    async renameName(doctype, from, to) {
      // Skip the mutation that IS the insert of `from` — its own name gets rewritten by ack.
      // We only rewrite mutations that reference `from` after the insert.
      let seenInsert = false
      for (const m of list) {
        if (m.doctype !== doctype) continue
        if (m.op === 'insert' && m.name === from && !seenInsert) {
          seenInsert = true
          continue
        }
        if (m.name === from) {
          m.name = to
          markDirty(m.id)
        }
      }
    },
  }
}

/**
 * fold — snapshot + ordered pending → view snapshot.
 *
 * Keys are `${doctype} ${name}`. Values are plain docs. Callers scope by doctype
 * when building the view for a query.
 */
export function fold(
  snapshot: Map<string, Doc>,
  pending: Mutation[],
): Map<string, Doc> {
  const view = new Map<string, Doc>()
  for (const [k, v] of snapshot) view.set(k, { ...v })

  for (const m of pending) {
    const key = (n: string) => `${m.doctype} ${n}`
    switch (m.op) {
      case 'insert': {
        if (!m.name) break
        const existing = view.get(key(m.name)) ?? { name: m.name }
        view.set(key(m.name), { ...existing, ...(m.values || {}), name: m.name })
        break
      }
      case 'set_value': {
        if (!m.name) break
        const existing = view.get(key(m.name))
        if (!existing) break
        view.set(key(m.name), { ...existing, ...(m.values || {}) })
        break
      }
      case 'delete': {
        if (!m.name) break
        view.delete(key(m.name))
        break
      }
      case 'rename': {
        if (!m.name || !m.values?.new_name) break
        const src = view.get(key(m.name))
        if (!src) break
        view.delete(key(m.name))
        view.set(key(m.values.new_name), { ...src, name: m.values.new_name })
        break
      }
      case 'run_doc_method':
        // effect is server-side; local view unchanged.
        break
    }
  }

  return view
}

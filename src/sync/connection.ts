/**
 * Client-side sync engine.
 *
 * - Subscription bookkeeping: each `subscribe(query)` gets an id, is sent to the
 *   transport as `sync.sub`, and an initial pull lands docs into the store.
 * - Cursor tracking: single client-wide cursor. Every pull advances it; a `resync: true`
 *   response clears the local snapshot and re-pulls all active subs from scratch.
 * - `sync.change` → debounced pull (single batched pull per tick coalesces bursts).
 * - Push draining: one in-flight batch at a time, in order; temp-name renames from
 *   `insert` acks propagate to still-queued mutations before they are sent.
 * - Conflict/error results drop the mutation from the queue and are emitted as
 *   conflict/error events for `client.sync.conflicts` / `.error`.
 */

import type { Doc } from './filters'
import type { Query, Change, Transport, PushResult } from './protocol'
import type { DocStore } from './store'
import type { Queue, Mutation } from './queue'

let subCounter = 0
const nextSubId = () => `sub:${++subCounter}`

const PULL_DEBOUNCE_MS = 20

export type Conflict = {
  id: string
  doctype: string
  name?: string
  local: Mutation
  server?: Doc
  error?: { code: string; message: string }
}

export type ConnectionOpts = {
  transport: Transport
  store: DocStore
  queue: Queue
  pullDebounceMs?: number
}

export type Subscription = {
  id: string
  query: Query
  ready: Promise<void>
  dispose(): void
}

export interface Connection {
  subscribe(query: Query): Subscription
  push(m: Mutation): Promise<void>
  onConflict(fn: (c: Conflict) => void): () => void
  onError(fn: (e: { code: string; message: string }) => void): () => void
  drain(): Promise<void>
  cursor(): number | undefined
}

export function createConnection(opts: ConnectionOpts): Connection {
  const { transport, store, queue } = opts
  const debounceMs = opts.pullDebounceMs ?? PULL_DEBOUNCE_MS

  const subs = new Map<string, Query>()
  const subReadyResolvers = new Map<string, () => void>()
  let cursor: number | undefined
  let debounceTimer: any = null
  const pendingRefreshes = new Set<string>() // sub ids marked dirty by a change
  const conflictListeners = new Set<(c: Conflict) => void>()
  const errorListeners = new Set<(e: { code: string; message: string }) => void>()

  // Listen for change notifications from the transport
  transport.onMessage((msg) => {
    if (msg.type !== 'sync.change') return
    const change = msg.change
    // Mark any sub touching this doctype for refresh
    for (const [id, q] of subs) {
      if (queryTouchesDoctype(q, change.doctype)) pendingRefreshes.add(id)
    }
    scheduleFlush()
  })

  function queryTouchesDoctype(q: Query, doctype: string) {
    if (q.kind === 'view') return true // conservative: any dep may map to any doctype
    return q.doctype === doctype
  }

  function scheduleFlush() {
    if (debounceTimer) return
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      void doPull()
    }, debounceMs)
  }

  async function doPull(): Promise<void> {
    if (subs.size === 0) return
    const subsToRefresh = pendingRefreshes.size
      ? Array.from(pendingRefreshes)
          .filter((id) => subs.has(id))
          .map((id) => ({ id, query: subs.get(id)! }))
      : Array.from(subs.entries()).map(([id, query]) => ({ id, query }))
    pendingRefreshes.clear()

    const resp = await transport.pull({ subs: subsToRefresh, cursor })

    if (resp.resync) {
      // Clear local snapshot for affected doctypes and re-pull all subs from scratch.
      for (const { query } of subsToRefresh) {
        if (query.kind !== 'view') {
          for (const d of store.list(query.doctype)) {
            await store.delete(query.doctype, d.name)
          }
        }
      }
      cursor = undefined
      const all = Array.from(subs.entries()).map(([id, query]) => ({ id, query }))
      const fresh = await transport.pull({ subs: all })
      applyPullResponse(fresh.docs, fresh.deletes, fresh.renames, subsToRefresh)
      cursor = fresh.cursor
    } else {
      applyPullResponse(resp.docs, resp.deletes, resp.renames, subsToRefresh)
      cursor = resp.cursor
    }

    for (const { id } of subsToRefresh) {
      const resolver = subReadyResolvers.get(id)
      if (resolver) {
        resolver()
        subReadyResolvers.delete(id)
      }
    }
  }

  function applyPullResponse(
    docsMap: Record<string, Doc[]>,
    deletesMap: Record<string, string[]>,
    renamesMap: Record<string, Array<{ from: string; to: string }>>,
    subsSlice: Array<{ id: string; query: Query }>,
  ) {
    for (const { id, query } of subsSlice) {
      const docs = docsMap[id] || []
      const deletes = deletesMap[id] || []
      const renames = renamesMap[id] || []

      const doctype = query.kind === 'view' ? null : query.doctype
      const fields =
        query.kind === 'list' && query.fields ? query.fields.concat(['name']) : '*'

      for (const doc of docs) {
        if (!doctype) continue // TODO: views land into a view-scoped store; out of scope here
        void store.put(doctype, doc, { fields: fields as any })
      }
      for (const name of deletes) {
        if (!doctype) continue
        void store.delete(doctype, name)
      }
      for (const { from, to } of renames) {
        if (!doctype) continue
        void store.rename(doctype, from, to)
      }
    }
  }

  const emitConflict = (c: Conflict) => {
    for (const fn of conflictListeners) fn(c)
  }
  const emitError = (e: { code: string; message: string }) => {
    for (const fn of errorListeners) fn(e)
  }

  let pushing: Promise<void> = Promise.resolve()

  async function drainOnce(): Promise<void> {
    const pending = queue.pending()
    if (pending.length === 0) return
    let resp
    try {
      resp = await transport.push(pending)
    } catch (err: any) {
      emitError({ code: 'network', message: err?.message ?? 'push failed' })
      return
    }

    for (const r of resp.results) {
      const original = pending.find((m) => m.id === r.id)
      if (!original) continue
      await handleResult(r, original)
    }
  }

  async function handleResult(r: PushResult, original: Mutation) {
    if (r.status === 'applied') {
      // Insert acks may carry the server-assigned name; propagate rename to queue + store.
      if (original.op === 'insert' && r.doc && original.name && r.doc.name !== original.name) {
        await queue.renameName(original.doctype, original.name, r.doc.name)
        await store.rename(original.doctype, original.name, r.doc.name)
      }
      if (r.doc) {
        await store.put(original.doctype, r.doc, { fields: '*' })
      }
      await queue.ack(r.id)
    } else if (r.status === 'conflict') {
      emitConflict({
        id: r.id,
        doctype: original.doctype,
        name: original.name,
        local: original,
        server: r.doc,
        error: r.error,
      })
      if (r.doc) await store.put(original.doctype, r.doc, { fields: '*' })
      await queue.reject(r.id, r.error ?? { code: 'conflict', message: '' })
    } else if (r.status === 'error') {
      emitError(r.error)
      await queue.reject(r.id, r.error)
    }
  }

  function chainPush(): Promise<void> {
    pushing = pushing.then(drainOnce, drainOnce)
    return pushing
  }

  return {
    subscribe(query) {
      const id = nextSubId()
      subs.set(id, query)
      let resolve!: () => void
      const ready = new Promise<void>((r) => (resolve = r))
      subReadyResolvers.set(id, resolve)
      transport.send({ type: 'sync.sub', id, query })
      pendingRefreshes.add(id)
      scheduleFlush()
      return {
        id,
        query,
        ready,
        dispose() {
          subs.delete(id)
          pendingRefreshes.delete(id)
          transport.send({ type: 'sync.unsub', id })
        },
      }
    },

    async push(m) {
      await queue.enqueue(m)
      // Kick off drain in the background; callers await confirmation via the higher-level
      // Task.insert/setValue promise (which is tied to the ack), not this method.
      void chainPush()
    },

    onConflict(fn) {
      conflictListeners.add(fn)
      return () => conflictListeners.delete(fn)
    },

    onError(fn) {
      errorListeners.add(fn)
      return () => errorListeners.delete(fn)
    },

    async drain() {
      await chainPush()
    },

    cursor() {
      return cursor
    },
  }
}

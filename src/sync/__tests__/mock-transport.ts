/**
 * Deterministic in-memory transport for connection tests.
 *
 * Holds a tiny "server" that keeps docs per-doctype, a cursor, and can push change
 * notifications. Tests drive it via `server.insert/update/delete/rename` and observe
 * effects via the client under test.
 */

import type {
  ClientMsg,
  PullRequest,
  PullResponse,
  PushResponse,
  ServerMsg,
  Transport,
  Change,
  Query,
} from '../protocol'
import type { Doc } from '../filters'
import type { Mutation } from '../queue'
import { applyQuery } from '../filters'

type StoredDoc = Doc

export type MockServer = {
  transport: Transport
  insert(doctype: string, doc: StoredDoc): void
  update(doctype: string, name: string, patch: Partial<StoredDoc>): void
  delete(doctype: string, name: string): void
  rename(doctype: string, from: string, to: string): void
  online(v: boolean): void
  simulateResyncNext(): void
  pushCalls: Array<{ mutations: Mutation[] }>
  pullCalls: Array<PullRequest>
  handlePushWith(fn: (mutations: Mutation[]) => PushResponse | Promise<PushResponse>): void
}

export function createMockTransport(): MockServer {
  const docs = new Map<string, Map<string, StoredDoc>>()
  const changes: Change[] = []
  let cursor = 0
  const subs = new Map<string, Query>() // sub-id → query
  const listeners = new Set<(m: ServerMsg) => void>()
  const onlineListeners = new Set<(o: boolean) => void>()
  let online = true
  let resyncNext = false
  let pushHandler:
    | ((mutations: Mutation[]) => PushResponse | Promise<PushResponse>)
    | null = null
  const pushCalls: Array<{ mutations: Mutation[] }> = []
  const pullCalls: PullRequest[] = []
  const appliedIds = new Set<string>()

  function bucket(dt: string) {
    let m = docs.get(dt)
    if (!m) docs.set(dt, (m = new Map()))
    return m
  }

  function pushChange(op: Change['op'], doctype: string, name: string, newName?: string) {
    cursor += 1
    const c: Change = { seq: cursor, doctype, name, op, newName }
    changes.push(c)
    if (online) {
      for (const l of listeners) l({ type: 'sync.change', change: c })
    }
  }

  const transport: Transport = {
    send(msg: ClientMsg) {
      if (msg.type === 'sync.sub') subs.set(msg.id, msg.query)
      else if (msg.type === 'sync.unsub') subs.delete(msg.id)
    },
    onMessage(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    async pull(req: PullRequest) {
      pullCalls.push(req)
      if (resyncNext) {
        resyncNext = false
        return {
          docs: {},
          deletes: {},
          renames: {},
          counts: {},
          cursor,
          resync: true,
        } as PullResponse
      }

      const docsOut: Record<string, Doc[]> = {}
      const deletesOut: Record<string, string[]> = {}
      const renamesOut: Record<string, Array<{ from: string; to: string }>> = {}
      const countsOut: Record<string, number> = {}

      for (const sub of req.subs) {
        const q = sub.query
        if (q.kind === 'list') {
          const all = Array.from(bucket(q.doctype).values())
          docsOut[sub.id] = applyQuery(all, {
            filters: q.filters,
            orderBy: q.orderBy,
            limit: q.limit,
          })
        } else if (q.kind === 'doc') {
          const d = bucket(q.doctype).get(q.name)
          docsOut[sub.id] = d ? [d] : []
        } else if (q.kind === 'count') {
          const all = Array.from(bucket(q.doctype).values())
          countsOut[sub.id] = applyQuery(all, { filters: q.filters }).length
        }
        // delta since cursor
        if (req.cursor != null) {
          const relevant = changes.filter((c) => c.seq > (req.cursor as number))
          for (const c of relevant) {
            if (q.kind === 'list' || q.kind === 'doc' || q.kind === 'count') {
              if ('doctype' in q && c.doctype === q.doctype) {
                if (c.op === 'delete') {
                  ;(deletesOut[sub.id] ??= []).push(c.name)
                } else if (c.op === 'rename') {
                  ;(renamesOut[sub.id] ??= []).push({ from: c.name, to: c.newName! })
                }
              }
            }
          }
        }
      }
      return { docs: docsOut, deletes: deletesOut, renames: renamesOut, counts: countsOut, cursor }
    },
    async push(mutations: Mutation[]) {
      pushCalls.push({ mutations: mutations.map((m) => ({ ...m })) })
      if (pushHandler) return pushHandler(mutations)

      const results: PushResponse['results'] = []
      let stopped = false
      for (const m of mutations) {
        if (stopped) {
          results.push({
            id: m.id,
            status: 'error',
            error: { code: 'not_run', message: 'stopped by prior failure' },
          })
          continue
        }
        if (appliedIds.has(m.id)) {
          // idempotent replay — synthesize applied ack
          results.push({ id: m.id, status: 'applied' })
          continue
        }
        appliedIds.add(m.id)

        if (m.op === 'insert') {
          const serverName = (m.values?.name as string) || `S:${m.id.slice(0, 4)}`
          const doc = { ...(m.values || {}), name: serverName, modified: String(cursor + 1) }
          bucket(m.doctype).set(serverName, doc)
          pushChange('create', m.doctype, serverName)
          results.push({ id: m.id, status: 'applied', doc })
          if (m.name && m.name.startsWith('local:')) {
            // rename local temp to server name
            pushChange('rename', m.doctype, m.name, serverName)
          }
        } else if (m.op === 'set_value' && m.name) {
          const existing = bucket(m.doctype).get(m.name)
          if (!existing) {
            results.push({
              id: m.id,
              status: 'error',
              error: { code: 'not_found', message: `no ${m.doctype} ${m.name}` },
            })
            stopped = true
            continue
          }
          if (m.base && existing.modified && m.base !== existing.modified) {
            results.push({ id: m.id, status: 'conflict', doc: existing })
            stopped = true
            continue
          }
          const updated = { ...existing, ...(m.values || {}), modified: String(cursor + 1) }
          bucket(m.doctype).set(m.name, updated)
          pushChange('update', m.doctype, m.name)
          results.push({ id: m.id, status: 'applied', doc: updated })
        } else if (m.op === 'delete' && m.name) {
          bucket(m.doctype).delete(m.name)
          pushChange('delete', m.doctype, m.name)
          results.push({ id: m.id, status: 'applied' })
        } else if (m.op === 'rename' && m.name && m.values?.new_name) {
          const src = bucket(m.doctype).get(m.name)
          if (src) {
            bucket(m.doctype).delete(m.name)
            bucket(m.doctype).set(m.values.new_name, { ...src, name: m.values.new_name })
          }
          pushChange('rename', m.doctype, m.name, m.values.new_name)
          results.push({ id: m.id, status: 'applied', doc: src })
        } else if (m.op === 'run_doc_method' && m.name) {
          const doc = bucket(m.doctype).get(m.name)
          results.push({ id: m.id, status: 'applied', doc })
        } else {
          results.push({
            id: m.id,
            status: 'error',
            error: { code: 'bad_request', message: 'unsupported op or missing fields' },
          })
          stopped = true
        }
      }
      return { results }
    },
    isOnline: () => online,
    onOnlineChange(fn) {
      onlineListeners.add(fn)
      return () => onlineListeners.delete(fn)
    },
  }

  return {
    transport,
    insert(dt, d) {
      bucket(dt).set(d.name, { ...d, modified: String(cursor + 1) })
      pushChange('create', dt, d.name)
    },
    update(dt, name, patch) {
      const existing = bucket(dt).get(name)
      if (!existing) return
      const updated = { ...existing, ...patch, modified: String(cursor + 1) }
      bucket(dt).set(name, updated)
      pushChange('update', dt, name)
    },
    delete(dt, name) {
      bucket(dt).delete(name)
      pushChange('delete', dt, name)
    },
    rename(dt, from, to) {
      const src = bucket(dt).get(from)
      if (src) {
        bucket(dt).delete(from)
        bucket(dt).set(to, { ...src, name: to })
      }
      pushChange('rename', dt, from, to)
    },
    online(v) {
      online = v
      for (const l of onlineListeners) l(v)
    },
    simulateResyncNext() {
      resyncNext = true
    },
    pushCalls,
    pullCalls,
    handlePushWith(fn) {
      pushHandler = fn
    },
  }
}

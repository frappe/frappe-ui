/**
 * Vue adapter — implements the public API from spec Part 1.
 *
 * createClient wires a transport, store, queue, and connection. Doctype handles
 * (list/get/count/insert/setValue/delete/draft) hide the machinery. Reads are Refs
 * over a folded view of (server snapshot + pending mutations). Writes enqueue and
 * apply optimistically.
 */

import {
  ref,
  computed,
  isRef,
  watch,
  reactive,
  toRaw,
  onScopeDispose,
  getCurrentScope,
  type Ref,
} from 'vue'
import { applyQuery, matches, type Doc, type Filters, type FilterValue } from './filters'
import { createStore, memoryAdapter, type DocStore, type StorageAdapter } from './store'
import { createQueue, memoryQueueAdapter, type Queue, type QueueAdapter, type Mutation } from './queue'
import { createConnection, type Connection, type Conflict } from './connection'
import type { Query, Transport } from './protocol'

let nextMutId = 0
const uuid = () => `m:${Date.now().toString(36)}:${++nextMutId}`

function tempName() {
  return `local:${Math.random().toString(36).slice(2, 10)}`
}

type Resolvable<T> = T | Ref<T> | (() => T)
function resolve<T>(v: Resolvable<T>): T {
  if (typeof v === 'function') return (v as () => T)()
  if (isRef(v)) return v.value
  return v as T
}
function resolveFilters(f?: Record<string, Resolvable<FilterValue>>): Filters | undefined {
  if (!f) return undefined
  const out: Filters = {}
  for (const k of Object.keys(f)) out[k] = resolve(f[k]) as FilterValue
  return out
}

type ListOptions = {
  filters?: Record<string, Resolvable<FilterValue>>
  orderBy?: string
  limit?: number
  fields?: string[]
}

type ListHandle<T extends Doc> = {
  docs: Ref<T[]>
  loading: Ref<boolean>
  hasMore: Ref<boolean>
  loadMore(): Promise<void>
}

type GetHandle<T extends Doc> = {
  doc: Ref<T | null>
  loading: Ref<boolean>
  edit(): EditHandle<T>
}

type CountHandle = { value: Ref<number | null> }

type DraftHandle<T extends Doc> = {
  doc: T
  insert(): Promise<T>
}

type EditHandle<T extends Doc> = {
  doc: T
  isDirty: Ref<boolean>
  save(): Promise<void>
  reset(): void
}

export type ClientOptions = {
  name: string
  transport?: Transport
  storage?: StorageAdapter
  queueStorage?: QueueAdapter
}

export type ClientSync = {
  online: Ref<boolean>
  pending: Ref<number>
  conflicts: Ref<Conflict[]>
  error: Ref<{ code: string; message: string } | null>
}

export type Client = {
  sync: ClientSync
  doctype<T extends Doc>(name: string, spec?: { methods?: Record<string, string> }): Doctype<T>
  call<R = any>(method: string, args?: any): Promise<R>
  _internal: { store: DocStore; queue: Queue; connection: Connection }
}

export type Doctype<T extends Doc> = {
  list(opts?: ListOptions): ListHandle<T>
  get(name: Resolvable<string>): GetHandle<T>
  count(opts?: { filters?: Record<string, Resolvable<FilterValue>> }): CountHandle
  insert(values: Partial<T>): Promise<T>
  setValue(name: string, values: Partial<T>, opts?: { base?: string }): Promise<void>
  delete(name: string): Promise<void>
  draft(seed?: Partial<T>): DraftHandle<T>
}

export function createClient(opts: ClientOptions): Client {
  const store = createStore({ adapter: opts.storage ?? memoryAdapter() })
  const queue = createQueue({ adapter: opts.queueStorage ?? memoryQueueAdapter() })

  // For real use, callers pass a transport; tests always pass one.
  if (!opts.transport) {
    throw new Error('createClient: transport is required (HTTP/socket adapter TBD)')
  }
  const connection = createConnection({ transport: opts.transport, store, queue })

  const online = ref(opts.transport.isOnline?.() ?? true)
  const pending = ref(0)
  const conflicts = ref<Conflict[]>([])
  const error = ref<{ code: string; message: string } | null>(null)
  opts.transport.onOnlineChange?.((o) => (online.value = o))
  connection.onConflict((c) => {
    conflicts.value = [...conflicts.value, c]
  })
  connection.onError((e) => (error.value = e))

  const sync: ClientSync = { online, pending, conflicts, error }

  const bumpPending = () => (pending.value = queue.pending().length)
  queue.onChange(bumpPending)

  // Subscription dedupe: query key → { sub, refcount, docs cache }
  const sharedSubs = new Map<
    string,
    {
      dispose: () => void
      refcount: number
      query: Query
    }
  >()

  function acquireSub(query: Query): { subId: string; dispose: () => void } {
    const key = JSON.stringify(query)
    let entry = sharedSubs.get(key) as any
    if (!entry) {
      const sub = connection.subscribe(query)
      entry = {
        subId: sub.id,
        dispose: () => sub.dispose(),
        refcount: 0,
        query,
      }
      sharedSubs.set(key, entry)
    }
    entry.refcount++
    return {
      subId: entry.subId,
      dispose: () => {
        entry!.refcount--
        if (entry!.refcount === 0) {
          entry!.dispose()
          sharedSubs.delete(key)
        }
      },
    }
  }

  // Track store changes to trigger view recomputation
  const storeRev = ref(0)
  const bumpRev = () => (storeRev.value = storeRev.value + 1)
  connection.onPull(bumpRev)
  // Subscribe lazily on first use per doctype (or globally — cheaper globally here)
  const subscribedDoctypes = new Set<string>()
  function ensureStoreSub(dt: string) {
    if (subscribedDoctypes.has(dt)) return
    subscribedDoctypes.add(dt)
    store.subscribe(dt, bumpRev)
  }

  function doctype<T extends Doc>(name: string): Doctype<T> {
    ensureStoreSub(name)

    function list(options: ListOptions = {}): ListHandle<T> {
      const localLimit = ref(options.limit)
      const loading = ref(true)
      const currentSub = ref<null | { subId: string; dispose: () => void }>(null)
      const currentKey = ref('')

      const query = computed<Query>(() => ({
        kind: 'list' as const,
        doctype: name,
        filters: resolveFilters(options.filters),
        orderBy: options.orderBy,
        limit: localLimit.value,
        fields: options.fields,
      }))

      // Re-subscribe when the query changes
      watch(
        query,
        (q) => {
          const key = JSON.stringify(q)
          if (key === currentKey.value) return
          currentKey.value = key
          currentSub.value?.dispose()
          loading.value = true
          currentSub.value = acquireSub(q)
          // Optimistic: mark loading false when data appears
          const stop = watch(storeRev, () => {
            loading.value = false
            stop()
          })
        },
        { immediate: true },
      )

      if (getCurrentScope()) {
        onScopeDispose(() => currentSub.value?.dispose())
      }

      const docs = computed<T[]>(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        storeRev.value
        const snap = store.list(name) as T[]
        // Fold pending mutations for this doctype
        const pendingMuts = queue.pending().filter((m) => m.doctype === name)
        const folded = foldForDoctype(snap, pendingMuts) as T[]
        return applyQuery(folded, {
          filters: resolveFilters(options.filters),
          orderBy: options.orderBy,
          limit: localLimit.value,
        })
      })

      const hasMore = computed(() => {
        if (localLimit.value == null) return false
        // heuristic: we hit limit exactly
        return docs.value.length >= (localLimit.value ?? 0)
      })

      async function loadMore() {
        if (localLimit.value == null) return
        localLimit.value = localLimit.value + (options.limit ?? 20)
      }

      return { docs, loading, hasMore, loadMore }
    }

    function get(nameArg: Resolvable<string>): GetHandle<T> {
      const loading = ref(true)
      const currentSub = ref<null | { subId: string; dispose: () => void }>(null)
      const currentKey = ref('')

      const query = computed<Query>(() => ({
        kind: 'doc' as const,
        doctype: name,
        name: resolve(nameArg),
      }))

      watch(
        query,
        (q) => {
          const key = JSON.stringify(q)
          if (key === currentKey.value) return
          currentKey.value = key
          currentSub.value?.dispose()
          loading.value = true
          currentSub.value = acquireSub(q)
          const stop = watch(storeRev, () => {
            loading.value = false
            stop()
          })
        },
        { immediate: true },
      )

      if (getCurrentScope()) {
        onScopeDispose(() => currentSub.value?.dispose())
      }

      const doc = computed<T | null>(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        storeRev.value
        const nm = resolve(nameArg)
        const pendingMuts = queue.pending().filter((m) => m.doctype === name)
        const snapDoc = store.get(name, nm) as T | null
        if (!snapDoc && pendingMuts.length === 0) return null
        const single = new Map<string, Doc>()
        if (snapDoc) single.set(`${name} ${nm}`, snapDoc)
        const folded = foldForDoctype(Array.from(single.values()) as Doc[], pendingMuts)
        return (folded.find((d) => d.name === nm) as T | undefined) ?? null
      })

      return {
        doc,
        loading,
        edit: () => makeEdit<T>(doctype(name), doc.value ?? ({ name: resolve(nameArg) } as any)),
      }
    }

    function count(options: { filters?: Record<string, Resolvable<FilterValue>> } = {}): CountHandle {
      const value = ref<number | null>(null)
      const filtersRef = computed(() => resolveFilters(options.filters))
      const query = computed<Query>(() => ({
        kind: 'count' as const,
        doctype: name,
        filters: filtersRef.value,
      }))

      const sub = ref<null | { subId: string; dispose: () => void }>(null)
      watch(
        query,
        (q) => {
          sub.value?.dispose()
          sub.value = acquireSub(q)
        },
        { immediate: true },
      )
      if (getCurrentScope()) onScopeDispose(() => sub.value?.dispose())

      // Track the connection's stored count for this sub id. Re-sample on any store change
      // (proxy for "a pull just landed"). Falls back to client-side count over the local
      // snapshot if the server hasn't answered yet.
      watch(
        [storeRev, sub],
        () => {
          const subId = sub.value?.subId
          if (subId) {
            const c = connection.getCount(subId)
            if (c != null) {
              value.value = c
              return
            }
          }
          value.value = applyQuery(store.list(name), { filters: filtersRef.value }).length
        },
        { immediate: true },
      )

      return { value }
    }

    async function insert(values: Partial<T>): Promise<T> {
      const tn = tempName()
      const doc = { ...(values as any), name: tn }
      await store.put(name, doc, { fields: '*' })
      const m: Mutation = {
        id: uuid(),
        op: 'insert',
        doctype: name,
        name: tn,
        values: values as any,
      }
      const ackP = connection.push(m)
      bumpPending()
      const ack = await ackP
      bumpPending()
      if (ack.status === 'applied' && ack.doc) return ack.doc as T
      if (ack.status === 'conflict') throw new Error(ack.error?.message ?? 'conflict')
      throw new Error(ack.status === 'error' ? ack.error.message : 'unknown ack')
    }

    async function setValue(nm: string, values: Partial<T>, xOpts: { base?: string } = {}): Promise<void> {
      const existing = store.get(name, nm)
      if (existing) {
        await store.put(name, { ...existing, ...values, name: nm } as Doc, { fields: '*' })
      }
      const m: Mutation = {
        id: uuid(),
        op: 'set_value',
        doctype: name,
        name: nm,
        values: values as any,
        base: xOpts.base,
      }
      const ackP = connection.push(m)
      bumpPending()
      await ackP
      bumpPending()
    }

    async function del(nm: string): Promise<void> {
      await store.delete(name, nm)
      const m: Mutation = { id: uuid(), op: 'delete', doctype: name, name: nm }
      const ackP = connection.push(m)
      bumpPending()
      await ackP
      bumpPending()
    }

    function draft(seed?: Partial<T>): DraftHandle<T> {
      const tn = tempName()
      const doc = reactive({ ...(seed as any), name: tn }) as T
      return {
        doc,
        async insert() {
          const raw = { ...toRaw(doc) }
          delete (raw as any).name
          return insertImpl(raw)
        },
      }
    }

    async function insertImpl(values: any): Promise<T> {
      return insert(values)
    }

    return {
      list,
      get,
      count,
      insert,
      setValue,
      delete: del,
      draft,
    }
  }

  let callImpl: ((m: string, a?: any) => Promise<any>) | null = null
  const client: Client = {
    sync,
    doctype,
    async call(method: string, args?: any) {
      if (!callImpl) throw new Error('client.call not configured')
      return callImpl(method, args)
    },
    _internal: { store, queue, connection },
  }
  ;(client as any)._setCall = (fn: (m: string, a?: any) => Promise<any>) => (callImpl = fn)
  return client
}

// helpers ---------------------------------------------------------------------

function foldForDoctype(snap: Doc[], pendingMuts: Mutation[]): Doc[] {
  const map = new Map<string, Doc>()
  for (const d of snap) map.set(d.name, { ...d })
  for (const m of pendingMuts) {
    switch (m.op) {
      case 'insert':
        if (m.name) map.set(m.name, { ...(m.values || {}), name: m.name })
        break
      case 'set_value':
        if (m.name) {
          const cur = map.get(m.name)
          if (cur) map.set(m.name, { ...cur, ...(m.values || {}) })
        }
        break
      case 'delete':
        if (m.name) map.delete(m.name)
        break
      case 'rename':
        if (m.name && m.values?.new_name) {
          const src = map.get(m.name)
          if (src) {
            map.delete(m.name)
            map.set(m.values.new_name, { ...src, name: m.values.new_name })
          }
        }
        break
    }
  }
  return Array.from(map.values())
}

function makeEdit<T extends Doc>(dt: Doctype<T>, source: T): EditHandle<T> {
  const original = { ...(source as any) } as T
  const doc = reactive({ ...(source as any) }) as T
  const isDirty = computed(() => {
    for (const k of Object.keys(doc as any)) {
      if ((doc as any)[k] !== (original as any)[k]) return true
    }
    return false
  }) as unknown as Ref<boolean>
  return {
    doc,
    isDirty,
    async save() {
      const diff: any = {}
      for (const k of Object.keys(doc as any)) {
        if ((doc as any)[k] !== (original as any)[k]) diff[k] = (doc as any)[k]
      }
      if (Object.keys(diff).length === 0) return
      await dt.setValue((source as any).name, diff)
      // Update original
      Object.assign(original, doc)
    },
    reset() {
      for (const k of Object.keys(doc as any)) {
        ;(doc as any)[k] = (original as any)[k]
      }
    },
  }
}

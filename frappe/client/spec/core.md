# Core Store Spec (Framework-Agnostic)

Pure JS/TS layer with zero framework dependencies. Every framework adapter
(Vue, React, Svelte) consumes this via `subscribe()`.

---

## DocStore

Canonical in-memory document store. One entry per document, shared by all
consumers (getDoc, getList, socket updates).

```ts
interface DocStore {
  get(doctype: string, name: string): Doc | null
  set(doc: Doc): void               // merges into existing, notifies subscribers
  setMany(docs: Doc[]): void         // batch merge, notifies once per doc
  remove(doctype: string, name: string): void

  // Subscribe to a specific document. Returns unsubscribe function.
  // Listener fires synchronously on set/remove — framework layer handles batching.
  subscribe(
    doctype: string,
    name: string,
    listener: (doc: Doc | null) => void,
  ): () => void

  // Subscribe to any change for a doctype (used by lists to know when to check their items).
  // Fires with the name of the changed doc.
  subscribeDoctype(
    doctype: string,
    listener: (name: string, doc: Doc | null) => void,
  ): () => void

  // For cold-start hydration from IDB / SSR
  hydrate(docs: Doc[]): void

  // Snapshot for debugging / devtools
  getAll(doctype: string): Doc[]
}

type Doc = { doctype: string; name: string; [key: string]: any }
```

Internal implementation: `Map<"DocType/name", Doc>` +
`Map<"DocType/name", Set<Listener>>` + `Map<"DocType", Set<DoctypeListener>>`.

### Merge semantics

`set()` always merges: `Object.assign(existingDoc, incomingDoc)`. This means:

- **Full doc responses** (from getDoc) include all fields → merge effectively
  replaces the entire doc.
- **Partial doc responses** (from getList with specific fields) update only the
  provided fields, preserving any existing fields from a prior full fetch.

Transforms are never stored. They are pure functions applied at read time by
each consumer (getDoc, getList). Two consumers of the same doc can apply
completely different transforms.

---

## RequestManager

Handles HTTP concerns: deduplication, CSRF, abort, global hooks.

```ts
interface RequestManager {
  fetch(config: RequestConfig): Promise<Response>
}

interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, any>
  // If true, concurrent requests to the same URL+method are deduplicated.
  // Second caller gets the same Promise as the first.
  dedupe?: boolean
  signal?: AbortSignal
}

interface RequestManagerConfig {
  baseUrl: string
  // Called before every request. Return modified headers or add CSRF token.
  onRequest?: (config: RequestConfig) => RequestConfig | void
  // Called on every error. Use for session expiry, global toasts, etc.
  onError?: (error: FrappeResponseError) => void
  // Called on every successful response.
  onResponse?: (response: any) => void
}
```

Deduplication key: `${method}:${url}`. Only applies to GET requests by default.
POST/PATCH/DELETE are never deduplicated.

CSRF token: read from cookie `csrf_token` on every mutating request, send as
`X-Frappe-CSRF-Token` header. Also send `credentials: 'include'` for
cookie-based auth.

---

## CacheAdapter

Write-behind IDB persistence. Not on the hot path — only used for cold-start
hydration and background persistence.

```ts
interface CacheAdapter {
  // Called after DocStore.set() — writes to IDB in the background
  persist(doc: Doc): void
  persistMany(docs: Doc[]): void

  // Called once on startup — loads all cached docs into DocStore
  loadAll(): Promise<Doc[]>

  // Remove from persistent cache
  remove(doctype: string, name: string): void
  clear(): void
}
```

No `entries()` scans. No read-from-IDB on every mutation. On page load:
`CacheAdapter.loadAll() → DocStore.hydrate(docs)`. After that, IDB is
write-only until next page load.

---

## SocketManager

Connects Socket.IO to DocStore. Fires on `doc_update`, `doc_rename`.

```ts
interface SocketManager {
  connect(): void
  disconnect(): void
  on(event: string, handler: (...args: any[]) => void): () => void
}
```

On `doc_update`: extract `payload.docs` → `DocStore.setMany(docs)`. All
subscribers (getDoc, getList) update automatically through DocStore
notifications.

On `doc_rename`: `DocStore.remove(doctype, oldName)` +
`DocStore.set(newDoc)`.

---

## Operation Shape

Shared contract for all operations. Framework layers wrap this to add
reactive `loading`/`error`.

Single verb: **`.call()`** — for all operations.

```ts
interface Operation<TParams, TResult> {
  // Execute the operation. Updates DocStore on success.
  call(params: TParams): Promise<TResult>

  // Execute with optimistic update. Applies `updater` to DocStore immediately,
  // reverts on error.
  callOptimistic(
    params: TParams,
    updater: (store: DocStore) => void,     // apply optimistic change
    rollback?: (store: DocStore) => void,   // optional explicit rollback; if omitted, auto-reverts
  ): Promise<TResult>
}
```

### Error semantics

`.call()` **rejects the promise AND sets `.error`**.
Consumers can use either pattern:

```ts
// Pattern 1: try/catch (for imperative flows)
try {
  await todo.setValue.call({ status: 'Closed' })
} catch (e) { /* FrappeResponseError */ }

// Pattern 2: check .error (for template-driven UIs)
await todo.setValue.call({ status: 'Closed' }).catch(() => {})
if (todo.setValue.error) { /* show inline error */ }
```

`.error` is cleared at the start of each new `.call()`.

### Return values

| Operation              | Resolves to                  |
|------------------------|------------------------------|
| `setValue.call()`         | Updated `Doc`                |
| `delete.call()`           | `void`                       |
| `insert.call()`           | Created `Doc` (with `name`)  |
| `bulkDelete.call()`       | `void`                       |
| `bulkUpdate.call()`       | `Doc[]` (updated docs)       |
| `docMethod.call()`        | Server method return value   |
| `controllerMethod.call()` | Server method return value   |

---

## Core vs Framework Adapter Boundary

The core layer is **imperative**. It provides functions that fetch data, write
to DocStore, and return Promises. No reactivity, no auto-refetch, no watchers.

```ts
// Core: imperative, plain strings, returns dispose handle
interface CoreDocHandle<TDoc> {
  doc: TDoc | null                  // snapshot from DocStore (not reactive)
  promise: Promise<void>            // resolves when fetch completes
  reload(): Promise<void>           // refetch from server
  dispose(): void                   // unsubscribe from DocStore, cancel in-flight
  setValue: Operation<Partial<TDoc>, TDoc>
  delete: Operation<void, void>
  // + mapped docMethods as Operation
}

interface CoreListHandle<TDoc> {
  data: TDoc[]                      // snapshot (not reactive)
  promise: Promise<void>
  reload(): Promise<void>
  dispose(): void
  next(): void
  previous(): void
  hasNextPage: boolean
  hasPreviousPage: boolean
  setValue: Operation<Partial<TDoc> & { name: string }, TDoc>
  delete: Operation<string, void>
  insert: Operation<Partial<TDoc>, TDoc>
}
```

The **Vue adapter** wraps these with reactivity:

- `name: MaybeRefOrGetter<string>` → watches, calls `dispose()` + creates new
  core handle on change
- `enabled: () => boolean` → delays core handle creation until truthy
- `doc` / `data` → `shallowRef` updated via `DocStore.subscribe()`
- `loading` / `error` → `ref()` wrappers
- `tryOnScopeDispose()` → calls `dispose()` automatically

Reactive filter values, auto-refetch on name change, debounce — all Vue adapter
concerns. The core knows nothing about them.

---

## FrappeResponseError

```ts
class FrappeResponseError extends Error {
  title: string
  type: string
  messages: Array<{ type: string; message: string }>  // all errors, not just first
  exception?: string
  indicator?: string
  httpStatus: number

  get isNotFound(): boolean
  get isPermission(): boolean
  get isValidation(): boolean
  get isAuth(): boolean
}
```

---

## Progress Checklist

- [ ] DocStore: get/set/remove/subscribe/subscribeDoctype/hydrate
- [ ] RequestManager: fetch with dedup + CSRF + abort + global hooks
- [ ] CacheAdapter: IDB write-behind + loadAll
- [ ] SocketManager: doc_update + doc_rename → DocStore
- [ ] FrappeResponseError with structured error types
- [ ] Operation shape with call/callOptimistic
- [ ] CoreDocHandle with dispose
- [ ] CoreListHandle with dispose

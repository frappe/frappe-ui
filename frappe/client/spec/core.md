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
  setMany(docs: Doc[]): void        // batch merge, notifies once per doc
  remove(doctype: string, name: string): void

  // Subscribe to every set/remove across all doctypes.
  // Used by CacheAdapter to write-behind on every mutation.
  subscribeAll(listener: (doc: Doc | null) => void): () => void

  // Subscribe to a specific document. Returns unsubscribe function.
  // Listener fires synchronously on set/remove — framework layer handles batching.
  subscribe(
    doctype: string,
    name: string,
    listener: (doc: Doc | null) => void,
  ): () => void

  // Subscribe to any change for a doctype (used by lists to know when to check their items).
  // Fires with the name and doc of the changed entry.
  subscribeDoctype(
    doctype: string,
    listener: (name: string, doc: Doc | null) => void,
  ): () => void

  // Cold-start hydration from IDB / SSR — does not notify subscribers.
  hydrate(docs: Doc[]): void

  // Snapshot all docs for a doctype.
  getAll(doctype: string): Doc[]
}

type Doc = { doctype: string; name: string; [key: string]: any }
```

Internal implementation: `Map<"DocType/name", Doc>` +
`Map<"DocType/name", Set<Listener>>` + `Map<"DocType", Set<DoctypeListener>>` +
`Set<GlobalListener>`.

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
  /** Executes an HTTP request and returns the parsed JSON body. */
  fetch(config: RequestConfig): Promise<any>
  /** Fetches a single document. Resolves with the raw API JSON (`.data` holds the doc). */
  fetchDoc(doctype: string, name: string): Promise<any>
}

interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, any>
  // If true, concurrent requests to the same URL+method are deduplicated.
  // Defaults to true for GET, false for mutations.
  dedupe?: boolean
  signal?: AbortSignal
}

interface RequestManagerConfig {
  baseUrl?: string
  // Called before every request. Return a modified config to override it.
  onRequest?: (config: RequestConfig) => RequestConfig | void
  // Called on every error. Use for session expiry, global toasts, etc.
  onError?: (error: FrappeResponseError) => void
  // Called on every successful response.
  onResponse?: (response: any) => void
}
```

Deduplication key: `${method}:${fullUrlWithParams}`. Only GET requests are
deduplicated by default. POST/PATCH/DELETE are never deduplicated.

CSRF token: read from cookie `csrf_token` on every mutating request, sent as
`X-Frappe-CSRF-Token` header. Also sends `credentials: 'include'` for
cookie-based auth.

---

## CacheAdapter

Write-behind IDB persistence. Not on the hot path — only used for cold-start
hydration and background persistence.

```ts
interface CacheAdapter {
  persist(doc: Doc): void
  persistMany(docs: Doc[]): void
  loadAll(): Promise<Doc[]>
  remove(doctype: string, name: string): void
  clear(): void
}
```

Three implementations are provided: `createMemoryCacheAdapter()` (tests),
`createIDBCacheAdapter(dbName?)` (IndexedDB), and
`createDefaultCacheAdapter(dbName?)` (IDB when available, memory fallback).

Wire a cache to DocStore using `connectCache(store, cache)`:

- Registers a `subscribeAll` listener before awaiting `loadAll()` so no writes
  slip through during the initial IDB scan.
- `loadAll()` → `store.hydrate(docs)` on startup.
- After that, every `store.set()` triggers `cache.persist()` in the background.

---

## SocketManager

Manages Socket.IO events and exposes typed subscription helpers.

```ts
interface SocketManager {
  connect(): void
  disconnect(): void
  on(event: string, handler: (...args: any[]) => void): () => void
  off(event: string, handler?: (...args: any[]) => void): void
  /**
   * Subscribe to list_update events for a specific doctype.
   * Emits `doctype_subscribe` to the server on the first subscriber,
   * and `doctype_unsubscribe` when the last subscriber is removed.
   * Returns an unsubscribe function.
   */
  onDocUpdate(doctype: string, callback: (name: string) => void): () => void
  /**
   * Subscribe to doc_rename events for a specific doctype.
   * Returns an unsubscribe function.
   */
  onDocRename(
    doctype: string,
    callback: (newName: string, oldName: string) => void,
  ): () => void
}
```

**`list_update`** payload: `{ doctype, name, user }` — sent to the doctype
room when any doc in that doctype is saved. No full doc data is included; the
list handle fetches the changed doc individually (or refetches the whole page).

**`doc_rename`** payload: `{ doctype, old, new }` — sent to the doc room.
Triggers `DocStore.remove(doctype, oldName)` and emits the event to local
subscribers.

Two factory functions are provided:
- `createNoopSocketManager()` — all methods are no-ops; used when `realtime` is false.
- `createSocketManager(store, socketIo)` — full implementation.
- `createLazySocketManager(store, initFn)` — wraps `createSocketManager`; defers
  `initFn()` until the first subscriber calls `onDocUpdate`/`onDocRename`.

---

## Operation Shape

Shared contract for all operations. Framework layers wrap this to add
reactive `loading`/`error`.

Single verb: **`.call()`** — for all operations.

```ts
interface Operation<TParams, TResult> {
  // Execute the operation. Updates DocStore on success.
  // Rejects on error with FrappeResponseError.
  call(params: TParams): Promise<TResult>

  // Execute with optional optimistic update. If `updater` is provided it is
  // applied to DocStore immediately. On error, calls `rollback` or auto-reverts
  // via a pre-update snapshot.
  callOptimistic(
    params: TParams,
    updater?: (store: DocStore) => void,
    rollback?: (store: DocStore) => void,
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

## FrappeResponseError

```ts
class FrappeResponseError extends Error {
  title: string
  type: string
  messages: Array<{ type: string; message: string }>
  exception?: string
  indicator?: string
  httpStatus: number
  _suppressGlobalError: boolean  // set by local onError to prevent global handler

  get isNotFound(): boolean    // httpStatus === 404
  get isPermission(): boolean  // httpStatus === 403
  get isValidation(): boolean  // type === 'ValidationError'
  get isAuth(): boolean        // httpStatus === 401
}
```

---

## Progress Checklist

- [x] DocStore: get/set/remove/subscribe/subscribeDoctype/subscribeAll/hydrate
- [x] RequestManager: fetch + fetchDoc with dedup + CSRF + abort + global hooks
- [x] CacheAdapter: IDB write-behind + loadAll + connectCache
- [x] SocketManager: list_update + doc_rename with onDocUpdate/onDocRename helpers
- [x] FrappeResponseError with structured error types
- [x] Operation shape with call/callOptimistic
- [x] CoreDocHandle with dispose
- [x] CoreListHandle with dispose

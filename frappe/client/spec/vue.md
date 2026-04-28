# Vue Adapter Spec

Thin layer that converts core DocStore subscriptions into Vue reactivity.
Developers don't import this directly — it's wired in via `createClient`.

---

## How it's activated

```ts
// src/client.ts
import { createClient, createDefaultCacheAdapter } from 'frappe-ui/frappe/vue'

export const { defineDoctype, store, socket } = createClient({
  baseUrl: 'https://mysite.com',
  realtime: true,
  cache: createDefaultCacheAdapter('my-app-cache'),
  onError(error) {
    if (error.isAuth) router.push('/login')
  },
})
```

`createClient` options:

| Option | Type | Description |
|---|---|---|
| `baseUrl?` | `string` | Prepended to all API requests. Defaults to `''`. |
| `realtime?` | `boolean` | Enable live `list_update` / `doc_rename` events via Socket.IO. |
| `cache?` | `CacheAdapter` | Persistence adapter for cold-start hydration. |
| `onRequest?` | `fn` | Interceptor called before every request. |
| `onResponse?` | `fn` | Interceptor called after every successful response. |
| `onError?` | `(error: FrappeResponseError) => void` | Global error handler. |

All doctype objects created via this client's `defineDoctype` automatically
return Vue-reactive handles.

---

## What the adapter provides

### Reactive wrappers

All handles are wrapped in `reactive()` so nested `Ref`/`ComputedRef` properties
auto-unwrap. Consumers never need `.value` in templates or scripts.

| Core concept              | Vue wrapper                                         |
|---------------------------|-----------------------------------------------------|
| `DocStore.subscribe()`    | `shallowRef` updated in `watchEffect`, exposed as `computed` |
| `DocStore.subscribeDoctype()` | version counter `ref` that invalidates `computed` data |
| Operation `loading`       | `ref<boolean>()` — unwrapped to `boolean` via `reactive()` |
| Operation `error`         | `ref<FrappeResponseError | null>()` — unwrapped via `reactive()` |
| Operation `data`          | `ref<T | null>()` — unwrapped via `reactive()` |

### Reactive input support

| Input type            | Vue wrapper                              |
|-----------------------|------------------------------------------|
| `getDoc` name         | `MaybeRefOrGetter<string>` — `ref`, `computed`, getter, or plain string |
| `getList` filters     | Per-key `MaybeRefOrGetter<T>` OR a `MaybeRefOrGetter<Record>` for the whole object |
| `enabled` option      | `MaybeRefOrGetter<boolean>` — controls whether fetch is active |

### Lifecycle integration

- **`tryOnScopeDispose()`** — auto-cleanup subscriptions when the component
  unmounts or the effect scope is disposed. Works outside `setup()` (e.g., in
  composables called from `onMounted`).
- **`nextTick` batching** — DocStore subscription callbacks for `getDoc` are
  fired in `nextTick` to batch rapid store updates into a single Vue update.

---

## How getDoc works in Vue

```
ToDo.getDoc(name)
  ↓
  watchEffect: resolves name, subscribes to DocStore
  ↓
  DocStore.subscribe('ToDo', name) → nextTick(() => _doc.value = updated)
  ↓
  doc = computed(() => transform(_doc.value))
  ↓
  Component re-renders
```

When `name` is a `ref` or getter:
1. `watchEffect` tracks the reactive name
2. On change: unsubscribe old, subscribe new, fetch new doc
3. Old doc value cleared immediately; new fetch populates it

---

## How getList works in Vue

```
ToDo.getList({ filters: { status } })
  ↓
  watchEffect: resolves all filter values, triggers fetch
  ↓
  fetch → docs merged into DocStore, names array updated
  ↓
  data = computed(() => names.map(n => DocStore.get('ToDo', n)))
  ↓
  DocStore.subscribeDoctype() bumps version counter on any change
  ↓
  data computed re-runs, component re-renders
```

Filter reactivity:
1. Each filter value can be a `ref`, `computed`, getter, or static value
2. Whole-object filter mode: `filters: () => ({ owner: user.name, ...active.value })`
3. `watchEffect` tracks all reactive filter values
4. On change: debounce (if configured) → refetch with new filters
5. Realtime: when `socket` is present, `list_update` events refetch the
   changed doc individually (or refetch the whole page if the name is unknown)

---

## How Operations work in Vue

Core `Operation.call()` returns a plain `Promise`. The Vue adapter wraps it
via `wrapOperation()`:

```ts
// Core
interface Operation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(
    params: TParams,
    updater?: (store: DocStore) => void,
    rollback?: (store: DocStore) => void,
  ): Promise<TResult>
}

// Vue-wrapped (before reactive() unwrapping)
interface ReactiveOperation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(...): Promise<TResult>
  loading: Ref<boolean>
  error: Ref<FrappeResponseError | null>
  data: Ref<TResult | null>
}

// After reactive() — what the consumer actually sees (FlatOperation)
interface FlatOperation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(...): Promise<TResult>
  loading: boolean        // auto-unwrapped
  error: FrappeResponseError | null
  data: TResult | null
}
```

### InsertOperation (list only)

`insert` has a specialised shape to support optimistic placeholders:

```ts
interface InsertOperation<TDoc> {
  call(values: Partial<TDoc>, options?: { at?: 'start' | 'end' | number }): Promise<TDoc>
  callOptimistic(
    values: Partial<TDoc>,
    tempDoc?: Partial<TDoc>,   // shown immediately; replaced by real doc on success
    options?: { at?: InsertPosition },
  ): Promise<TDoc>
  loading: boolean
  error: FrappeResponseError | null
  data: TDoc | null
}
```

---

## Doctype instance shape

```ts
interface VueDoctypeInstance<TDoc, TControllerMethods> {
  getDoc(name: MaybeRefOrGetter<string>, options?: GetDocOptions): VueDocHandle<TDoc>
  getList(options?: GetListOptions): VueListHandle<TDoc>
  newDoc(defaults?: Partial<TDoc>): VueNewDocHandle<TDoc>
  getCount(options?: GetCountOptions): VueCountHandle
  bulkDelete: FlatOperation<string[], void>
  bulkUpdate: FlatOperation<Array<{ name: string } & Partial<TDoc>>, TDoc[]>
  onUpdate(callback: (name: string) => void): () => void
  onRename(callback: (newName: string, oldName: string) => void): () => void
  // + mapped controllerMethods as FlatOperation
}
```

---

## Cleanup

```ts
// Inside setup() — automatic
const todo = ToDo.getDoc('todo-1')
// → cleanup on component unmount (tryOnScopeDispose)

// Inside a composable
function useTodo(name: MaybeRefOrGetter<string>) {
  const todo = ToDo.getDoc(name)
  // → cleanup when calling scope disposes
  return todo
}

// Manual cleanup (rare)
const todo = ToDo.getDoc('todo-1')
todo.dispose()
```

---

## Progress Checklist

- [x] Vue adapter: reactive wrappers for doc/list/count/newDoc/operation
- [x] `shallowRef` subscriptions with `watchEffect` for getDoc
- [x] `MaybeRefOrGetter` support for name, filters (per-key and whole-object), enabled
- [x] `tryOnScopeDispose` for auto-cleanup in getDoc and getList
- [x] `nextTick` batching for rapid store updates (getDoc)
- [x] `ReactiveOperation` wrapper with loading/error/data refs (via `wrapOperation`)
- [x] `InsertOperation` with tempDoc optimistic placeholder and position control
- [x] `cache` option wired to `connectCache` on startup
- [x] Realtime list_update auto-refetch in getList via `socket.onDocUpdate`

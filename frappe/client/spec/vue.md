# Vue Adapter Spec

Thin layer (~100 lines) that converts core DocStore subscriptions into Vue
reactivity. Developers don't import this directly — it's wired in automatically.

---

## How it's activated

```ts
// src/client.ts
import { createClient } from 'frappe-ui/frappe/vue'
//                                         ^^^^ Vue entrypoint

export const { defineDoctype, store, socket } = createClient({
  baseUrl: 'https://mysite.com',
  realtime: true,
})
```

Importing `createClient` from `frappe-ui/frappe/vue` (instead of
`frappe-ui/frappe`) activates the Vue adapter. All doctype objects created via
this client's `defineDoctype` automatically return Vue-reactive handles.

The developer API stays the same:

```ts
import { ToDo } from '@/doctypes'

const todo = ToDo.getDoc('todo-1')   // returns Vue-reactive handle
const todos = ToDo.getList({ ... })  // returns Vue-reactive handle
```

---

## What the adapter provides

### Reactive wrappers

| Core concept              | Vue wrapper                                         |
|---------------------------|-----------------------------------------------------|
| `DocStore.subscribe()`    | `shallowRef` updated in `watchEffect`, exposed as `computed` |
| `DocStore.subscribeDoctype()` | local list state backed by store refs           |
| Operation `loading`       | `ref<boolean>()`                                    |
| Operation `error`         | `ref<FrappeResponseError | null>()`                 |
| Operation `data`          | `ref<T | null>()`                                   |

### Reactive input support

| Input type            | Vue wrapper                              |
|-----------------------|------------------------------------------|
| `getDoc` name         | `MaybeRefOrGetter<string>` — `ref`, `computed`, getter, or plain string |
| `getList` filter values | Per-key `MaybeRefOrGetter<T>` — each filter value independently reactive |
| `enabled` option      | `MaybeRefOrGetter<boolean>` — controls whether fetch is active |

### Lifecycle integration

- **`tryOnScopeDispose()`** — auto-cleanup subscriptions when the component
  unmounts or the effect scope is disposed. Works outside `setup()` (e.g., in
  composables called from `onMounted`).
- **`nextTick` batching** — multiple rapid DocStore notifications within the
  same tick are batched into a single Vue reactive update.

---

## How getDoc works in Vue

```
ToDo.getDoc(name)
  ↓
  Core: DocStore.subscribe('ToDo', name) → callback(doc)
  ↓
  Vue adapter: callback updates shallowRef
  ↓
  Exposed as: computed(() => transform(shallowRef.value))
  ↓
  Component re-renders
```

When `name` is a `ref` or getter:
1. `watchEffect` tracks the reactive name
2. On change: unsubscribe old, subscribe new, fetch new doc
3. Old subscription cleaned up, new shallowRef replaces old value

---

## How getList works in Vue

```
ToDo.getList({ filters: { status } })
  ↓
  Core: fetch → response.names stored locally, docs merged into DocStore
  ↓
  Vue adapter: names array in shallowRef, data = computed(() =>
    names.map(n => transform(DocStore.get('ToDo', n)))
  )
  ↓
  Component re-renders
```

Filter reactivity:
1. Each filter value can be a `ref`, `computed`, getter, or static value
2. `watchEffect` tracks all reactive filter values
3. On change: debounce (if configured) → refetch with new filters
4. Response updates local names array + merges docs into DocStore

---

## How Operations work in Vue

Core `Operation.call()` returns a plain `Promise`. The Vue adapter wraps it:

```ts
// Core
interface Operation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(...): Promise<TResult>
}

// Vue adapter wraps each operation to add reactive state
interface ReactiveOperation<TParams, TResult> {
  call(params: TParams): Promise<TResult>
  callOptimistic(...): Promise<TResult>
  loading: Ref<boolean>       // true while call() is in flight
  error: Ref<FrappeResponseError | null>   // set on rejection, cleared on next call()
  data: Ref<TResult | null>   // set on success
}
```

---

## Cleanup

```ts
// Inside setup() — automatic
const todo = ToDo.getDoc('todo-1')
// → cleanup on component unmount

// Inside a composable
function useTodo(name: MaybeRefOrGetter<string>) {
  const todo = ToDo.getDoc(name)
  // → cleanup when calling scope disposes (tryOnScopeDispose)
  return todo
}

// Manual cleanup (rare)
const todo = ToDo.getDoc('todo-1')
todo.dispose()
```

---

## Progress Checklist

- [ ] Vue adapter: reactive wrappers for doc/list/operation
- [ ] `shallowRef` subscriptions with `watchEffect`
- [ ] `MaybeRefOrGetter` support for name, filters, enabled
- [ ] `tryOnScopeDispose` for auto-cleanup
- [ ] `nextTick` batching for rapid store updates
- [ ] `ReactiveOperation` wrapper with loading/error/data refs

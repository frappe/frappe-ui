# Data fetching

Five composables, all exported from `frappe-ui`. They are siblings on one Frappe fetch layer, not wrappers around each other, so **each one has its own option list**. An option that exists on `useCall` is not automatically accepted by `useDoc`.

| Job | Composable |
|---|---|
| Any whitelisted method or REST path | `useCall` |
| A paginated, filterable list of a doctype | `useList` |
| One document, kept reactive | `useDoc` |
| Writes for a doctype, with no read | `useDoctype` |
| A draft of a document that does not exist yet | `useNewDoc` |

`useCall` is the recommended layer for new code. The older `createResource` / `createListResource` / `createDocumentResource` family stays supported and un-deprecated through `1.x`, so existing code keeps working.

No Frappe backend behind the app? See [SETUP.md](SETUP.md) → Prototyping against a non-Frappe backend.

## `useCall`

**Options** (`src/data-fetching/useCall/types.ts:6-22`): `url` (string or `Ref<string>`), `method` (`GET | POST | PUT | DELETE`, default `GET`), `params` (object, or a function re-read on every request), `cacheKey`, `staleOnError` (default `false`), `immediate` (default `true`), `refetch` (default `false`), `baseUrl`, `initialData`, `beforeSubmit`, `transform`, `onSuccess`, `onError`.

**Returns a `reactive` object — read members directly, no `.value`:** `data` (`null` until the first successful response), `error`, `loading` / `isFetching`, `isFinished`, `params`, `url`, `promise` (resolves when the request settles; never rejects), `canAbort`, `aborted`, `execute()` / `fetch()` / `reload()`, `submit(params?)`, `reset()`, `abort()`.

**Read shape — auto-fetch on mount.** `immediate` defaults to `true`, so the request fires during setup. Set `refetch: true` when the `url` or `params` are reactive and the call should follow them.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCall, Skeleton, ErrorMessage } from 'frappe-ui'

const userId = ref('Administrator')
const user = useCall<User>({
  url: computed(() => `/api/v2/document/User/${userId.value}`),
  refetch: true,
})
</script>

<template>
  <Skeleton v-if="user.loading && !user.data" class="h-4 w-40" />
  <ErrorMessage v-else-if="user.error" :message="user.error" />
  <UserCard v-else :user="user.data" />
</template>
```

**Write shape — `immediate: false` plus `await submit(params)`.** This is the write pattern for the whole file: nothing fires until you call `submit`, and the params for that one request are passed in. Always `await` it inside the handler and put the follow-up work at the await site; `onSuccess` is for side effects the caller does not sequence. The await only sequences under the `refetch: false` default — set `refetch: true` and `submit` returns before the request goes out.

```ts
const createTask = useCall<Task, { title: string; description?: string }>({
  url: '/api/v2/method/myapp.api.create_task',
  method: 'POST',
  immediate: false,
  onSuccess: (task) => {
    toast.success('Task created')
    router.push(`/tasks/${task.name}`)
  },
  onError: (err) => toast.error(err.message),
})

await createTask.submit({ title: form.title, description: form.description })
```

Bind `loading` to the submit button (`<Button :loading="createTask.loading">`) and render `error` through `<ErrorMessage :message="createTask.error" />` next to the form.

**`cacheKey` is read once at setup.** It persists the response in memory and IndexedDB, and a later call with the same key shows the cached value while it refetches. It is not reactive: a `Ref` inside the key is stringified, not unwrapped. For a call whose `url` varies by id, either leave `cacheKey` out or key the component itself per id, so the cache cannot serve the previous id's body.

## `useList`

```ts
const todos = useList<Todo>({ doctype: 'ToDo', fields: ['name', 'status'], filters: { status: 'Open' }, orderBy: 'modified desc' })
```

**Options** (`src/data-fetching/useList/types.ts:26-46`): `doctype` (required), `fields`, `filters` and `orderBy` (both `MaybeRefOrGetter` — pass a ref or getter and the list refetches when it changes), `start` (default `0`), `limit` (default `20`), `groupBy`, `parent`, `debug`, `cacheKey`, `staleOnError`, `initialData`, `immediate` (default `true`), `refetch` (**default `true`**, unlike `useCall`), `baseUrl`, `url`, `transform`, `onSuccess`, `onError`.

**Returns:** `data` (the current page's rows, `null` until the first response unless `initialData` seeds it, so guard it before binding to `ListRows :items`), `error`, `loading` / `isFetching`, `isFinished`, `hasNextPage` / `hasPreviousPage`, `start` and `limit` (both **readonly** — page with `next()` / `previous()`, do not assign), `url`, `canAbort`, `aborted`, `execute()` / `fetch()` / `reload()`, `abort()`, `next()` / `previous()`, `updateRow(doc)` / `removeRow(name)`, plus three write helpers: `insert.submit(values)`, `setValue.submit({ name, ...values })`, `delete.submit({ name })`. Each helper carries its own `data`, `error`, `loading` and `isLoading(...)`.

## `useDoc`

```ts
const todoId = 'TODO-0001'
const todo = useDoc<Todo>({ doctype: 'ToDo', name: todoId })
await todo.setValue.submit({ status: 'Closed' })
```

**Options — this is the whole list** (`src/data-fetching/useDoc/useDoc.ts:36-44`): `doctype`, `name` (string, `Ref<string>` or getter), `baseUrl`, `url`, `methods`, `immediate` (default `true`), `staleOnError` (default `false`), `transform`.

There is no `cacheKey`, `refetch`, `params`, `initialData`, `onSuccess` or `onError` option on `useDoc`. Documents are shared through a reactive store instead: every `useDoc` and matching `useList` row for the same `doctype`/`name` reads the same object, and a write from any of them updates all of them.

**Returns:** `doc` — **not `data`** — plus `error`, `loading` / `isFetching`, `isFinished`, `canAbort`, `aborted`, `execute()` / `fetch()` / `reload()`, `abort()`, `setValue.submit(values)`, `delete.submit()`, `onSuccess(callback)` (registers a callback, returns an unsubscribe function), and one `useCall`-shaped member per entry in `methods`.

`methods` maps a member name to a server method name, or to `useCall` options plus a required `name`. Each member defaults to `method: 'POST'` and `immediate: false`, so you call it with `submit()`.

## `useDoctype`

`useDoctype(doctype, { baseUrl? })` groups the write operations for a doctype. It fetches nothing and holds no document.

**Returns:** `insert`, `delete`, `setValue`, `runDocMethod`, `runMethod`. Each has `data`, `error`, `loading`, `isLoading(...)` and `submit(params)`.

```ts
const todos = useDoctype<Todo>('ToDo')
await todos.setValue.submit({ name: id, status: 'Closed' })
await todos.runDocMethod.submit({ name: id, method: 'send_reminder' })
```

## `useNewDoc`

`useNewDoc(doctype, initialValues?, options?)` holds a reactive draft of a document that does not exist yet. `options` are the `useCall` options minus `url`, `method`, `params` and `immediate` — all four are fixed.

**Returns:** everything `useCall` returns for the insert request, plus `doc` (the reactive draft; bind form fields straight to it) and `submit()`, which inserts `doc` and resolves with the created document, including its server-assigned `name`.

```vue
<script setup>
import { useRouter } from 'vue-router'
import { useNewDoc, FormControl, Button } from 'frappe-ui'
const router = useRouter()
const todo = useNewDoc('ToDo', { status: 'Open' })
const save = async () => router.push(`/todos/${(await todo.submit()).name}`)
</script>

<template>
  <FormControl v-model="todo.doc.description" label="Description" required />
  <Button variant="solid" :loading="todo.loading" @click="save">Create</Button>
</template>
```

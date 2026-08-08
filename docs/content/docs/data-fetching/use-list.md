# useList

`useList` fetches a list of documents for a DocType and keeps it reactive —
pagination, filters and write helpers included. Rows it fetches are shared with
[`useDoc`](./use-doc.md): updating a document through either updates the other.

## Basic example

```vue
<template>
  <div v-for="todo in todos.data" :key="todo.name">
    {{ todo.description }} — {{ todo.status }}
  </div>
  <Button @click="todos.next()" :disabled="!todos.hasNextPage"> Next </Button>
</template>

<script setup>
import { useList } from 'frappe-ui'

const todos = useList({
  doctype: 'ToDo',
  fields: ['name', 'description', 'status'],
  orderBy: 'creation desc',
  limit: 20,
})
</script>
```

## Filters

`filters` accepts a value per field, or a `[operator, value]` tuple for anything
other than equality. Values can be `Ref`s or getters, so changing a filter
refetches automatically:

```vue
<script setup>
import { ref } from 'vue'
import { useList } from 'frappe-ui'

const status = ref('Open')
const todos = useList({
  doctype: 'ToDo',
  filters: {
    status,
    priority: ['in', ['High', 'Urgent']],
    description: ['like', '%deploy%'],
  },
})
</script>
```

## Write methods

`insert`, `setValue` and `delete` write to the DocType `useList` was created
for. Unlike `useCall`, each is a leaner shape — see
[Return value](#return-value) — because every submit runs independently: two
rows can be saved or deleted at the same time without one aborting the other.

```vue
<script setup>
import { useList } from 'frappe-ui'

const todos = useList({ doctype: 'ToDo' })

async function close(name) {
  await todos.setValue.submit({ name, status: 'Closed' })
}
</script>

<template>
  <div v-for="todo in todos.data" :key="todo.name">
    {{ todo.description }}
    <Button
      :loading="todos.setValue.isLoading(todo.name)"
      @click="close(todo.name)"
    >
      Close
    </Button>
  </div>
</template>
```

## Options

- `doctype` — the DocType to list.
- `fields` — the fields to fetch per row. Accepts plain field names,
  `"field as alias"`, `"link_field.fieldname"` for a linked doc's field, or a
  child table map (`{ items: ['item_code', 'qty'] }`).
- `filters` — a map of field name to a value (equality) or a `[operator, value]`
  tuple. Accepts `Ref`s/getters for reactive values.
- `orderBy` — `"<field> asc"` or `"<field> desc"`. Accepts a `Ref`/getter.
- `start` — the offset of the first row. Defaults to `0`.
- `limit` — the page size. Defaults to `20`.
- `groupBy` — a field to group results by.
- `parent` — for a child table DocType, the parent DocType to scope rows to.
- `debug` — when `true`, asks the server to include debug info in the response,
  logged to the console.
- `cacheKey` — a string, or array of primitives, that persists the current page
  in memory and IndexedDB under that key, shown immediately on the next
  `useList` with the same key while it refetches in the background.
- `staleOnError` — when `true` and `cacheKey` is set, a failed refetch keeps
  showing the last cached `data` instead of clearing it. Does not apply when
  the failure is a Frappe error response (`FrappeResponseError`) — that still
  clears the cache. Defaults to `false`.
- `initialData` — the value `data` holds before the first response.
- `immediate` — fire the first request automatically. Defaults to `true`.
- `refetch` — automatically refetch when a reactive filter/sort dependency
  changes. Defaults to `true`.
- `baseUrl` — prefix prepended to the generated request URLs.
- `url` — overrides the default `/api/v2/document/<doctype>` list URL.
- `transform` — receives the fetched rows and returns the array `data` should
  hold.
- `onSuccess` — called with the full row array after a successful fetch.
- `onError` — called with the error after a failed fetch.

## Return value

- `data` — the current page's rows.
- `error` — the error from the last fetch, or `null`.
- `loading` (alias `isFetching`) — `true` while a fetch is in flight.
- `isFinished` — `true` once the current fetch has settled, either way.
- `hasNextPage` / `hasPreviousPage` — whether `next()`/`previous()` has anywhere
  to go.
- `start` / `limit` — the current page's offset and size.
- `url` — the fully resolved request URL.
- `canAbort` — `true` while a fetch that can still be aborted is in flight.
- `aborted` — `true` if the last fetch was aborted.
- `execute()` (aliases `fetch()`, `reload()`) — refetches the current page.
- `abort()` — aborts the in-flight fetch.
- `next()` / `previous()` — moves `start` by one page and, when `refetch` is
  `false`, fetches it.
- `updateRow(doc)` / `removeRow(name)` — update or remove a row in `data` by
  `name`, without a request. Used internally to keep rows in sync with `useDoc`;
  call directly to patch `data` optimistically.
- `insert`, `setValue`, `delete` — write helpers, each with `data`, `error`,
  `loading` (true while any submit for that method is in flight),
  `submit(params)` and `isLoading(...)`:
  - `insert.submit(values)` creates a row. `insert.isLoading()` takes no
    argument — a new row has no name yet to key on.
  - `setValue.submit({ name, ...values })` updates a row by name.
    `setValue.isLoading(name)` reports on one row.
  - `delete.submit({ name })` deletes a row by name. `delete.isLoading(name)`
    reports on one row.

  All three refetch the current page on success when `refetch` is `true` (the
  default).

## Shared cache

A row fetched by `useList` and a document fetched by `useDoc` for the same
`doctype`/`name` are kept in sync: saving or deleting through one updates the
other everywhere it's rendered.

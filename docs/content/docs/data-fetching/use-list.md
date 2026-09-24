# useList

`useList` fetches a page of documents of a DocType, with filters, sorting,
paging and write members. Its rows stay in sync with [`useDoc`](./use-doc.md).

## Basic example

```vue
<template>
  <div v-for="todo in todos.data" :key="todo.name">
    {{ todo.description }} ({{ todo.status }})
  </div>
  <Button v-if="todos.hasNextPage" @click="todos.next()">Load more</Button>
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

`next()` fetches the next page and adds its rows to the end of `data`.

## Filter the list

Give each field a value to match, or an `[operator, value]` pair. When a ref
or getter in `filters` changes, the list fetches again:

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
    description: ['like', 'deploy'],
  },
})
</script>
```

A `like` value without `%` is wrapped in `%` on both sides, and an empty `like`
value is left out.

## Update a row

`setValue.isLoading(name)` shows a loading state on one row while it saves:

```vue
<script setup>
import { useList } from 'frappe-ui'

const todos = useList({ doctype: 'ToDo', fields: ['name', 'description'] })

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

Each submit sends its own request, so two rows can save or delete at the same
time.

## Options

| Name           | Type                                       | Default                       | Description                                                                                                  |
| -------------- | ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `doctype`      | `string`                                   | required                      | The DocType to list.                                                                                         |
| `fields`       | `Array`                                    | server default                | Fields per row: `'name'`, `'*'`, `'field as alias'`, `'link_field.fieldname'`, or a child table such as `{ items: ['item_code', 'qty'] }`. |
| `filters`      | `MaybeRefOrGetter<Filters>`                |                               | Field names mapped to a value to match or an `[operator, value]` pair. Values can be refs or getters.       |
| `orderBy`      | `MaybeRefOrGetter<OrderBy>`                |                               | `'<field> asc'` or `'<field> desc'`.                                                                         |
| `start`        | `number`                                   | `0`                           | The offset of the first row.                                                                                 |
| `limit`        | `number`                                   | `20`                          | The page size.                                                                                               |
| `groupBy`      | `string`                                   |                               | A field to group rows by.                                                                                    |
| `parent`       | `string`                                   |                               | For a child table DocType, the parent DocType.                                                               |
| `debug`        | `boolean`                                  | `false`                       | Asks the server for debug output and logs it to the console.                                                 |
| `immediate`    | `boolean`                                  | `true`                        | Fetches the first page when `useList` runs.                                                                  |
| `refetch`      | `boolean`                                  | `true`                        | Fetches again when `filters` or `orderBy` change, and after each successful write.                          |
| `initialData`  | `T[]`                                      |                               | The value of `data` before the first response.                                                               |
| `cacheKey`     | `CacheKey`                                 |                               | A string or an array. Saves the rows in IndexedDB and shows them at once on the next `useList` with this key. Each user has their own saved rows: see [One cache per user](./use-call.md#cache-namespace). |
| `staleOnError` | `boolean`                                  | `false`                       | With `cacheKey`, a failed fetch keeps showing the cached rows. A Frappe error response still clears them.    |
| `transform`    | `(rows: T[]) => T[]`                       |                               | Changes the rows before they go into `data`. It gets every row loaded so far, from all pages, and runs again after each new page or row change. It gets a copy, so it may change the rows in place. |
| `onSuccess`    | `(rows: T[]) => void`                      |                               | Called with all loaded rows after each successful fetch.                                                     |
| `onError`      | `(error: Error) => void`                   |                               | Called with the error after each failed fetch.                                                               |
| `url`          | `string`                                   | `/api/v2/document/<doctype>`  | Replaces the URL of the fetch. The list params are still added.                                              |
| `baseUrl`      | `string`                                   | `''`                          | A prefix for every request URL.                                                                              |

## Return value

| Name                            | Type                      | Description                                                                                         |
| ------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| `data`                          | `T[] \| null`             | The rows loaded so far, or `null` before the first response.                                        |
| `error`                         | `Error \| null`           | The error from the last fetch.                                                                      |
| `loading`                       | `boolean`                 | `true` while a fetch is in flight. Also available as `isFetching`.                                  |
| `isFinished`                    | `boolean`                 | `true` once the current fetch has settled, with or without an error.                                |
| `hasNextPage`                   | `boolean`                 | `true` if the server has more rows after the last page.                                             |
| `hasPreviousPage`               | `boolean`                 | `true` if `start` is above `0`.                                                                     |
| `start`                         | `number`                  | The offset of the current page.                                                                    |
| `limit`                         | `number`                  | The page size.                                                                                      |
| `url`                           | `string`                  | The full request URL.                                                                               |
| `canAbort`                      | `boolean`                 | `true` while a fetch that can be aborted is in flight.                                              |
| `aborted`                       | `boolean`                 | `true` if the last fetch was aborted.                                                               |
| `reload()`                      | `() => Promise`           | Fetches again from `start`. Resolves even if it fails, so check `error`. Also available as `execute()` and `fetch()`. |
| `abort()`                       | `() => void`              | Aborts the fetch in flight.                                                                         |
| `next()`                        | `() => void`              | Moves `start` forward one page and fetches it.                                                      |
| `previous()`                    | `() => void`              | Moves `start` back one page and fetches it.                                                         |
| `updateRow(doc)`                | `(doc) => void`           | Changes the row with the same `name` in `data`, without a request. Only fields the row has change. Pass values as the server sends them: `transform` runs again on the row. |
| `removeRow(name)`               | `(name: string) => void`  | Removes the row with this `name` from `data`, without a request.                                    |
| `insert`                        | write member              | `insert.submit(values)` creates a document. `insert.isLoading()` takes no argument.                 |
| `setValue`                      | write member              | `setValue.submit({ name, ...values })` saves fields of one document. `setValue.isLoading(name)` checks one row. |
| `delete`                        | write member              | `delete.submit({ name })` deletes one document. `delete.isLoading(name)` checks one row.              |

A write member has `data`, `error`, `loading`, `submit(params)` and
`isLoading(...)`. `loading` is `true` while any submit of that member is in
flight. `data` and `error` belong to the submit that started last. With
`refetch: true`, a successful write fetches the list again.

## Errors

`insert`, `setValue` and `delete` reject when they fail, so catch the error.
`reload()` resolves and sets `error`. See [Errors](./use-call.md#errors) for the
rule and the error classes.

```js
try {
  await todos.delete.submit({ name })
} catch (error) {
  toast.error(error.message)
}
```

## Shared cache

Rows of a `useList` and documents of a [`useDoc`](./use-doc.md) with the same
`doctype` and `name` stay in sync. A save or delete through one updates the
other, and every other `useList` of that DocType.

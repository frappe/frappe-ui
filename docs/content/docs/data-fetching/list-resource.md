# List Resource

`createListResource` fetches a page of records of a DocType from a Frappe
backend and gives you methods to page through, insert, update and delete them.
It is the older data-fetching API and stays supported through `1.x`.

For new code, use [`useList`](./use-list).

## Composition API

You set `doctype`, `fields`, `filters` and the other list options instead of a
URL.

```vue
<template>
  <div v-for="todo in todos.data" :key="todo.name" class="flex justify-between">
    {{ todo.description }}
    <Badge :label="todo.status" />
  </div>
  <Button v-if="todos.hasNextPage" @click="todos.next()">Load more</Button>
</template>

<script setup>
import { createListResource } from 'frappe-ui'

const todos = createListResource({
  doctype: 'ToDo',
  fields: ['name', 'description', 'status'],
  orderBy: 'creation desc',
  pageLength: 5,
  auto: true,
})
</script>
```

The resource sends dotted method names like `frappe.client.get_list`, so the
app must use [`frappeRequest`](./resource#frappe-backend) as its fetcher.

## Options API

With `app.use(FrappeUI, { resources: true })` in `main.js` (see
[Resource](./resource#options-api)), declare the resource with `type: 'list'`.
It is available on `this.$resources.todos`.

```vue
<script>
export default {
  resources: {
    todos() {
      return {
        type: 'list',
        doctype: 'ToDo',
        fields: ['name', 'description', 'status'],
        orderBy: 'creation desc',
        pageLength: 5,
        auto: true,
      }
    },
  },
}
</script>
```

## API Reference

### Options

| Option | Default | Description |
| --- | --- | --- |
| `doctype` | | The DocType to fetch. Required. |
| `fields` | | Fields to fetch, like `['name', 'status']`. |
| `filters` | | Filters as an object, like `{ status: 'Open' }`. |
| `orFilters` | | Filters where any one must match. |
| `orderBy` | | Sort order, like `'creation desc'`. |
| `groupBy` | | Field to group the results by. |
| `start` | `0` | Index of the first record to fetch. |
| `pageLength` | `20` | Number of records in one page. |
| `parent` | | Parent DocType, when you fetch records of a child DocType. |
| `debug` | `0` | Set to `1` to print the list query on the server. |
| `url` | `frappe.client.get_list` | A custom API method that returns the list. |
| `cache` | | String or array key. Keeps the list in memory and in IndexedDB. |
| `auto` | `false` | Fetch once when the resource is created. |
| `realtime` | `false` | Fetch a row again when the server reports that its document changed. Needs a socket on `this.$socket`, so it works only in the Options API. |
| `onSuccess(data)` | | Runs after the list loads. |
| `onError(error)` | | Runs when the list request fails. |
| `onData(data)` | | Runs when cached data loads from IndexedDB. |
| `transform(data)` | | Changes the rows before they are set on `data`. |
| `fetchOne`, `insert`, `delete`, `setValue`, `runDocMethod` | | Objects with `onSuccess` and `onError` for the resource of the same name. |

### Properties

| Property | Description |
| --- | --- |
| `data` | The rows, after `transform`. |
| `originalData` | The rows before `transform`. |
| `hasNextPage` | `true` when the last page was full, so there may be more rows. |
| `hasPreviousPage` | `true` when `start` is greater than `0`. |
| `list` | The [resource](./resource#properties) that fetches the list. Read `list.loading`, `list.error` and `list.promise` here. |

### Methods

| Method | Description |
| --- | --- |
| `fetch()` | Fetch the list. |
| `reload()` | Fetch all loaded pages again. Returns a promise. |
| `next()` | Fetch the next page and add it to `data`. |
| `previous()` | Move `start` back by one page and fetch. |
| `update(options)` | Change list options, like `{ filters: { status: 'Closed' } }`. Call `reload()` after it. |
| `setData(data)` | Replace the rows. Pass a function to compute them from the current rows. |
| `getRow(name)` | Return the loaded row with this `name`. |

### Write resources

Each of these is a [resource](./resource#methods) with its own `loading` and
`error`. Call `submit()` to run it. On success, the list updates.

| Resource | `submit()` argument | Description |
| --- | --- | --- |
| `fetchOne` | `name` | Fetch one record and update its row in the list. |
| `insert` | `{ description: 'New todo' }` | Insert a record with these values, then reload the list. |
| `setValue` | `{ name, status: 'Closed' }` | Set field values on the record `name` and update its row. |
| `delete` | `name` | Delete the record, then reload the list. |
| `runDocMethod` | `{ method: 'send_email', name, ...args }` | Run a method on the record's controller. Other keys are passed as arguments. |

# useDoc

`useDoc` fetches one Frappe document and keeps it up to date. Every `useDoc`
for the same document shares one copy, so a change made through one shows in
all of them.

## Basic example

```vue
<template>
  <div v-if="todo.doc">
    {{ todo.doc.description }}
  </div>
  <Button @click="todo.setValue.submit({ status: 'Closed' })">Close</Button>
</template>

<script setup>
import { useDoc } from 'frappe-ui'

const todo = useDoc({
  doctype: 'ToDo',
  name: 'TODO-0001',
})
</script>
```

## Follow the route

Pass `name` as a getter or a ref. When it changes, `useDoc` fetches the new
document:

```vue
<script setup>
import { useRoute } from 'vue-router'
import { useDoc } from 'frappe-ui'

const route = useRoute()
const todo = useDoc({
  doctype: 'ToDo',
  name: () => route.params.name,
})
</script>
```

## Run document methods

`methods` turns whitelisted methods of the document into members you call with
`submit()`:

```vue
<script setup>
import { useDoc } from 'frappe-ui'

const todo = useDoc({
  doctype: 'ToDo',
  name: 'TODO-0001',
  methods: {
    // short form: the server method name
    markDone: 'mark_done',
    // full form: useCall options plus the method name
    reassign: {
      name: 'reassign',
      onSuccess: () => console.log('reassigned'),
    },
  },
})

todo.markDone.submit()
todo.reassign.submit({ allocated_to: 'jane@example.com' })
</script>
```

The full form takes the [`useCall`](./use-call.md) options except `url`,
`baseUrl`, `immediate` and `refetch`. `method` defaults to `'POST'`. A method
runs only when you call `submit()`.

A key that matches a built-in member, such as `doc`, `reload` or `setValue`,
throws an error. Pick another key and keep the server name in `name`:
`{ runSetValue: { name: 'set_value' } }`.

## Options

| Name           | Type                               | Default                             | Description                                                                              |
| -------------- | ---------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `doctype`      | `string`                           | required                            | The DocType of the document.                                                             |
| `name`         | `MaybeRefOrGetter<string>`         | required                            | The document name. A ref or getter makes `useDoc` follow it.                             |
| `methods`      | `Record<string, string \| object>` | `{}`                                | Document methods to add as members. See [Run document methods](#run-document-methods).   |
| `immediate`    | `boolean`                          | `true`                              | Fetches the document as soon as `name` has a value.                                      |
| `staleOnError` | `boolean`                          | `false`                             | Keeps the saved copy of a document older than five minutes, so it can still show if a fetch fails. |
| `transform`    | `(doc) => doc`                     |                                     | Changes the document before `doc` returns it.                                            |
| `url`          | `string`                           | `/api/v2/document/<doctype>/<name>` | Replaces the URL of the fetch. `setValue` and `delete` still use the default URL.        |
| `baseUrl`      | `string`                           | `''`                                | A prefix for every request URL.                                                          |

## Return value

| Name                  | Type                                  | Description                                                                                       |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `doc`                 | `TDoc \| null`                        | The document, or `null` before it has loaded.                                                     |
| `error`               | `Error \| null`                       | The error from the last fetch.                                                                    |
| `loading`             | `boolean`                             | `true` while the document is being fetched. Also available as `isFetching`.                       |
| `isFinished`          | `boolean`                             | `true` once the current fetch has settled, with or without an error.                              |
| `canAbort`            | `boolean`                             | `true` while a fetch that can be aborted is in flight.                                            |
| `aborted`             | `boolean`                             | `true` if the last fetch was aborted.                                                             |
| `reload()`            | `() => Promise`                       | Fetches the document again. Resolves even if it fails, so check `error`. Also available as `execute()` and `fetch()`. |
| `abort()`             | `() => void`                          | Aborts the fetch in flight.                                                                       |
| `setValue`            | `useCall` result                      | `setValue.submit(values)` saves the given fields and puts the saved document in `doc`. Rejects if it fails. |
| `delete`              | `useCall` result                      | `delete.submit()` deletes the document and removes it from every `useDoc` and `useList`. Rejects if it fails. |
| `onSuccess(callback)` | `(callback: (doc) => void) => () => void` | Runs `callback` after each successful fetch by this `useDoc`. Returns a function that removes it. |
| one per `methods` key | `useCall` result                      | Runs that document method with `submit(params)`. Rejects if it fails.                             |

`setValue`, `delete` and the `methods` members have the same members as a
[`useCall`](./use-call.md#return-value) result, but each `submit()` sends its own
request, so two saves at the same time do not cancel each other.

## Errors

`setValue.submit()`, `delete.submit()` and the `methods` members reject when
they fail, so catch the error. `reload()` resolves and sets `error`. See
[Errors](./use-call.md#errors) for the rule and the error classes.

```js
try {
  await todo.setValue.submit({ status: 'Closed' })
} catch (error) {
  toast.error(error.message)
}
```

## Shared cache

Every `useDoc`, and every [`useList`](./use-list.md) row, for the same
`doctype` and `name` reads from one shared store. A `setValue` or `delete`
through any of them updates the document everywhere it shows. A document
created with [`useNewDoc`](./use-new-doc.md) is in the store as soon as its
`submit()` resolves.

Documents are also saved in IndexedDB. On the next page load, `useDoc` shows
the saved copy while it fetches the current one.

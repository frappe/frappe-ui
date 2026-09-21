# useDoc

`useDoc` fetches a single Frappe document and keeps it reactive. Documents are
shared across every `useDoc` call for the same `doctype`/`name` — two components
rendering the same document read the same cached copy and update together.

## Basic example

```vue
<template>
  <div v-if="todo.doc">
    {{ todo.doc.description }}
  </div>
  <Button @click="todo.setValue.submit({ status: 'Closed' })"> Close </Button>
</template>

<script setup>
import { useDoc } from 'frappe-ui'

const todo = useDoc({
  doctype: 'ToDo',
  name: 'TODO-0001',
})
</script>
```

## Reactive name

`name` accepts a `Ref` or a getter, so `useDoc` can follow a document that
changes — e.g. a `name` coming from the route:

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

The request refires automatically whenever `name` resolves to a new value.

## Document methods

`methods` exposes whitelisted document methods (`doc.run_method(...)` on the
server) as their own `useCall`-shaped members:

```vue
<script setup>
import { useDoc } from 'frappe-ui'

const todo = useDoc({
  doctype: 'ToDo',
  name: 'TODO-0001',
  methods: {
    // shorthand: the server method name
    markDone: 'mark_done',
    // full options, same shape as useCall (minus url/immediate/refetch)
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

## Options

- `doctype` — the DocType of the document.
- `name` — the document's name. Accepts a plain string, a `Ref<string>` or a
  getter for a reactively-changing document.
- `baseUrl` — prefix prepended to the generated request URLs.
- `url` — overrides the default `/api/v2/document/<doctype>/<name>` GET URL.
- `methods` — a map of member name to either a server method name (string), or a
  [`useCall`](./use-call.md) options object (minus `url`, `baseUrl`, `immediate`
  and `refetch`) plus a required `name` naming the server method. Defaults to
  `method: 'POST'`. A document method runs on `submit()` only, so `immediate`
  and `refetch` are fixed to `false` and are not accepted. Each entry becomes a
  `useCall`-shaped member on the returned object. A member name that is already
  part of the returned object (`doc`, `error`, `loading`, `setValue`, `delete`,
  `reload`, and the rest) throws at setup: rename the key and keep the server
  method name in `{ key: { name: '…' } }`.
- `immediate` — fire the initial GET automatically once `name` resolves.
  Defaults to `true`.
- `staleOnError` — when `true`, a failed refetch keeps showing the last known
  `doc` instead of clearing it. Defaults to `false`.
- `transform` — receives the fetched document (with `doctype` set) and returns
  the value `doc` should hold.

## Return value

- `doc` — the document, or `null` before it has been fetched.
- `error` — the error from the last fetch, or `null`.
- `loading` (alias `isFetching`) — `true` while the document is being fetched.
- `isFinished` — `true` once the current fetch has settled, either way.
- `canAbort` — `true` while a fetch that can still be aborted is in flight.
- `aborted` — `true` if the last fetch was aborted.
- `execute()` (aliases `fetch()`, `reload()`) — refetches the document. Resolves
  with the response, or with `null` when the fetch fails; read `error` after
  awaiting it.
- `abort()` — aborts the in-flight fetch.
- `setValue` — a [`useCall`](./use-call.md)-shaped member;
  `setValue.submit(values)` `PUT`s a partial update. When the document is
  loaded, `doc` shows `values` at once, and so do matching `useList` rows for
  the fields the loaded doc has; the response replaces them when it lands. It **rejects** when the update fails. `doc`
  reverts unless a response or fetch has replaced the doc since; each list row
  field reverts unless the row no longer holds the optimistic value, e.g. after
  a list reload.
- `delete` — a `useCall`-shaped member; `delete.submit()` deletes the document
  and clears it from every `useDoc`/`useList` reading it. It **rejects** when
  the delete fails.
- `onSuccess(callback)` — registers a callback that runs with the document every
  time _this_ `useDoc` call's own fetch (the initial load, or a `reload()`)
  succeeds. Returns an unsubscribe function.
- one member per entry in `methods`, each a `useCall`-shaped object.

## Errors

`setValue.submit()`, `delete.submit()` and every `methods:` member reject on
failure, so a `catch` block is the place to report it. `reload()` resolves and
sets `error` instead. See [the error table](./use-call.md#errors) for the rule
and the error classes.

```js
try {
  await todo.setValue.submit({ status: 'Closed' })
} catch (error) {
  toast.error(error.message)
}
```

## Shared cache

Every `useDoc` (and matching row in a [`useList`](./use-list.md)) for the same
`doctype`/`name` reads from one shared, reactive store. Calling `setValue` or
`delete` from any of them updates `doc` everywhere that document is being read,
and a document written by `useNewDoc` is immediately readable through `useDoc`
under its returned `name`.

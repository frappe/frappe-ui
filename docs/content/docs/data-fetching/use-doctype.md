# useDoctype

`useDoctype` groups the write operations for a DocType — insert, delete, set a
field, run a method — without fetching or holding any document itself. Use it
alongside [`useDoc`](./use-doc.md) or [`useList`](./use-list.md) for reads.

## Basic example

```vue
<script setup>
import { useDoctype } from 'frappe-ui'

const todo = useDoctype('ToDo')

async function create(description) {
  const doc = await todo.insert.submit({ description })
  console.log(doc.name)
}

async function close(name) {
  await todo.setValue.submit({ name, status: 'Closed' })
}
</script>
```

Every submit runs independently — closing two documents at once, or one document
twice, does not cancel either request.

## Running a method

```vue
<script setup>
import { useDoctype } from 'frappe-ui'

const user = useDoctype('User')

async function resetPassword(name) {
  await user.runDocMethod.submit({
    name,
    method: 'reset_password',
    params: { send_email: true },
  })
}

async function ping() {
  // a method on the DocType itself, not one document
  await user.runMethod.submit({ method: 'get_online_users' })
}
</script>
```

## Options

`useDoctype(doctype, options?)` — the DocType is a positional argument, not a
field on the options object.

- `doctype` — the DocType every member acts on.
- `options.baseUrl` — prefix prepended to the generated request URLs.

## Return value

Every member below shares the same shape: `data`, `error`, `loading` (`true`
while any submit for that member is in flight), `submit(params)`, and
`isLoading(...)` reporting on one target so a list can show a spinner on the row
it belongs to.

- `insert` — `insert.submit(values)` creates a document. `insert.isLoading()`
  takes no argument — a new document has no name yet to key on.
- `delete` — `delete.submit({ name })` deletes a document.
  `delete.isLoading(name)` reports on one document.
- `setValue` — `setValue.submit({ name, ...values })` updates one or more fields
  on a document. `setValue.isLoading(name)` reports on one document.
- `runDocMethod` — `runDocMethod.submit({ name, method, params?, validate? })`
  calls a whitelisted method on one document. `validate` runs first and, if it
  returns a string, rejects the submit with that message instead of sending a
  request. `runDocMethod.isLoading(name, method)` reports on one document/method
  pair.
- `runMethod` — `runMethod.submit({ method, params?, validate? })` calls a
  whitelisted method on the DocType itself, not a specific document.
  `runMethod.isLoading(method)` reports on one method.

`data` and `error` on each member belong to that member's most recently
_started_ submit, not the one that settles last — a slower, older submit still
resolves or rejects its own caller, but does not overwrite a newer submit's
`data`/`error`.

## Errors

`submit()` rejects with a
[`FrappeResponseError`](../other/utilities.md#frapperesponseerror) on a Frappe
error response, or with the `validate` message on `runDocMethod`/ `runMethod`.

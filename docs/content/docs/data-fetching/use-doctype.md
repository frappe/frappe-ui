# useDoctype

`useDoctype` creates, saves, deletes and runs methods on documents of one
DocType, without fetching any. Use it next to [`useDoc`](./use-doc.md) or
[`useList`](./use-list.md), which do the reading.

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

Each submit sends its own request. Closing two documents at once, or one
document twice, does not cancel either request.

## Run a method

`runDocMethod` calls a method on one document. `runMethod` calls a method on
the DocType itself:

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

async function loadOnlineUsers() {
  await user.runMethod.submit({ method: 'get_online_users' })
}
</script>
```

## Options

The DocType is the first argument: `useDoctype(doctype, options?)`.

| Name              | Type     | Default  | Description                        |
| ----------------- | -------- | -------- | ---------------------------------- |
| `doctype`         | `string` | required | The DocType every member acts on.  |
| `options.baseUrl` | `string` | `''`     | A prefix for every request URL.    |

## Return value

| Name           | Type         | Description                                                                                                  |
| -------------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `insert`       | write member | `insert.submit(values)` creates a document and resolves with it. `insert.isLoading()` takes no argument.     |
| `setValue`     | write member | `setValue.submit({ name, ...values })` saves fields of one document. `setValue.isLoading(name)` checks one document. |
| `delete`       | write member | `delete.submit({ name })` deletes one document. `delete.isLoading(name)` checks one document.                |
| `runDocMethod` | write member | `runDocMethod.submit({ name, method, params?, validate? })` calls a whitelisted method on one document. `runDocMethod.isLoading(name, method)` checks one pair. |
| `runMethod`    | write member | `runMethod.submit({ method, params?, validate? })` calls a whitelisted method on the DocType. `runMethod.isLoading(method)` checks one method. |

Every write member has these members:

| Name              | Type             | Description                                                                         |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `data`            | `T \| null`      | The response of the submit that started last.                                       |
| `error`           | `Error \| null`  | The error of the submit that started last.                                          |
| `loading`         | `boolean`        | `true` while any submit of this member is in flight.                                |
| `submit(params)`  | `(params) => Promise` | Sends the request. Resolves with the response, or rejects with the error.      |
| `isLoading(...)`  | `(...) => boolean` | `true` while a submit for one target is in flight, so a list can show it on one row. |

An older submit that settles after a newer one still resolves or rejects for
its own caller, but does not change `data` or `error`.

`setValue` and `delete` also update the document in every `useDoc` and
`useList` that shows it.

## Errors

`submit()` rejects with a
[`FrappeResponseError`](../other/utilities.md#frapperesponseerror) when the
server returns an error. On `runDocMethod` and `runMethod`, a `validate`
function runs first. If it returns a string, `submit()` rejects with that
message and sends no request.

# useNewDoc

`useNewDoc` holds a draft of a new document and creates it on `submit()`. Use it
for a "new document" form.

## Basic example

```vue
<template>
  <TextInput v-model="todo.doc.description" label="Description" />
  <Button :loading="todo.loading" @click="save">Create</Button>
</template>

<script setup>
import { useNewDoc } from 'frappe-ui'

const todo = useNewDoc('ToDo', { status: 'Open' })

async function save() {
  const doc = await todo.submit()
  console.log(doc.name)
}
</script>
```

## Open the created document

`submit()` resolves with the created document, including its `name`:

```js
async function save() {
  const created = await todo.submit()
  router.push({ name: 'Todo', params: { name: created.name } })
}
```

The created document is already in the shared cache, so a
[`useDoc`](./use-doc.md) on the next page shows it at once. `useDoc` still
fetches it in the background.

## Options

The arguments are positional: `useNewDoc(doctype, initialValues?, options?)`.

| Name            | Type         | Default  | Description                                                                                              |
| --------------- | ------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| `doctype`       | `string`     | required | The DocType of the new document.                                                                         |
| `initialValues` | `Partial<T>` | `{}`     | The starting field values of `doc`. `creation`, `modified`, `owner` and `modified_by` are not allowed.   |
| `options`       | `object`     | `{}`     | `baseUrl`, `initialData`, `transform`, `beforeSubmit`, `onSuccess` and `onError`, as in [`useCall`](./use-call.md#options). |

The other `useCall` options are fixed: `submit()` sends one `POST` that creates
the document from `doc`, and the response is not cached.

## Return value

| Name       | Type               | Description                                                                                        |
| ---------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| `doc`      | `Partial<T>`       | The reactive draft. Bind form fields to it. `submit()` sends what it holds at that moment.         |
| `submit()` | `() => Promise<T>` | Creates the document from `doc` and resolves with it. Rejects if it fails.                         |

It also returns the other [`useCall`](./use-call.md#return-value) members, such
as `data`, `error` and `loading`, for the insert request. `loading` is `true`
while any submit is in flight.

## Errors

`submit()` rejects when the insert fails, or when the response has no `name`.
See [Errors](./use-call.md#errors) for the rule and the error classes.

```js
try {
  await todo.submit()
} catch (error) {
  toast.error(error.message)
}
```
